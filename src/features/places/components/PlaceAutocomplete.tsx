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
import { ChangeEvent, HTMLAttributes, SyntheticEvent, useState } from "react";

export type PlaceAutocompleteProps = {
  id: string;
  value: Place;
  label: string;
  places: Place[];
  handlePlaceChange: (value: Place) => void;
  handleCreatePlace: (placePayload: PlacePayload) => Promise<Place | undefined>;
};

type PlaceOptionType = {
  inputValue?: string;
  id?: string;
  name: string;
};

const filter = createFilterOptions<PlaceOptionType>();

export function PlaceAutocomplete({
  id,
  value,
  label,
  places,
  handlePlaceChange,
  handleCreatePlace,
}: PlaceAutocompleteProps) {
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
        options={places as PlaceOptionType[]}
        onChange={handleChangeAutocomplete}
        renderInput={handleRenderInputAutocomplete}
        renderOption={handleRenderOptionAutocomplete}
        filterOptions={handleFilterOptionsAutocomplete}
        getOptionLabel={handleGetOptionLabelAutocomplete}
      />
      <Dialog open={open} onClose={handleCloseDialog}>
        {/* <form onSubmit={handleSubmitDialog}> */}
        <form>
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
              autoComplete="off"
              value={dialogValue.name}
              onChange={handleChangeDialogName}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmitDialog}>Add</Button>
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

  async function handleSubmitDialog() {
    const placePayload: PlacePayload = {
      name: dialogValue.name,
    };

    const result = await handleCreatePlace(placePayload);
    handlePlaceChange({
      id: result?.id ?? "",
      name: result?.name ?? "",
    });
    handleCloseDialog();
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
