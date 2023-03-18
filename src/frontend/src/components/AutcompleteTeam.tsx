import React from "react";
import { AutocompleteWithDialog } from "./AutocompleteWithDialog";
import {
  useCreateTeamMutation,
  useGetTeamsQuery,
} from "@/frontend/src/features/teams/TeamSlice";
import { Team, TeamPayload } from "@/types/Team";
import { useSnackbar } from "notistack";
import { useEffect } from "react";

export type Props = {
  id: string;
  value: Team;
  label: string;
  name: string;
  isLoading: boolean;
  isDisabled: boolean;
  handleChange: (name: string, value: Team) => void;
};

export function AutocompleteTeam({
  id,
  value,
  label,
  name,
  isLoading,
  isDisabled,
  handleChange,
}: Props) {
  const [createTeam, statusCreateTeam] = useCreateTeamMutation();
  const { data: Teams } = useGetTeamsQuery();
  const { enqueueSnackbar } = useSnackbar();

  async function handleCreateTeam(
    TeamPayload: TeamPayload
  ): Promise<Team | undefined> {
    try {
      const result = await createTeam(TeamPayload).unwrap();
      return result;
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    if (statusCreateTeam.isSuccess) {
      enqueueSnackbar(`Team created successfully`, {
        variant: "success",
      });
    }
    if (statusCreateTeam.error) {
      enqueueSnackbar(`Team not created`, { variant: "error" });
    }
  }, [enqueueSnackbar, statusCreateTeam.error, statusCreateTeam.isSuccess]);

  return (
    <>
      <AutocompleteWithDialog
        id={id}
        name={name}
        label={label}
        options={Teams}
        value={value}
        isLoading={isLoading}
        isDisabled={isDisabled}
        handleChangeEntity={handleChange}
        handleCreateEntity={handleCreateTeam}
      />
    </>
  );
}
