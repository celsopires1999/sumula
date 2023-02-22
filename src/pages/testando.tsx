import { PlacePayload } from "@/types/Places";
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
import {
  useCreatePlaceMutation,
  useGetPlacesQuery,
} from "../features/places/PlacesSlice";

const filter = createFilterOptions<Places>();

export default function FreeSoloCreateOptionDialog() {
  const { enqueueSnackbar } = useSnackbar();
  const { data: places } = useGetPlacesQuery();
  const [createPlace, status] = useCreatePlaceMutation();
  const [value, setValue] = useState<Places | null>(null);

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
      const place = await createPlace(placePayload).unwrap();
      setValue({
        id: place.id,
        name: place.name,
      });
      handleCloseDialog();
    } catch (e) {
      enqueueSnackbar(`Place not created`, { variant: "error" });
    }
  };

  const handleOnChangeAutocomplete = (
    _event: SyntheticEvent<Element, Event>,
    newValue: string | Places | null
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
      setValue(newValue);
    }
  };

  const handleFilterOptionsAutocomplete = (
    options: Places[],
    params: FilterOptionsState<Places>
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

  const handleGetOptionLabelAutocomplete = (option: string | Places) => {
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
    option: Places
  ) => <li {...props}>{option.name}</li>;

  const handleRenderInputAutocomplete = (
    params: AutocompleteRenderInputParams
  ) => <TextField {...params} label="Place" required />;

  const handleOnChangeDialogName = (
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
        id="free-solo-dialog-demo"
        onChange={handleOnChangeAutocomplete}
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
              onChange={handleOnChangeDialogName}
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

interface Places {
  inputValue?: string;
  id?: string;
  name: string;
}
