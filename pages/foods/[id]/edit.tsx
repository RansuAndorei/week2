import { NextPage, GetServerSideProps } from "next";
import Edit from "@/components/template/Edit/Edit";
import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { FoodType } from "@/types/types";

export const getServerSideProps: GetServerSideProps = withPageAuth({
  redirectTo: "/",
  async getServerSideProps(ctx, supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: food } = await supabase
      .from("food")
      .select("*")
      .eq("owner", user.id)
      .eq("id", ctx.query.id)
      .single();

    await supabase.from("api_usage").insert([
      {
        api_name: "get_food",
        called_by: user.id,
      },
    ]);

    if (!food) {
      return {
        redirect: {
          permanent: false,
          destination: "/",
        },
      };
    }

    return { props: { food } };
  },
});

interface Props {
  food: FoodType;
}

const EditPage: NextPage = ({ food }: Props) => {
  return <Edit food={food} />;
};

export default EditPage;
