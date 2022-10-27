import Layout from "@/components/Layout/Layout";
import ListingForm from "@/components/ListingForm/ListingForm";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUser } from "@supabase/auth-helpers-react";

const Create = () => {
  const user = useUser();
  const supabase = useSupabaseClient();

  const addFood = async (data) => {
    await supabase.from("food").insert([data]);
    await supabase.from("api_usage").insert([
      {
        api_name: "add_food",
        called_by: user.id,
      },
    ]);
  };

  return (
    <Layout>
      <div className="max-w-screen-sm mx-auto">
        <h1 className="text-xl font-medium text-gray-800">
          List your Favorite Food
        </h1>
        <p className="text-gray-500">
          Fill out the form below to list a new Favorite Food.
        </p>
        <div className="mt-8">
          <ListingForm
            buttonText="Add food"
            redirectPath="/"
            onSubmit={addFood}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Create;
