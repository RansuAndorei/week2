import Layout from "@/components/Layout/Layout";
import Grid from "@/components/Grid/Grid";
import Image from "next/image";
import { UserIcon } from "@heroicons/react/outline";
import { Loader, Center } from "@mantine/core";
import { FoodType, UserType } from "@/types/types";

interface Props {
  foods: FoodType[];
  profile: UserType;
}

const UserProfile = ({ foods, profile }: Props) => {
  if (!profile) {
    return (
      <Center style={{ width: "100vw", height: "100vh" }}>
        <Loader variant="bars" size="xl" />
      </Center>
    );
  }

  return (
    <Layout>
      <div className="flex items-center w-full gap-5 mt-5 cursor-pointer">
        {profile.image ? (
          <div className="w-10 h-10 ml-2 overflow-hidden rounded-full">
            <Image
              src={profile.image}
              alt={profile.name || "Avatar"}
              layout="responsive"
              width={10}
              height={10}
              objectFit="contain"
            />
          </div>
        ) : (
          <UserIcon className="w-6 h-6 text-gray-400" />
        )}
        <h1 className="text-xl font-medium text-gray-800">{profile.name}</h1>
      </div>

      <p className="mt-5 text-gray-500">Listed Foods</p>
      <div className="mt-8">
        <Grid foods={foods} />
      </div>
    </Layout>
  );
};

export default UserProfile;
