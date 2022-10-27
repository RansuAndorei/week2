import { NextPage, GetServerSideProps } from "next";
import MyFood from "@/components/template/MyFood/MyFood";
import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { FoodType } from "@/types/types";

export const getServerSideProps: GetServerSideProps = withPageAuth({
  redirectTo: "/",
  async getServerSideProps(ctx, supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: fetchedFoods } = await supabase
      .from("food")
      .select("*")
      .eq("owner", user.id);

    await supabase.from("api_usage").insert([
      {
        api_name: "get_food",
        called_by: user.id,
      },
    ]);

    return { props: { foods: fetchedFoods } };
  },
});

interface Props {
  foods: FoodType[];
}

const MyFoodsPage: NextPage = ({ foods }: Props) => {
  return <MyFood foods={foods} />;
};

export default MyFoodsPage;
