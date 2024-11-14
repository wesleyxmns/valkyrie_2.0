import { Textarea } from "@/components/ui/textarea";
import { FieldValues, UseFormRegister } from "react-hook-form";


export const TextArea = ({ name, register, defaultValue, onBlur, disabled }:
    {
        name: string;
        register: UseFormRegister<FieldValues>;
        defaultValue: string;
        onBlur: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
        disabled?: boolean;
    }) => {
    return (
        <Textarea
            {...register(name)}
            rows={10}
            defaultValue={defaultValue || ''}
            onBlur={onBlur}
            disabled={disabled}
        />
    );
};
