import {
  useCreatePlaceMutation,
  useGetPlacesQuery,
} from "@/features/places/PlacesSlice";
import { Place, PlacePayload } from "@/types/Place";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { AutocompleteWithDialog } from "./AutocompleteWithDialog";

export type Props = {
  id: string;
  value: Place;
  label: string;
  name: string;
  isLoading: boolean;
  isDisabled: boolean;
  handleChange: (name: string, value: Place) => void;
};

export function AutocompletePlace({
  id,
  value,
  label,
  name,
  isLoading,
  isDisabled,
  handleChange,
}: Props) {
  const [createPlace, statusCreatePlace] = useCreatePlaceMutation();
  const { data: places } = useGetPlacesQuery();
  const { enqueueSnackbar } = useSnackbar();

  async function handleCreatePlace(
    placePayload: PlacePayload
  ): Promise<Place | undefined> {
    try {
      const result = await createPlace(placePayload).unwrap();
      return result;
    } catch (e) {
      console.error(e);
    }
  }

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
    <>
      <AutocompleteWithDialog
        id={id}
        name={name}
        label={label}
        options={places}
        value={value}
        isLoading={isLoading}
        isDisabled={isDisabled}
        handleChangeEntity={handleChange}
        handleCreateEntity={handleCreatePlace}
      />
    </>
  );
}
