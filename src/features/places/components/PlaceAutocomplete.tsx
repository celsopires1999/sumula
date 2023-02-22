import { Place, PlacePayload } from "@/types/Places";
import { FilterOptionsState } from "@mui/material";
import Autocomplete, {
  AutocompleteRenderInputParams,
  createFilterOptions,
} from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useSnackbar } from "notistack";
import {
  ChangeEvent,
  FormEvent,
  HTMLAttributes,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import { useCreatePlaceMutation, useGetPlacesQuery } from "../PlacesSlice";

export type PlaceAutocompleteProps = {
  value: Place;
  label: string;
  id: string;
  handlePlaceChange: (value: Place) => void;
};

type PlaceOptionType = {
  inputValue?: string;
  id?: string;
  name: string;
};

const filter = createFilterOptions<PlaceOptionType>();

export function PlaceAutocomplete({
  value,
  label,
  id,
  handlePlaceChange,
}: PlaceAutocompleteProps) {
  const { enqueueSnackbar } = useSnackbar();
  const { data: places } = useGetPlacesQuery();
  const [createPlace, status] = useCreatePlaceMutation();
  const [open, toggleOpen] = useState(false);
  const [dialogValue, setDialogValue] = useState({
    name: "",
  });

  return (
    <>
      <Autocomplete
        id={id}
        freeSolo
        clearOnBlur
        value={value}
        selectOnFocus
        handleHomeEndKeys
        onChange={handleChangeAutocomplete}
        renderInput={handleRenderInputAutocomplete}
        options={(places as PlaceOptionType[]) || []}
        renderOption={handleRenderOptionAutocomplete}
        filterOptions={handleFilterOptionsAutocomplete}
        getOptionLabel={handleGetOptionLabelAutocomplete}
      />
      <Dialog open={open} onClose={handleCloseDialog}>
        <form onSubmit={handleSubmitDialog}>
          <DialogTitle>Add a new place</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Did you miss any place in our list? Please, add it!
            </DialogContentText>
            <TextField
              autoFocus
              id="name"
              type="text"
              label="name"
              margin="dense"
              variant="standard"
              value={dialogValue.name}
              onChange={handleChangeDialogName}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit">Add</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );

  //#region     Autocomplete

  function handleRenderOptionAutocomplete(
    props: HTMLAttributes<HTMLLIElement>,
    option: PlaceOptionType
  ) {
    return <li {...props}>{option.name}</li>;
  }

  function handleRenderInputAutocomplete(
    params: AutocompleteRenderInputParams
  ) {
    return <TextField {...params} label={label} required />;
  }

  function handleChangeAutocomplete(
    _event: SyntheticEvent<Element, Event>,
    newValue: string | PlaceOptionType | null
  ) {
    if (typeof newValue === "string") {
      // timeout to avoid instant validation of the dialog's form.
      setTimeout(() => {
        toggleOpen(true);
        setDialogValue({
          name: newValue,
        });
      });
    } else if (newValue && newValue.inputValue) {
      toggleOpen(true);
      setDialogValue({
        name: newValue.inputValue,
      });
    } else {
      handlePlaceChange({
        id: newValue?.id || "",
        name: newValue?.name || "",
      });
    }
  }

  function handleFilterOptionsAutocomplete(
    options: PlaceOptionType[],
    params: FilterOptionsState<PlaceOptionType>
  ) {
    const filtered = filter(options, params);

    if (params.inputValue !== "") {
      filtered.push({
        inputValue: params.inputValue,
        name: `Add "${params.inputValue}"`,
      });
    }

    return filtered;
  }

  function handleGetOptionLabelAutocomplete(option: string | PlaceOptionType) {
    // e.g value selected with enter, right from the input
    if (typeof option === "string") {
      return option;
    }
    if (option.inputValue) {
      return option.inputValue;
    }
    return option.name;
  }

  //#endregion  Autocomplete

  //#region     Dialog

  function handleCloseDialog() {
    setDialogValue({
      name: "",
    });
    toggleOpen(false);
  }

  async function handleSubmitDialog(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const placePayload: PlacePayload = {
      name: dialogValue.name,
    };

    try {
      const result = await createPlace(placePayload).unwrap();
      handlePlaceChange({
        id: result.id,
        name: result.name,
      });
      handleCloseDialog();
    } catch (e) {
      enqueueSnackbar(`Place not created`, { variant: "error" });
    }
  }

  function handleChangeDialogName(
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    setDialogValue({
      ...dialogValue,
      name: event.target.value,
    });
  }

  //#endregion  Dialog
}
