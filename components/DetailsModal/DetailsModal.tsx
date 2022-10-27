import { Fragment, useState, useEffect } from "react";
import Link from "next/link";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { Formik, Form } from "formik";
import { Dialog, Transition } from "@headlessui/react";
import { CakeIcon } from "@heroicons/react/outline";
import Input from "@/components/Input/Input";
import { useRouter } from "next/router";
import supabase from "@/utils/supabase";
import { useUser } from "@supabase/auth-helpers-react";

const SignInSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  username: Yup.string().trim().required("Username is required"),
});

const DetailsModal = ({ show = false, onClose = () => null }) => {
  const [disabled, setDisabled] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  const user = useUser();

  const router = useRouter();

  const handleConfirm = async ({ name, username }) => {
    let toastId;
    try {
      toastId = toast.loading("Loading...");
      setDisabled(true);

      await supabase.from("user").insert([
        {
          id: user.id,
          name: name,
          email: user.email,
          username: username,
          image: user.user_metadata.avatar_url,
        },
      ]);

      router.reload();
      toast.dismiss(toastId);
    } catch (err) {
      console.log(err.message);
      toast.error("Unable to sign in", { id: toastId });
    } finally {
      setDisabled(false);
    }
  };

  const closeModal = () => {
    if (typeof onClose === "function") {
      onClose();
    }
  };

  // Reset modal
  useEffect(() => {
    if (!show) {
      // Wait for 200ms for aniamtion to finish
      setTimeout(() => {
        setDisabled(false);

        setShowSignIn(false);
      }, 200);
    }
  }, [show]);

  // Remove pending toasts if any
  useEffect(() => {
    toast.dismiss();
  }, []);

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={closeModal}
      >
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-75" />

        <div className="min-h-screen text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="relative inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl sm:rounded-md">
              <div className="py-12">
                <div className="px-4 sm:px-12">
                  <div className="flex justify-center">
                    <Link href="/">
                      <a className="flex items-center space-x-1">
                        <CakeIcon className="w-8 h-8 shrink-0 text-rose-500" />
                        <span
                          className="text-xl font-semibold tracking-wide"
                          data-testid="detailsModalLogo"
                        >
                          Favorite<span className="text-rose-500">Foods</span>
                        </span>
                      </a>
                    </Link>
                  </div>

                  <Dialog.Title
                    as="h3"
                    className="mt-6 text-lg font-bold text-center sm:text-2xl"
                  >
                    {showSignIn ? "Welcome back!" : "Finish Account Setup"}
                  </Dialog.Title>

                  {!showSignIn ? (
                    <Dialog.Description className="mt-2 text-base text-center text-gray-500">
                      Please enter your account details.
                    </Dialog.Description>
                  ) : null}

                  <div className="mt-10" data-testid="detailsModalForm">
                    <Formik
                      initialValues={{
                        name: "",
                        username: "",
                      }}
                      validationSchema={SignInSchema}
                      validateOnBlur={false}
                      onSubmit={handleConfirm}
                    >
                      {({ isSubmitting, isValid }) => (
                        <Form className="mt-4">
                          <Input
                            name="name"
                            type="text"
                            placeholder="Name"
                            disabled={disabled}
                            spellCheck={false}
                            data-testid="nameInput"
                          />

                          <Input
                            name="username"
                            type="text"
                            placeholder="Username"
                            disabled={disabled}
                            spellCheck={false}
                            className="mt-1"
                            data-testid="usernameInput"
                          />

                          <button
                            type="submit"
                            disabled={disabled || !isValid}
                            className="w-full px-8 py-2 mt-6 text-white transition rounded-md bg-rose-600 focus:outline-none focus:ring-4 focus:ring-rose-600 focus:ring-opacity-50 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-rose-600"
                          >
                            {isSubmitting ? "Loading..." : "Confirm"}
                          </button>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

DetailsModal.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
};

export default DetailsModal;
