import { NextPage } from "next";
import { useState } from "react";
import { Title, Text, Button } from "@mantine/core";
import axios from "axios";
import { useUser } from "@supabase/auth-helpers-react";

const FoodAPIPage: NextPage = () => {
  const user = useUser();
  const [foods, setFoods] = useState<string>("");
  const [allUsersRemaining, setAllUsersRemaining] = useState("");
  const [specificUsersRemaining, setSpecificUsersRemaining] = useState("");
  const [specificUsersPerMinuteRemaining, setSpecificUsersPerMinuteRemaining] =
    useState("");

  const fetchApi = async () => {
    try {
      const data = (await axios.get(`api/food-api?id=${user.id}`)).data;
      setFoods(JSON.stringify(data.foods, null, 2));
      setAllUsersRemaining(data.allUsersRemaining);
      setSpecificUsersRemaining(data.accountPerDayRemaining);
      setSpecificUsersPerMinuteRemaining(data.requestTimeoutReamining);
    } catch (e) {
      console.log(e);
      alert(e.response.data.message);
    }
  };

  if (user) {
    return (
      <div className="flex flex-col items-start gap-5 p-20 border-8">
        <Title>FOOD API</Title>
        <Title order={5}>{user.email}</Title>
        {foods && (
          <div className="flex gap-5">
            <div className="flex gap-2">
              <Title order={6}>All Users: </Title>
              <Text>{allUsersRemaining}</Text>
            </div>
            <div className="flex gap-2">
              <Title order={6}>This User: </Title>
              <Text>{specificUsersRemaining}</Text>
            </div>
            <div className="flex gap-2">
              <Title order={6}>This User per minute: </Title>
              <Text>{specificUsersPerMinuteRemaining}</Text>
            </div>
          </div>
        )}
        <Button color="dark" uppercase variant="outline" onClick={fetchApi}>
          Fetch API
        </Button>
        <pre>{foods}</pre>
      </div>
    );
  }
};

export default FoodAPIPage;
