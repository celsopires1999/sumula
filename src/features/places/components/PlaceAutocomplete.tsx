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
  useState,
} from "react";
import { useCreatePlaceMutation, useGetPlacesQuery } from "../PlacesSlice";

export type PlaceAutocompleteProps = {
  value: Place;
  label: string;
  handlePlaceChange: (value: Place) => void;
};

const filter = createFilterOptions<SupportPlace>();

export default function PlaceAutocomplete({
  value,
  label,
  handlePlaceChange,
}: PlaceAutocompleteProps) {
  const { enqueueSnackbar } = useSnackbar();
  const { data: places } = useGetPlacesQuery();
  const [createPlace] = useCreatePlaceMutation();
  // const [place, setPlace] = useState<Places | null>(null);

  const [open, toggleOpen] = useState(false);
  const handleCloseDialog = () => {
    setDialogValue({
      name: "",
    });
    toggleOpen(false);
  };

  const [dialogValue, setDialogValue] = useState({
    name: "",
  });

  const handleSubmitDialog = async (event: FormEvent<HTMLFormElement>) => {
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
  };

  const handleChangeAutocomplete = (
    _event: SyntheticEvent<Element, Event>,
    newValue: string | SupportPlace | null
  ) => {
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
  };

  const handleFilterOptionsAutocomplete = (
    options: SupportPlace[],
    params: FilterOptionsState<SupportPlace>
  ) => {
    const filtered = filter(options, params);

    if (params.inputValue !== "") {
      filtered.push({
        inputValue: params.inputValue,
        name: `Add "${params.inputValue}"`,
      });
    }

    return filtered;
  };

  const handleGetOptionLabelAutocomplete = (option: string | SupportPlace) => {
    // e.g value selected with enter, right from the input
    if (typeof option === "string") {
      return option;
    }
    if (option.inputValue) {
      return option.inputValue;
    }
    return option.name;
  };

  const handleRenderOptionAutocomplete = (
    props: HTMLAttributes<HTMLLIElement>,
    option: SupportPlace
  ) => <li {...props}>{option.name}</li>;

  const handleRenderInputAutocomplete = (
    params: AutocompleteRenderInputParams
  ) => <TextField {...params} label="Place" required />;

  const handleChangeDialogName = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) =>
    setDialogValue({
      ...dialogValue,
      name: event.target.value,
    });

  return (
    <>
      <Autocomplete
        freeSolo
        clearOnBlur
        value={value}
        selectOnFocus
        handleHomeEndKeys
        options={places ?? []}
        id="place-autocomplete"
        onChange={handleChangeAutocomplete}
        renderInput={handleRenderInputAutocomplete}
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
}

interface SupportPlace {
  inputValue?: string;
  id?: string;
  name: string;
}
