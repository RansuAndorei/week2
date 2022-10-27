import { useState } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { Formik, Form } from "formik";
import Input from "@/components/Input/Input";
import ImageUpload from "@/components/ImageUpload/ImageUpload";
import axios from "axios";
import { Switch } from "@mantine/core";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Compressor from "compressorjs";
import { CompressorType } from "@/types/types";

const ListingSchema = Yup.object().shape({
  title: Yup.string().trim().required(),
  description: Yup.string().trim().required(),
  rating: Yup.number().positive().integer().min(1).max(5).required(),
});

const ListingForm = ({
  initialValues = null,
  redirectPath = "",
  buttonText = "Submit",
  onSubmit,
}) => {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [disabled, setDisabled] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialValues?.image ?? "");
  const [isPublic, setIsPublic] = useState(initialValues?.is_public ?? true);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const dataURLtoFile = (dataurl) => {
    const arr = dataurl.split(","),
      bstr = atob(arr[1]);

    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], "compressed", { type: "image/jpeg" });
  };

  const handleCompressedUpload = async (image) => {
    return new Compressor(image, {
      quality: 0.8,
      success: async (compressedResult) => {
        return compressedResult;
      },
    });
  };

  const upload = async (image) => {
    if (!image) return;

    let toastId;
    try {
      setDisabled(true);
      toastId = toast.loading("Uploading...");

      const convertedImage = dataURLtoFile(image);
      const result = await handleCompressedUpload(convertedImage);
      const newResult = result as unknown as CompressorType;
      const base64Image = await toBase64(newResult.file);

      const { data } = await supabase.functions.invoke("compress", {
        body: JSON.stringify({ image: base64Image }),
      });
      const compressedAndConverted = await axios.post("/api/image-upload", {
        image: data,
      });

      setImageUrl(compressedAndConverted.data.url);

      toast.success("Successfully uploaded", { id: toastId });
    } catch (e) {
      console.log(e.message);
      toast.error("Unable to upload", { id: toastId });
      setImageUrl("");
    } finally {
      setDisabled(false);
    }
  };

  const handleOnSubmit = async (values = null) => {
    let toastId;
    try {
      setDisabled(true);
      toastId = toast.loading("Submitting...");

      // Submit data
      const { data } = await supabase.auth.getUser();
      if (typeof onSubmit === "function") {
        await onSubmit({
          ...values,
          is_public: isPublic,
          image: imageUrl,
          owner: data.user.id,
        });
      }
      toast.success("Successfully submitted", { id: toastId });

      // // Redirect user
      if (redirectPath) {
        router.push(redirectPath);
      }
    } catch (e) {
      console.log(e.message);
      toast.error("Unable to submit", { id: toastId });
      setDisabled(false);
    }
  };

  const { image, ...initialFormValues } = initialValues ?? {
    image: "",
    title: "",
    description: "",
    rating: 1,
  };

  return (
    <div>
      <div className="max-w-md mb-8">
        <ImageUpload
          initialImage={{ src: image, alt: initialFormValues.title }}
          onChangePicture={upload}
        />
      </div>

      <Formik
        initialValues={initialFormValues}
        validationSchema={ListingSchema}
        validateOnBlur={false}
        onSubmit={handleOnSubmit}
      >
        {({ isSubmitting, isValid }) => (
          <Form className="space-y-8">
            <div className="space-y-6">
              <Input
                name="title"
                type="text"
                label="Title"
                placeholder="Creamy Carbonara"
                disabled={disabled}
                data-testid="titleInput"
              />

              <Input
                id="descriptionInput"
                name="description"
                type="textarea"
                label="Description"
                placeholder="A dish of hot pasta into which other ingredients have been mixed. often used as a ..."
                disabled={disabled}
                rows={5}
                data-testid="descriptionInput"
              />

              <div className="flex items-center justify-center gap-5">
                <Input
                  name="rating"
                  type="number"
                  min="1"
                  max="5"
                  label="Rating"
                  placeholder="5"
                  disabled={disabled}
                  className="flex-1"
                />
                <Switch
                  label="Public Food"
                  className="mr-5 mt-7"
                  onChange={(e) => {
                    setIsPublic(e.currentTarget.checked);
                  }}
                  checked={isPublic}
                  disabled={disabled}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                id="addNewFoodButton"
                type="submit"
                disabled={disabled || !isValid}
                className="px-6 py-2 text-white transition rounded-md bg-rose-600 focus:outline-none focus:ring-4 focus:ring-rose-600 focus:ring-opacity-50 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-rose-600"
              >
                {isSubmitting ? "Submitting..." : buttonText}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

ListingForm.propTypes = {
  initialValues: PropTypes.shape({
    image: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    rating: PropTypes.number,
  }),
  redirectPath: PropTypes.string,
  buttonText: PropTypes.string,
  onSubmit: PropTypes.func,
};

export default ListingForm;
