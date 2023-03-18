import { Place, PlacePayload, Result, Results } from "../../types/Place";
import { apiSlice } from "../api/apiSlice";

const endpointUrl = "/places";

export const initialState: Place = {
  id: "",
  name: "",
};

function getPlaces() {
  return `${endpointUrl}`;
}

function getPlace({ id }: { id: string }) {
  return {
    url: `${endpointUrl}/${id}`,
    method: "GET",
  };
}

function createPlace(placePayload: PlacePayload) {
  return { url: endpointUrl, method: "POST", body: placePayload };
}

function updatePlace({
  id,
  placePayload,
}: {
  id: string;
  placePayload: PlacePayload;
}) {
  return {
    url: `${endpointUrl}/${id}`,
    method: "PUT",
    body: placePayload,
  };
}

function deletePlace({ id }: { id: string }) {
  return {
    url: `${endpointUrl}/${id}`,
    method: "DELETE",
  };
}

export const placesApiSlice = apiSlice.injectEndpoints({
  endpoints: ({ query, mutation }) => ({
    getPlaces: query<Results, void>({
      query: getPlaces,
      providesTags: ["Places"],
    }),
    getPlace: query<Result, { id: string }>({
      query: getPlace,
      providesTags: ["Places"],
    }),
    createPlace: mutation<Result, PlacePayload>({
      query: createPlace,
      invalidatesTags: ["Places"],
    }),
    updatePlace: mutation<Result, { id: string; placePayload: PlacePayload }>({
      query: updatePlace,
      invalidatesTags: ["Places"],
    }),
    deletePlace: mutation<{}, { id: string }>({
      query: deletePlace,
      invalidatesTags: ["Places"],
    }),
  }),
});

export const {
  useCreatePlaceMutation,
  useUpdatePlaceMutation,
  useDeletePlaceMutation,
  useGetPlaceQuery,
  useGetPlacesQuery,
} = placesApiSlice;
