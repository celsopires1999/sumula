import { Team, TeamPayload, Result, Results } from "../../types/Team";
import { apiSlice } from "../api/apiSlice";

const endpointUrl = "/teams";

export const initialState: Team = {
  id: "",
  name: "",
};

function getTeams() {
  return `${endpointUrl}`;
}

function getTeam({ id }: { id: string }) {
  return {
    url: `${endpointUrl}/${id}`,
    method: "GET",
  };
}

function createTeam(teamPayload: TeamPayload) {
  return { url: endpointUrl, method: "POST", body: teamPayload };
}

function updateTeam({
  id,
  teamPayload,
}: {
  id: string;
  teamPayload: TeamPayload;
}) {
  return {
    url: `${endpointUrl}/${id}`,
    method: "PUT",
    body: teamPayload,
  };
}

function deleteTeam({ id }: { id: string }) {
  return {
    url: `${endpointUrl}/${id}`,
    method: "DELETE",
  };
}

export const teamsApiSlice = apiSlice.injectEndpoints({
  endpoints: ({ query, mutation }) => ({
    getTeams: query<Results, void>({
      query: getTeams,
      providesTags: ["Teams"],
    }),
    getTeam: query<Result, { id: string }>({
      query: getTeam,
      providesTags: ["Teams"],
    }),
    createTeam: mutation<Result, TeamPayload>({
      query: createTeam,
      invalidatesTags: ["Teams"],
    }),
    updateTeam: mutation<Result, { id: string; teamPayload: TeamPayload }>({
      query: updateTeam,
      invalidatesTags: ["Teams"],
    }),
    deleteTeam: mutation<{}, { id: string }>({
      query: deleteTeam,
      invalidatesTags: ["Teams"],
    }),
  }),
});

export const {
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
  useGetTeamQuery,
  useGetTeamsQuery,
} = teamsApiSlice;
