import Layout from "@/components/Layout/Layout";
import Grid from "@/components/Grid/Grid";
import { FoodType } from "@/types/types";

interface Props {
  foods: FoodType[];
}

const MyFood = ({ foods }: Props) => {
  return (
    <Layout>
      <h1 className="text-xl font-medium text-gray-800">
        Top-rated foods to eat
      </h1>
      <p className="text-gray-500">
        Explore some of the best foods in the world
      </p>
      <div className="mt-8">
        <Grid foods={foods} />
      </div>
    </Layout>
  );
};

export default MyFood;
