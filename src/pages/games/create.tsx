import { Game, GamePayload } from "@/types/Games";
import { Place } from "@/types/Places";
import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { GameForm } from "../../features/games/components/GameForm";
import {
  initialState as gameInitialState,
  useCreateGameMutation,
} from "../../features/games/GamesSlice";

function GameCreatePage() {
  const { enqueueSnackbar } = useSnackbar();
  const [gameState, setGameState] = useState<Game>(gameInitialState);
  const [createGame, status] = useCreateGameMutation();

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

  const handlePlaceChange = (value: Place | undefined) => {
    if (!value) {
      return;
    }
    setGameState({ ...gameState, ...{ place: value } });
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const gamePayload: GamePayload = {
      date: gameState.date.toJSON(),
      place: gameState.place,
      host: gameState.host,
      visitor: gameState.visitor,
    };
    await createGame(gamePayload);
  }

  useEffect(() => {
    if (status.isSuccess) {
      enqueueSnackbar(`Game created successfully`, {
        variant: "success",
      });
    }
    if (status.error) {
      enqueueSnackbar(`Game not created`, { variant: "error" });
    }
  }, [enqueueSnackbar, status.error, status.isSuccess]);

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
          handlePlaceChange={handlePlaceChange}
          isLoading={status.isLoading}
          isDisabled={status.isLoading}
        />
      </Paper>
    </Box>
  );
}

export default GameCreatePage;
