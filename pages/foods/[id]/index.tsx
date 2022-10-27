import supabase from "@/utils/supabase";
import { NextPage, GetStaticProps, GetStaticPaths } from "next";
import Food from "@/components/template/Food/Food";
import { FoodType, UserType } from "@/types/types";

export const getStaticPaths: GetStaticPaths = async () => {
  // Get all the foods IDs from the database
  const { data: foods } = await supabase.from("food").select("id");

  return {
    paths: foods.map((food) => ({
      params: { id: `${food.id}` },
    })),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // Get the current food from the database
  const { data: food } = await supabase
    .from("food")
    .select("*, owner(*)")
    .eq("id", params.id)
    .single();

  if (food) {
    return {
      props: {
        food: food,
        owner: food.owner,
      },
    };
  }

  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
};

interface Props {
  food: FoodType;
  owner: UserType;
}

const FoodPage: NextPage = ({ food, owner }: Props) => {
  return <Food food={food} owner={owner} />;
};

export default FoodPage;
