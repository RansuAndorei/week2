import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Layout from "@/components/Layout/Layout";
import Grid from "@/components/Grid/Grid";
import { useEffect } from "react";
import { FoodType } from "@/types/types";

interface Props {
  foods: FoodType[];
}

const Home = ({ foods }: Props) => {
  const user = useUser();

  const supabase = useSupabaseClient();

  useEffect(() => {
    const setUser = async () => {
      if (user) {
        const { data } = await supabase
          .from("user")
          .select("*")
          .eq("id", user.id)
          .single();

        if (data && !data.is_signed_in) {
          let provider = "";

          if (Object.keys(user.user_metadata).length !== 0) {
            if (user.user_metadata.iss.includes("google")) {
              provider = "google";
            } else if (user.user_metadata.iss.includes("github")) {
              provider = "github";
            } else if (user.user_metadata.iss.includes("facebook")) {
              provider = "facebook";
            }
          } else {
            provider = "email";
          }

          await supabase
            .from("history")
            .select("*")
            .order("id", "desc")
            .eq("user", user.id)
            .single();

          await supabase.from("history").insert([
            {
              user: user.id,
              provider: provider,
            },
          ]);

          await supabase
            .from("user")
            .update({ is_signed_in: true })
            .eq("id", user.id);
        } else {
          const { data: history } = await supabase
            .from("history")
            .select("*")
            .eq("user", user.id)
            .order("id", { ascending: false })
            .limit(2);
          if (
            history[0] &&
            history[1] &&
            history[0].provider === history[1].provider &&
            new Date(history[0].created_at).getTime() / 1000 -
              new Date(history[1].created_at).getTime() / 1000 <
              5
          ) {
            await supabase.from("history").delete().eq("id", history[0].id);
          }
        }
      }
    };
    setUser();
  }, [user, supabase]);

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

export default Home;
