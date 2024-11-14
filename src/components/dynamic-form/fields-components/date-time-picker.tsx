import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils/utils";
import { addDays, addHours, addMonths, addWeeks, addYears, format, isValid, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

type DateValue = Date | string | undefined;

interface DateTimePickerProps {
  disabled?: boolean;
  value: DateValue;
  onChange: (value: DateValue, duration?: string) => void;
  showTimer?: boolean;
}

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
}

const TimePicker = React.memo(({ value, onChange }: TimePickerProps) => {
  const [time, setTime] = useState(() => {
    const match = value?.match(/^(\d+)(\w)$/);
    return match ? match[1] : '';
  });
  const [unit, setUnit] = useState(() => {
    const match = value?.match(/^(\d+)(\w)$/);
    return match ? match[2] : 'h';
  });

  const handleTimeChange = useCallback((newTime: string) => {
    const parsedValue = parseInt(newTime);
    if (parsedValue < 0) return;
    setTime(newTime);
  }, []);

  const handleUnitChange = useCallback((newUnit: string) => {
    setUnit(newUnit);
  }, []);

  useEffect(() => {
    if (time && unit) {
      onChange(`${time}${unit}`);
    }
  }, [time, unit, onChange]);

  return (
    <div className="flex items-center space-x-2 mt-4">
      <Input
        type="number"
        value={time}
        onChange={(e) => handleTimeChange(e.target.value)}
        className="w-20"
        min="0"
      />
      <Select value={unit} onValueChange={handleUnitChange}>
        <SelectTrigger className="w-20">
          <SelectValue placeholder="Unidade" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="h">Horas</SelectItem>
          <SelectItem value="d">Dias</SelectItem>
          <SelectItem value="w">Semanas</SelectItem>
          <SelectItem value="m">Meses</SelectItem>
          <SelectItem value="y">Anos</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
});

export function DateTimePicker({ value, onChange, disabled, showTimer = true }: DateTimePickerProps) {
  const [localDate, setLocalDate] = useState<Date | undefined>(() => {
    if (value instanceof Date) return value;
    if (typeof value === 'string') {
      const parsed = parse(value, "yyyy-MM-dd", new Date());
      return isValid(parsed) ? parsed : undefined;
    }
    return undefined;
  });
  const [localDuration, setLocalDuration] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const formatDateForState = useCallback((date: Date | undefined): string => {
    return date ? format(date, "yyyy-MM-dd") : "";
  }, []);

  const formatDateForDisplay = useCallback((date: Date | undefined): string => {
    return date ? format(date, "dd/MM/yyyy") : "Selecione a data";
  }, []);

  const handleSelect = useCallback((newDay: Date | undefined) => {
    setLocalDate(newDay);
    if (!showTimer) setIsOpen(false);
  }, [showTimer]);

  const handleDurationChange = useCallback((newDuration: string) => {
    setLocalDuration(newDuration);
  }, []);

  const calculateEndDate = useMemo(() => {
    if (!localDate || !localDuration) return "Data final não calculada";

    const matchResult = localDuration.match(/(\d+)(\w)/);
    const [amount, unit] = matchResult ? matchResult.slice(1) : ['', ''];
    let endDate: Date;

    switch (unit) {
      case 'h': endDate = addHours(localDate, parseInt(amount)); break;
      case 'd': endDate = addDays(localDate, parseInt(amount)); break;
      case 'w': endDate = addWeeks(localDate, parseInt(amount)); break;
      case 'm': endDate = addMonths(localDate, parseInt(amount)); break;
      case 'y': endDate = addYears(localDate, parseInt(amount)); break;
      default: return "Unidade de tempo inválida";
    }

    return format(endDate, "dd/MM/yyyy");
  }, [localDate, localDuration]);

  useEffect(() => {
    const formattedDate = formatDateForState(localDate);
    if (formattedDate !== value || localDuration !== value) {
      onChange(formattedDate, localDuration);
    }
  }, [localDate, localDuration]);

  const displayValue = formatDateForDisplay(localDate);

  return (
    <div className="space-y-4">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            disabled={disabled}
            variant={"outline"}
            className={cn(
              "w-auto flex gap-4 justify-between text-left font-normal",
              !localDate && "text-muted-foreground"
            )}
            onClick={() => setIsOpen(true)}
          >
            {displayValue}
            <div className="flex items-center">
              {showTimer && <Clock className="mr-2 h-4 w-4" />}
              <CalendarIcon className="h-4 w-4" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <div className="p-3">
            <Calendar
              locale={ptBR}
              mode="single"
              selected={localDate}
              onSelect={handleSelect}
              initialFocus
            />
            {showTimer && <TimePicker value={localDuration} onChange={handleDurationChange} />}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default DateTimePicker;