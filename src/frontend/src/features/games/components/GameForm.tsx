import { DateTime } from "@/frontend/src/components/DateTime";
import { AutocompletePlace } from "@/frontend/src/components/AutcompletePlace";
import { Box, Button, FormControl, Grid, TextField } from "@mui/material";
import "dayjs/locale/pt-br";
import Link from "next/link";
import { Game } from "../../../types/Game";
import { Place } from "@/types/Place";
import { AutocompleteTeam } from "@/frontend/src/components/AutcompleteTeam";
import { Team } from "@/types/Team";

type Props = {
  game: Game;
  isLoading?: boolean;
  isDisabled?: boolean;
  handleChange: (name: string, value: Date | Place | Team | undefined) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};
export const GameForm = ({
  game,
  isLoading = false,
  isDisabled = false,
  handleChange,
  handleSubmit,
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
                name="date"
                handleFieldChange={handleChange}
              />
            </FormControl>
            {/* Place */}
            <FormControl fullWidth>
              <AutocompletePlace
                id="place"
                name="place"
                label="Place"
                value={game.place}
                isLoading={isLoading}
                isDisabled={isDisabled}
                handleChange={handleChange}
              />
            </FormControl>
            {/* Host */}
            <FormControl fullWidth>
              <AutocompleteTeam
                id="host"
                name="host"
                label="Host"
                value={game.host}
                isLoading={isLoading}
                isDisabled={isDisabled}
                handleChange={handleChange}
              />
            </FormControl>
            {/* Host */}
            <FormControl fullWidth>
              <AutocompleteTeam
                id="visitor"
                name="visitor"
                label="Visitor"
                value={game.visitor}
                isLoading={isLoading}
                isDisabled={isDisabled}
                handleChange={handleChange}
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
            color="secondary"
            variant="contained"
            disabled={isDisabled || isLoading}
          >
            {isLoading ? "Loading..." : "Save"}
          </Button>
        </Box>
      </form>
    </Box>
  );
};
