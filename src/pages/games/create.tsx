import { Game } from "@/types/Games";
import { Box, Paper, Typography } from "@mui/material";
import { useState } from "react";
import { GameForm } from "../../features/games/components/GameForm";
function GamePage() {
  const gameInitialState: Game = {
    id: "",
    date: new Date(),
    place: "",
    host: "",
    visitor: "",
  };
  const [gameState, setGameState] = useState<Game>(gameInitialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGameState({ ...gameState, [name]: value });
  };

  const handleDateChange = (value: Date | undefined) => {
    if (!value) {
      return;
    }
    setGameState({ ...gameState, ...{ date: value } });
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("Submitted");
    // const { videoPayload } = mapVideoPayload(videoState);
    // try {
    //   const { data } = await createVideo(videoPayload).unwrap();
    //   handleSubmitUploads(data.id);
    // } catch (e) {
    //   enqueueSnackbar(`Video not created`, { variant: "error" });
    // }
  }

  return (
    <Box>
      <Paper>
        <Box p={2}>
          <Box mb={2}>
            <Typography variant="h4">Create Game</Typography>
          </Box>
        </Box>
        <GameForm
          game={gameState}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          handleDateChange={handleDateChange}
        />
      </Paper>
    </Box>
  );
}

export default GamePage;
