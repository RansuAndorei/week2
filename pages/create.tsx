import Create from "@/components/template/Create/Create";
import { NextPage, GetServerSideProps } from "next";
import { withPageAuth } from "@supabase/auth-helpers-nextjs";

export const getServerSideProps: GetServerSideProps = withPageAuth({
  redirectTo: "/",
});

const CreatePage: NextPage = () => {
  return <Create />;
};

export default CreatePage;
