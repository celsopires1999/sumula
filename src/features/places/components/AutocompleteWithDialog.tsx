import { Place, PlacePayload } from "@/types/Place";
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

type Entity = Place;
type EntityPayload = PlacePayload;

export type Props = {
  id: string;
  value: Entity;
  label: string;
  name: string;
  options: Entity[];
  isLoading: boolean;
  isDisabled: boolean;
  handleEntityChange: (value: Entity) => void;
  handleCreateEntity: (
    entityPayload: EntityPayload
  ) => Promise<Entity | undefined>;
};

type EntityOptionType = {
  inputValue?: string;
  id?: string;
  name: string;
};

const filter = createFilterOptions<EntityOptionType>();

export function AutocompleteWithDialog({
  id,
  value,
  label,
  name,
  options,
  isLoading,
  isDisabled,
  handleEntityChange,
  handleCreateEntity,
}: Props) {
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
        onChange={handleChange}
        renderInput={renderInput}
        renderOption={renderOption}
        getOptionLabel={optionLabel}
        filterOptions={filterOptions}
        options={options as EntityOptionType[]}
        disabled={isDisabled || isLoading || !options}
      />
      <Dialog open={open} onClose={handleCloseDialog}>
        <form>
          <DialogTitle>Add New</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Did you miss any item in our list? Please, add it!
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

  function renderOption(
    props: HTMLAttributes<HTMLLIElement>,
    option: EntityOptionType
  ) {
    return <li {...props}>{option.name}</li>;
  }

  function renderInput(params: AutocompleteRenderInputParams) {
    return (
      <TextField
        {...params}
        label={label}
        data-testid={`${name}-input`}
        required
      />
    );
  }

  function handleChange(
    _event: SyntheticEvent<Element, Event>,
    newValue: string | EntityOptionType | null
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
      handleEntityChange({
        id: newValue?.id || "",
        name: newValue?.name || "",
      });
    }
  }

  function filterOptions(
    options: EntityOptionType[],
    params: FilterOptionsState<EntityOptionType>
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

  function optionLabel(option: string | EntityOptionType) {
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
    const entityPayload: EntityPayload = {
      name: dialogValue.name,
    };

    const result = await handleCreateEntity(entityPayload);
    handleEntityChange({
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
