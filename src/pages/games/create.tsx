import { Game, GamePayload } from "@/types/Games";
import { Place, PlacePayload } from "@/types/Places";
import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { GameForm } from "@/features/games/components/GameForm";
import {
  initialState as gameInitialState,
  useCreateGameMutation,
} from "@/features/games/GamesSlice";
import {
  useCreatePlaceMutation,
  useGetPlacesQuery,
} from "@/features/places/PlacesSlice";

function GameCreatePage() {
  const { enqueueSnackbar } = useSnackbar();
  const { data: places } = useGetPlacesQuery();
  const [createGame, statusCreateGame] = useCreateGameMutation();
  const [createPlace, statusCreatePlace] = useCreatePlaceMutation();
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
    if (statusCreateGame.isSuccess) {
      enqueueSnackbar(`Game created successfully`, {
        variant: "success",
      });
    }
    if (statusCreateGame.error) {
      enqueueSnackbar(`Game not created`, { variant: "error" });
    }
  }, [enqueueSnackbar, statusCreateGame.error, statusCreateGame.isSuccess]);

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
            <Typography variant="h4">Create Game</Typography>
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
          isLoading={statusCreateGame.isLoading}
          isDisabled={statusCreateGame.isLoading}
        />
      </Paper>
    </Box>
  );
}

export default GameCreatePage;
