import { KeyboardArrowDown } from "@mui/icons-material";
import { Autocomplete, AutocompleteChangeReason } from "@mui/material";
import { useRef, useState } from "react";
import CustomInput from "./CustonInput";

interface Option {
  label: string;
  value: string | number;
}

interface DropDownInputProps<T extends string | number | null> {
  options: Option[];
  formLabel?: string;
  label?: string;
  formik?: any;
  name: string;
  setValue?: (value: T) => void;
  value?: T;
  className?: string;
  loading?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

const DropDownInput = <T extends string | number | null>({
  options,
  formik,
  name,
  setValue,
  value,
  className = "",
  formLabel = "",
  label,
  disabled = false,
  loading = false,
  placeholder = "Search and Select ",
}: DropDownInputProps<T>) => {
  const autocompleteRef = useRef<any>(null);
  const [open, setOpen] = useState(false);

  const handleChange = (
    _event: React.SyntheticEvent,
    newValue: Option | null,
    _reason: AutocompleteChangeReason
  ) => {
    const selectedValue: string | number | null = newValue
      ? newValue.value
      : null;
    if (formik) {
      formik.setFieldValue(name, selectedValue);
    } else if (setValue) {
      setValue(selectedValue as T);
    } else {
    }
  };

  const handlePopupIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen((prev) => !prev);
  };

  let selectedOption: Option | undefined;

  if (formik) {
    selectedOption = options.find(
      (option) => option.value === formik.values[name]
    );
  } else {
    selectedOption = options.find((option) => option.value === value);
  }

  return (
    <Autocomplete
      disableClearable
      loading={loading}
      slotProps={{
        paper: {
          className:
            "[&_.MuiAutocomplete-option]:text-xs sm:[&_.MuiAutocomplete-option]:text-sm md:[&_.MuiAutocomplete-option]:text-base  [&_.MuiAutocomplete-option]:py-1 [&_.MuiAutocomplete-option]:px-2",
        },
      }}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      popupIcon={
        <KeyboardArrowDown
          onClick={handlePopupIconClick}
          className="cursor-pointer"
        />
      }
      disabled={disabled}
      options={options || []}
      value={(selectedOption as Option) || null}
      onChange={handleChange}
      getOptionLabel={(option: Option) => option.label}
      renderInput={(params) => (
        <CustomInput
          {...params}
          formik={formik}
          name={name}
          label={label}
          formLabel={formLabel}
          placeholder={formLabel ? `${placeholder} ${formLabel}` : placeholder}
          className={className}
        />
      )}
      ref={autocompleteRef}
    />
  );
};

export default DropDownInput;
