import { NextPage, GetServerSideProps } from "next";
import UserProfile from "@/components/template/UserProfile/UserProfile";
import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { FoodType, UserType } from "@/types/types";

export const getServerSideProps: GetServerSideProps = withPageAuth({
  redirectTo: "/",
  async getServerSideProps(ctx, supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (ctx.query.userId === user.id) {
      return {
        redirect: {
          permanent: false,
          destination: "/my-foods",
        },
      };
    }

    const { data: fetchedFoods } = await supabase
      .from("food")
      .select("*")
      .eq("is_public", true)
      .eq("owner", ctx.query.userId);

    await supabase.from("api_usage").insert([
      {
        api_name: "get_food",
        called_by: user.id,
      },
    ]);

    const { data: fetchedUser } = await supabase
      .from("user")
      .select("*")
      .eq("id", ctx.query.userId)
      .single();

    return { props: { foods: fetchedFoods, profile: fetchedUser } };
  },
});

interface Props {
  foods: FoodType[];
  profile: UserType;
}

const UserProfilePage: NextPage = ({ foods, profile }: Props) => {
  return <UserProfile foods={foods} profile={profile} />;
};

export default UserProfilePage;
