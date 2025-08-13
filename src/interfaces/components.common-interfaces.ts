import { Control, FieldValues, Path } from "react-hook-form";

export interface CustomInputInterface<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
}

export interface CustomTextareaInterface<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  rows?: number;
}
