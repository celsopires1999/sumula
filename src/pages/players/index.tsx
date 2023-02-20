import { Button, Theme } from "@mui/material";
import { GetServerSideProps } from "next";

type PlayersProps = {
  name: string;
};

function PlayersPage({ name }: PlayersProps) {
  return (
    <>
      <div>
        <Button variant="contained">Ok</Button>
      </div>
      {name}
    </>
  );
}

export default PlayersPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      name: "Celso",
    },
  };
};
