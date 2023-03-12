import { Game, GamePayload } from "@/types/Game";
import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { GameForm } from "@/features/games/components/GameForm";
import {
  initialState as gameInitialState,
  useCreateGameMutation,
} from "@/features/games/GamesSlice";
import { Place } from "@/types/Place";
import { Team } from "@/types/Team";

function GameCreatePage() {
  const { enqueueSnackbar } = useSnackbar();
  const [createGame, statusCreateGame] = useCreateGameMutation();
  const [gameState, setGameState] = useState<Game>(gameInitialState);

  function handleChange(
    name: string,
    value: Date | Game | Place | Team | undefined
  ) {
    if (!value) {
      return;
    }
    setGameState({ ...gameState, [name]: value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const gamePayload: GamePayload = {
      // date: gameState.date.toJSON(),
      date: gameState.date,
      place_id: gameState.place.id,
      host_id: gameState.host.id,
      visitor_id: gameState.visitor.id,
    };

    try {
      const result = await createGame(gamePayload).unwrap();
      setGameState(gameInitialState);
      return result;
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    if (statusCreateGame.isSuccess) {
      enqueueSnackbar(`Game created successfully`, {
        variant: "success",
      });
    }
    if (statusCreateGame.error) {
      enqueueSnackbar(`Game not created`, { variant: "error" });
    }
  }, [enqueueSnackbar, statusCreateGame.error, statusCreateGame.isSuccess]);

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
          isLoading={statusCreateGame.isLoading}
          isDisabled={statusCreateGame.isLoading}
        />
      </Paper>
    </Box>
  );
}

export default GameCreatePage;
