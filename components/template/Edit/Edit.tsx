import Layout from "@/components/Layout/Layout";
import ListingForm from "@/components/ListingForm/ListingForm";
import supabase from "@/utils/supabase";
import { useUser } from "@supabase/auth-helpers-react";
import { FoodType } from "@/types/types";

interface Props {
  food: FoodType;
}

const Edit = ({ food }: Props) => {
  const user = useUser();

  const handleOnSubmit = async (data) => {
    await supabase.from("food").update([data]).eq("id", food.id);
    await supabase.from("api_usage").insert([
      {
        api_name: "update_food",
        called_by: user.id,
      },
    ]);
  };

  return (
    <Layout>
      <div className="max-w-screen-sm mx-auto">
        <h1 className="text-xl font-medium text-gray-800">
          Edit your Favorite Food
        </h1>
        <p className="text-gray-500">
          Fill out the form below to update your Favorite food.
        </p>
        <div className="mt-8">
          {food ? (
            <ListingForm
              initialValues={food}
              buttonText="Update food"
              redirectPath={`/foods/${food.id}`}
              onSubmit={handleOnSubmit}
            />
          ) : null}
        </div>
      </div>
    </Layout>
  );
};

export default Edit;
