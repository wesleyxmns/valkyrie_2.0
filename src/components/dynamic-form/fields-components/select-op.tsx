'use client'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MultiSelect from "@/components/ui/multi-select";
import { Switch } from "@/components/ui/switch";
import { useBrynhildrData } from "@/hooks/brynhildr-data/brynhildr-data";
import { CustomFields } from "@/shared/constants/jira/jira-custom-fields";
import { SelectControllerProps } from "@/shared/interfaces/dynamic-form";
import { Fragment, useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { toast } from "sonner";

export function SelectOP({ form, name, disabled, value }: SelectControllerProps) {
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(true);
    const [inputValue, setInputValue] = useState(value || "");

    const clients: string = form.watch(CustomFields.CLIENTE.id);

    const { useGetOpsForClients } = useBrynhildrData();
    const {
        data: opList = [],
        isLoading,
        isError,
    } = useGetOpsForClients(clients);

    useEffect(() => {
        if (value) {
            form.setValue(CustomFields.OP.id, value);
            setInputValue(value);
        }
    }, [value, form]);

    useEffect(() => {
        if (clients?.length > 0) {
            const toastId = 'ops-loading';

            if (isLoading) {
                toast.loading('Buscando Ordens de Produção...', {
                    id: toastId,
                });
            } else if (isError) {
                toast.error(`Erro ao buscar as ordens de produção`, {
                    id: toastId,
                });
            } else {
                toast.success('Ordens de produção carregadas', {
                    id: toastId,
                });
            }
        }
    }, [clients, isLoading, isError]);

    const handleCheckboxChange = (checked: boolean) => {
        setIsCheckboxChecked(checked);
        if (!checked) {
            form.setValue(CustomFields.OP.id, inputValue);
        } else {
            form.setValue(CustomFields.OP.id, value || "");
        }
    };

    const handleMultiSelectChange = (selectedValues: any[]) => {
        const selectedValuesString = selectedValues.map(option => option.value).join(', ');
        form.setValue(CustomFields.OP.id, selectedValuesString);
        form.trigger(CustomFields.OP.id);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setInputValue(newValue);
        form.setValue(CustomFields.OP.id, newValue);
        form.trigger(CustomFields.OP.id);
    };

    return (
        <Fragment>
            <div className="flex flex-row items-center gap-2">
                <Controller
                    name={name}
                    control={form.control}
                    render={({ field }) => (
                        <div className="w-full relative flex flex-col gap-2">
                            {isCheckboxChecked ? (
                                <MultiSelect
                                    options={opList}
                                    value={field.value ? field.value.split(', ') : []}
                                    onValueChange={(values) => {
                                        handleMultiSelectChange(values);
                                        field.onChange(values.join(', '));
                                    }}
                                    placeholder={"Selecione"}
                                    variant="secondary"
                                    disabled={isLoading || disabled}
                                    style={{
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                />
                            ) : (
                                <Input
                                    className="w-auto"
                                    placeholder="Ex: A0000001001"
                                    disabled={disabled}
                                    name={`${[CustomFields.OP.id]}`}
                                    value={inputValue}
                                    onChange={handleInputChange}
                                />
                            )}
                        </div>
                    )}
                />
                <div className="flex flex-row whitespace-nowrap items-center justify-center gap-2">
                    <Switch
                        checked={isCheckboxChecked}
                        onCheckedChange={handleCheckboxChange}
                        disabled={disabled}
                    />
                    <Label className="text-xs">Op's Jira</Label>
                </div>
            </div>
        </Fragment>
    );
}