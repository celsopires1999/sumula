import { GameForm } from "@/frontend/src/features/games/components/GameForm";
import {
  initialState as gameInitialState,
  useGetGameQuery,
  useUpdateGameMutation,
} from "@/frontend/src/features/games/GamesSlice";
import { Game, GamePayload } from "@/types/Game";
import { Place } from "@/types/Place";
import { Team } from "@/types/Team";
import { Box, Paper, Typography } from "@mui/material";
import { skipToken } from "@reduxjs/toolkit/query";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";

function GameEditPage() {
  const router = useRouter();

  const id = router.query.id as any;
  const result = useGetGameQuery(typeof id === "string" ? { id } : skipToken, {
    // If the page is not yet generated, router.isFallback will be true
    // initially until getStaticProps() finishes running
    skip: router.isFallback,
  });
  const { isFetching, data: apiGame } = result;

  const { enqueueSnackbar } = useSnackbar();
  const [gameState, setGameState] = useState<Game>(gameInitialState);
  const [updateGame, statusUpdateGame] = useUpdateGameMutation();

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
    await updateGame({ id, gamePayload });
  }

  useEffect(() => {
    if (apiGame) {
      const game: Game = {
        id: apiGame.id,
        date: new Date(apiGame.date),
        place: apiGame.place,
        host: apiGame.host,
        visitor: apiGame.visitor,
      };
      setGameState(game);
    }
  }, [apiGame]);

  useEffect(() => {
    if (statusUpdateGame.isSuccess) {
      enqueueSnackbar(`Game updated successfully`, {
        variant: "success",
      });
    }
    if (statusUpdateGame.error) {
      enqueueSnackbar(`Game not updated`, { variant: "error" });
    }
  }, [enqueueSnackbar, statusUpdateGame.error, statusUpdateGame.isSuccess]);

  return (
    <Box>
      <Paper>
        <Box p={2}>
          <Box mb={2}>
            <Typography variant="h4">Edit Game</Typography>
          </Box>
        </Box>
        <GameForm
          game={gameState}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          isLoading={isFetching || statusUpdateGame.isLoading}
          isDisabled={statusUpdateGame.isLoading}
        />
      </Paper>
    </Box>
  );
}

export default GameEditPage;
