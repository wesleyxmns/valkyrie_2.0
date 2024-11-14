import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import { Fragment } from "react";
import { Controller } from "react-hook-form";
import { DateTimePicker } from "./date-time-picker";
import { SelectControllerProps } from "@/shared/interfaces/dynamic-form";

interface InsertDeadlineProps extends SelectControllerProps {
  id: string;
  label: string;
  showComponent?: boolean;
  required?: boolean;
}

export function InsertDeadline({ name, id, label, form, disabled, value, showComponent = true, required }: InsertDeadlineProps) {
  const shouldShowTooltip = required && !form.watch(name) && !value;

  return (
    <Fragment>
      {showComponent && (
        <FloatingLabelInput id={id} label={label} >
          <Controller
            name={name}
            defaultValue={value}
            control={form.control}
            render={({ field }) => (
              <div className="flex items-center">
                <DateTimePicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                  showTimer={false}
                />
                {shouldShowTooltip && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-4 w-4 ml-2 text-red-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Defina o prazo de entrega para Acionar o SAC</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            )}
          />
        </FloatingLabelInput>
      )}
    </Fragment>
  );
}