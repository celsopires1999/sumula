import { Game, GamePayload, Result, Results } from "../../types/Game";
import { apiSlice } from "../api/apiSlice";

const endpointUrl = "/games";

export const initialState: Game = {
  id: "",
  date: new Date(),
  place: { id: "", name: "" },
  host: { id: "", name: "" },
  visitor: { id: "", name: "" },
};

function getGames() {
  return `${endpointUrl}`;
}

function getGame({ id }: { id: string }) {
  return {
    url: `${endpointUrl}/${id}`,
    method: "GET",
  };
}

function createGame(gamePayload: GamePayload) {
  return { url: endpointUrl, method: "POST", body: gamePayload };
}

function updateGame({
  id,
  gamePayload,
}: {
  id: string;
  gamePayload: GamePayload;
}) {
  return {
    url: `${endpointUrl}/${id}`,
    method: "PUT",
    body: gamePayload,
  };
}

function deleteGame({ id }: { id: string }) {
  return {
    url: `${endpointUrl}/${id}`,
    method: "DELETE",
  };
}

export const gamesApiSlice = apiSlice.injectEndpoints({
  endpoints: ({ query, mutation }) => ({
    getGames: query<Results, void>({
      query: getGames,
      providesTags: ["Games"],
    }),
    getGame: query<Result, { id: string }>({
      query: getGame,
      providesTags: ["Games"],
    }),
    createGame: mutation<Result, GamePayload>({
      query: createGame,
      invalidatesTags: ["Games"],
    }),
    updateGame: mutation<Result, { id: string; gamePayload: GamePayload }>({
      query: updateGame,
      invalidatesTags: ["Games"],
    }),
    deleteGame: mutation<{}, { id: string }>({
      query: deleteGame,
      invalidatesTags: ["Games"],
    }),
  }),
});

export const {
  useCreateGameMutation,
  useUpdateGameMutation,
  useDeleteGameMutation,
  useGetGameQuery,
  useGetGamesQuery,
} = gamesApiSlice;
