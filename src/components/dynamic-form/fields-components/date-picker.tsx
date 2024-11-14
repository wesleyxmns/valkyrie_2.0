import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Controller, FieldValues, UseFormReturn } from "react-hook-form";

export function DatePicker({ name, form }: {
    name: string;
    form: UseFormReturn<FieldValues, any, undefined>
}) {
    return (
        <Controller name={name} control={form.control} render={({ field }) => (
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                        )}
                    >
                        {field.value ? (
                            format(field.value, "dd/MM/yyyy")
                        ) : (
                            <span>Selecione</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                            if (date) {
                                const formattedDate = formatDate(date);
                                field.onChange(formattedDate)
                            }
                        }}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        )} />
    )
}

function formatDate(date: Date) {
    return format(date, "yyyy/MM/dd")
}