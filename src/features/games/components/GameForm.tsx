import { DateTime } from "@/components/DateTime";
import { PlaceAutocomplete } from "@/features/places/components/PlaceAutocomplete";
import { Place, PlacePayload } from "@/types/Places";
import { Box, Button, FormControl, Grid, TextField } from "@mui/material";
import "dayjs/locale/pt-br";
import Link from "next/link";
import { Game } from "../../../types/Games";

type Props = {
  game: Game;
  places: Place[];
  isLoading?: boolean;
  isDisabled?: boolean;
  handleDateChange: (value: Date | undefined) => void;
  handlePlaceChange: (value: Place | undefined) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCreatePlace: (placePayload: PlacePayload) => Promise<Place | undefined>;
};
export const GameForm = ({
  game,
  places,
  isLoading = false,
  isDisabled = false,
  handleSubmit,
  handleChange,
  handleDateChange,
  handleCreatePlace,
  handlePlaceChange,
}: Props) => {
  return (
    <Box p={2}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sx={{ "& .MuiTextField-root": { my: 2 } }}>
            {/* Date */}
            <FormControl fullWidth>
              <DateTime
                value={game.date}
                label="Game Day"
                handleDateChange={handleDateChange}
              />
            </FormControl>
            {/* Place */}
            <FormControl fullWidth>
              <PlaceAutocomplete
                id="place"
                label="Place"
                places={places}
                value={game.place}
                handlePlaceChange={handlePlaceChange}
                handleCreatePlace={handleCreatePlace}
              />
            </FormControl>
            {/* Host */}
            <FormControl fullWidth>
              <TextField
                required
                name="host"
                label="Host"
                value={game.host}
                autoComplete="off"
                disabled={isDisabled || isLoading}
                inputProps={{ "data-testid": "host" }}
                onChange={handleChange}
              />
            </FormControl>
            {/* Host */}
            <FormControl fullWidth>
              <TextField
                required
                name="visitor"
                label="Visitor"
                autoComplete="off"
                value={game.visitor}
                disabled={isDisabled || isLoading}
                inputProps={{ "data-testid": "visitor" }}
                onChange={handleChange}
              />
            </FormControl>
          </Grid>
        </Grid>
        {/* Buttons */}
        <Box display="flex" sx={{ my: 2 }} gap={2}>
          {/* Back */}
          <Button variant="contained" LinkComponent={Link} href="/games">
            Back
          </Button>
          {/* Save */}
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            disabled={isDisabled || isLoading}
          >
            {isLoading ? "Loading..." : "Save"}
          </Button>
        </Box>
      </form>
    </Box>
  );
};
