"use client";

import React from "react";
import { FieldValues } from "react-hook-form";
import { format } from "date-fns";

import { CustomCalendarProps } from "@/interfaces/components.common-interfaces";

import { cn } from "@/lib/utils";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

import { BsCalendarDateFill } from "react-icons/bs";

const CustomCalendar = <T extends FieldValues>({
  control,
  name,
  label,
  disabled = false,
}: CustomCalendarProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel
            htmlFor={name as string}
            className={cn(
              "text-heading md:text-base text-sm",
              disabled && "opacity-50"
            )}
          >
            {label}
          </FormLabel>

          <FormControl>
            <div className="w-full relative">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    disabled={disabled}
                    className={cn(
                      "w-full flex-center justify-start h-[50px] rounded-[5px] border-none bg-input text-paragraph hover:bg-muted-hover te md:text-base text-sm"
                    )}
                  >
                    <BsCalendarDateFill size={14} />
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span className="md:text-base text-sm">Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-border overflow-hidden">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => field.onChange(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </FormControl>

          <FormMessage className="text-red-600 text-[14px]" />
        </FormItem>
      )}
    />
  );
};

export default CustomCalendar;
