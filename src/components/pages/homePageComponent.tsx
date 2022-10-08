import { useSelectUsersQuery } from "@/utils/apollo/generated";
import { Card } from "@mui/material";

export const HomePageComponent = () => {
  const { data } = useSelectUsersQuery();
  console.dir(data);

  return (
    <Card>
    </Card>
  );
};
