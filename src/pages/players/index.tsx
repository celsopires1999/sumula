import { Layout } from "@/components/Layout";
import { Button, Theme } from "@mui/material";
import { GetServerSideProps } from "next";

type PlayersProps = {
  name: string;
  children: React.ReactNode;
  currentTheme: Theme;
  toggle: () => void;
};

function PlayersPage({ name, currentTheme, toggle }: PlayersProps) {
  return (
    <Layout currentTheme={currentTheme} toggle={toggle}>
      <div>
        <Button variant="contained">Ok</Button>
      </div>
      {name}
    </Layout>
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
