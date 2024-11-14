'use client'
import { Fragment, useEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";
import { toast } from "sonner";
import MultiSelect from "@/components/ui/multi-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CustomFields } from "@/shared/constants/jira/jira-custom-fields";
import { SelectControllerProps } from "@/shared/interfaces/dynamic-form";
import { useGetOpsForClients } from "../services/use-dynamic-form-queries";

export function SelectOP({ form, name, disabled, value }: SelectControllerProps) {
    const hasFetched = useRef(false);
    const [opList, setOpList] = useState<any>([]);
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(true);
    const [selectDisabled, setSelectDisabled] = useState<boolean>(true);
    const [inputValue, setInputValue] = useState(value || "");

    const clients: string = form.watch(CustomFields.CLIENTE.id);

    function getOpByClient() {
        if (clients?.length > 0) {
            setSelectDisabled(true);
            const loadingToastId = toast.loading(`Buscando Ordens de Produção...`);
            try {
                const { data: result } = useGetOpsForClients(clients);
                setOpList(result);
                toast.success('Tudo pronto', {
                    id: loadingToastId,
                });
                setSelectDisabled(false);
            } catch (error) {
                toast.error('Erro ao buscar as ordens de produção', {
                    id: loadingToastId,
                });
                setSelectDisabled(false);
            }
        }
    }

    const handleCheckboxChange = (event: boolean) => {
        setIsCheckboxChecked(event);
        if (!event) {
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

    useEffect(() => {
        if (!hasFetched.current && clients?.length > 0) {
            hasFetched.current = true;
            setSelectDisabled(false);
            getOpByClient();
        } else if (clients?.length === 0) {
            setOpList([]);
            setSelectDisabled(true);
        }
    }, [clients]);

    useEffect(() => {
        if (value) {
            form.setValue(CustomFields.OP.id, value);
            setInputValue(value);
        }
    }, [value, form]);

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
                                    disabled={selectDisabled || disabled}
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