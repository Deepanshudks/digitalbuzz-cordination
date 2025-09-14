import {
  FormControl,
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
} from "@mui/material";
import React, { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface FormikProps {
  setFieldValue: (field: string, value: any) => void;
  values: { [key: string]: any };
  errors: { [key: string]: any };
  touched: { [key: string]: any };
  handleBlur: {
    (e: React.FocusEvent<any, Element>): void;
    <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
  };
  handleChange: {
    (e: React.ChangeEvent<any>): void;
    <T = string | React.ChangeEvent<any>>(
      field: T
    ): T extends React.ChangeEvent<any>
      ? void
      : (e: string | React.ChangeEvent<any>) => void;
  };
}

interface CustomInputProps extends Omit<TextFieldProps, "InputProps"> {
  name: string;
  formik?: FormikProps;
  size?: any;
  formLabel?: string;
  InputProps?: any;
  setValue?: (value: any) => void;
}

const CustomInput: React.FC<CustomInputProps> = ({
  value,
  onChange,
  setValue,
  name,
  formik,
  size = "small",
  onBlur,
  disabled = false,
  formLabel,
  InputProps = {},
  className = "",
  type,
  color = "warning",
  ...rest
}: CustomInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleChange = (event: React.ChangeEvent<any>) => {
    const newValue = event.target.value.replace(/  +/g, " ");
    if (formik) {
      formik.setFieldValue(name, newValue);
    } else if (setValue) {
      setValue(newValue);
    } else if (onChange) {
      onChange(event);
    }
  };

  const error = formik?.touched?.[name] && formik?.errors?.[name];

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const passwordInputProps =
    type === "password"
      ? {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
                size="small"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }
      : {};

  return (
    <FormControl className={className}>
      {formLabel && <p className="py-1 !text-[#343A40]">{formLabel}</p>}
      <TextField
        size={size}
        name={name}
        disabled={disabled}
        color={color}
        className={disabled ? "!bg-[#F4F4F4]" : ""}
        InputProps={{
          ...InputProps,
          ...passwordInputProps,
        }}
        type={showPassword && type === "password" ? "text" : type}
        helperText={error}
        error={!!error}
        onBlur={formik?.handleBlur || onBlur}
        value={value || formik?.values[name]}
        onChange={handleChange}
        {...rest}
      />
    </FormControl>
  );
};

export default CustomInput;
