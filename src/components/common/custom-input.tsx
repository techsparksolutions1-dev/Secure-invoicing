import React from "react";
import { FieldValues } from "react-hook-form";

import { CustomInputInterface } from "@/interfaces/components.common-interfaces";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const CustomInput = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  disabled = false,
}: CustomInputInterface<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel
            htmlFor={name as string}
            className={`text-heading md:text-base text-sm font-normal ${
              disabled === true && "opacity-50"
            }`}
          >
            {label}
          </FormLabel>
          <FormControl>
            <Input
              id={name as string}
              disabled={disabled}
              type={type}
              placeholder={placeholder}
              {...field}
              className="rounded-[5px] md:!text-base !text-sm h-[50px] border border-border placeholder:text-opacity-25 bg-input"
            />
          </FormControl>
          <FormMessage className="text-destructive text-sm" />
        </FormItem>
      )}
    />
  );
};

export default CustomInput;
