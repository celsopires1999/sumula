import { GameForm } from "@/features/games/components/GameForm";
import {
  initialState as gameInitialState,
  useGetGameQuery,
  useUpdateGameMutation,
} from "@/features/games/GamesSlice";
import {
  useCreatePlaceMutation,
  useGetPlacesQuery,
} from "@/features/places/PlacesSlice";
import { Game, GamePayload } from "@/types/Games";
import { Place, PlacePayload } from "@/types/Places";
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
  const { data: places } = useGetPlacesQuery();
  const [gameState, setGameState] = useState<Game>(gameInitialState);
  const [updateGame, statusUpdateGame] = useUpdateGameMutation();
  const [createPlace, statusCreatePlace] = useCreatePlaceMutation();

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
    await updateGame({ id, gamePayload });
  }

  async function handleCreatePlace(
    placePayload: PlacePayload
  ): Promise<Place | undefined> {
    try {
      const result = createPlace(placePayload).unwrap();
      return result;
    } catch (e) {
      console.error(e);
      enqueueSnackbar(`Place not created`, { variant: "error" });
    }
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

  useEffect(() => {
    if (statusCreatePlace.isSuccess) {
      enqueueSnackbar(`Place created successfully`, {
        variant: "success",
      });
    }
    if (statusCreatePlace.error) {
      enqueueSnackbar(`Place not created`, { variant: "error" });
    }
  }, [enqueueSnackbar, statusCreatePlace.error, statusCreatePlace.isSuccess]);

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
          places={places ?? []}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          handleDateChange={handleDateChange}
          handlePlaceChange={handlePlaceChange}
          handleCreatePlace={handleCreatePlace}
          isLoading={isFetching || statusUpdateGame.isLoading}
          isDisabled={statusUpdateGame.isLoading}
        />
      </Paper>
    </Box>
  );
}

export default GameEditPage;
