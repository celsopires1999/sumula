import { Box, Button, FormControl, Grid, TextField } from "@mui/material";
import "dayjs/locale/pt-br";
import Link from "next/link";
import { Game } from "../../../types/Games";
import { DateTime } from "@/components/DateTime";
import { Place } from "@/types/Places";
import PlaceAutocomplete from "@/features/places/components/PlaceAutocomplete";

type Props = {
  game: Game;
  isLoading?: boolean;
  isDisabled?: boolean;
  handleDateChange: (value: Date | undefined) => void;
  handlePlaceChange: (value: Place | undefined) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
export const GameForm = ({
  game,
  handleSubmit,
  handleChange,
  handleDateChange,
  isLoading = false,
  handlePlaceChange,
  isDisabled = false,
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
                value={game.place}
                label="Place"
                handlePlaceChange={handlePlaceChange}
              />
              {/* <TextField
                required
                name="place"
                label="Place"
                value={game.place}
                disabled={isDisabled || isLoading}
                onChange={handleChange}
                inputProps={{ "data-testid": "place" }}
              /> */}
            </FormControl>
            {/* Host */}
            <FormControl fullWidth>
              <TextField
                required
                name="host"
                label="Host"
                value={game.host}
                disabled={isDisabled || isLoading}
                onChange={handleChange}
                inputProps={{ "data-testid": "host" }}
              />
            </FormControl>
            {/* Host */}
            <FormControl fullWidth>
              <TextField
                required
                name="visitor"
                label="Visitor"
                value={game.visitor}
                disabled={isDisabled || isLoading}
                onChange={handleChange}
                inputProps={{ "data-testid": "visitor" }}
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
