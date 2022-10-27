import supabase from "@/utils/supabase";
import Home from "@/components/template/Home/Home";
import { NextPage, GetServerSideProps } from "next";
import { FoodType } from "@/types/types";

export const getServerSideProps: GetServerSideProps = async () => {
  const { data: foods, error } = await supabase
    .from("food")
    .select("*")
    .eq("is_public", true);

  if (error) {
    console.log(error.message);
  }

  return {
    props: {
      foods,
    },
  };
};

interface Props {
  foods: FoodType[];
}

const HomePage: NextPage = ({ foods }: Props) => {
  return <Home foods={foods} />;
};

export default HomePage;
