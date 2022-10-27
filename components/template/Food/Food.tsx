import Image from "next/image";
import Layout from "@/components/Layout/Layout";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import { Star } from "@/components/Star/Star";
import { UserIcon } from "@heroicons/react/outline";
import supabase from "../../../utils/supabase";
import { Loader, Center } from "@mantine/core";
import { useUser } from "@supabase/auth-helpers-react";

const Food = ({ food, owner }) => {
  const router = useRouter();
  const user = useUser();

  const isOwner = user && owner && user.id === owner.id;
  const [deleting, setDeleting] = useState(false);

  const deleteFood = async () => {
    let toastId;
    try {
      toastId = toast.loading("Deleting...");
      setDeleting(true);
      // Delete food from DB
      await supabase.from("food").delete().eq("id", food.id);

      await supabase.from("api_usage").insert([
        {
          api_name: "delete_food",
          called_by: user.id,
        },
      ]);

      // Redirect user
      toast.success("Successfully deleted", { id: toastId });
      router.push("/");
    } catch (e) {
      toast.error("Unable to delete food", { id: toastId });
      setDeleting(false);
    }
  };

  if (router.isFallback) {
    return (
      <Center style={{ width: "100vw", height: "100vh" }}>
        <Loader variant="bars" size="xl" />
      </Center>
    );
  }

  return (
    <Layout>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:space-x-4">
          <div>
            <h1 className="flex items-center justify-center text-2xl font-semibold truncate">
              {food?.title ?? ""}
              <span className="ml-2">
                <Star rating={food.rating} size={30} />
              </span>
            </h1>
          </div>

          {isOwner ? (
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => router.push(`/foods/${food.id}/edit`)}
                className="px-4 py-1 text-gray-800 transition border border-gray-800 rounded-md hover:bg-gray-800 hover:text-white disabled:text-gray-800 disabled:bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Edit
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={deleteFood}
                className="px-4 py-1 transition border rounded-md border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white focus:outline-none disabled:bg-rose-500 disabled:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete
              </button>
            </div>
          ) : null}
        </div>

        <div
          className="flex items-center w-full gap-5 mt-5 cursor-pointer"
          onClick={() => {
            router.push(`/${food.owner.id}`);
          }}
        >
          <p>By: </p>
          {owner.image ? (
            <div className="w-10 h-10 ml-2 overflow-hidden rounded-full">
              <Image
                src={owner.image}
                alt={owner.name || "Avatar"}
                layout="responsive"
                width={10}
                height={10}
                objectFit="contain"
              />
            </div>
          ) : (
            <UserIcon className="w-6 h-6 text-gray-400" />
          )}
          <p>{food.owner.name}</p>
        </div>

        <div className="relative mt-6 overflow-hidden bg-gray-200 rounded-lg shadow-md aspect-w-16 aspect-h-9">
          {food?.image ? (
            <Image
              src={food.image}
              alt={food.title}
              layout="fill"
              objectFit="cover"
            />
          ) : null}
        </div>

        <p className="mt-8 text-lg">{food?.description ?? ""}</p>
      </div>
    </Layout>
  );
};

export default Food;
