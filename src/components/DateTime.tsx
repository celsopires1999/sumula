import { TextField } from "@mui/material";
import {
  LocalizationProvider,
  MobileDateTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

export type DateTimeProps = {
  value: Date;
  label: string;
  name: string;
  handleFieldChange: (name: string, value: Date | undefined) => void;
};

export function DateTime(props: DateTimeProps) {
  const { name, label, handleFieldChange: handleDateChange } = props;
  const value = fromDateToDayjs(props.value);

  function handleOnChangePicker(value: dayjs.Dayjs | null) {
    handleDateChange(name, value?.toDate());
  }

  function fromDateToDayjs(value: Date) {
    const date = dayjs(value).format("YYYY-MM-DDTHHmm");
    return dayjs(date);
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <MobileDateTimePicker
        label={label}
        value={value}
        onChange={handleOnChangePicker}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
}
