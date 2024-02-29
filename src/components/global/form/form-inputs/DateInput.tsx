import React from "react";
import { CalendarIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { formType } from "@/lib/types/form";

type DateInputProps = {
  fieldName: string;
  label?: string;
  onSelect?: (selectedDate?: Date) => void;
};

const DateInput: React.FC<DateInputProps> = ({
  fieldName,
  label,
  onSelect,
}) => {
  const { control } = useFormContext<formType>();

  return (
    <>
      <FormField
        control={control}
        // todo: Fix this ts error later
        // @ts-expect-error: React hooks form reuire these names as a literal (so would require exact name)
        name={fieldName}
        render={({ field }) => (
          <FormItem>
            {label && <FormLabel className="flex flex-col">{label}</FormLabel>}
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      //Todo: Fix this ts error later
                      // @ts-expect-error: This is a ts error. Fix it later.
                      format(field.value, "MMM yyyy")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  //Todo: Fix this ts error later
                  // @ts-expect-error: This is a ts error. Fix it later.
                  selected={field.value}
                  onSelect={(selectedDate) => {
                    field.onChange(selectedDate);
                    onSelect?.(selectedDate);
                  }}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
export default DateInput;
