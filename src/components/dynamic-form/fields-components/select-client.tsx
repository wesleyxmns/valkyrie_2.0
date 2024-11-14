'use client';
import MultiSelect from '@/components/ui/multi-select';
import { useGetAllProjects } from '@/hooks/queries/use-brynhildr-queries';
import { CustomFields } from '@/shared/constants/jira/jira-custom-fields';
import { SelectControllerProps } from '@/shared/interfaces/dynamic-form';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Controller } from 'react-hook-form';
import { toast } from 'sonner';

interface ClientProps extends SelectControllerProps {
    projectKey: string;
    disabled?: boolean;
}

export function SelectClient({ form, projectKey, name, disabled, value }: ClientProps) {
    const hasFetched = useRef(false);
    const [clients, setClients] = useState<Array<{ label: string; value: string }>>([]);
    const [selectDisabled, setSelectDisabled] = useState<boolean>(true);

    function getClients() {
        setSelectDisabled(true);
        const loadingToastId = toast.loading('Buscando Clientes...');
        try {
            const { data: projects } = useGetAllProjects()
            const list = projects?.filter(
                (project: Record<string, any>) => project?.projectCategory?.name === "CLIENTES"
            );
            const clientList = list?.map((project: any) => project.name);
            const _clientList = clientList.map(client => ({ label: client, value: client }))
            setClients(_clientList);
            toast.success('Tudo pronto', {
                id: loadingToastId,
            });
            setSelectDisabled(false);
        } catch (error) {
            toast.error('Erro ao buscar os clientes', {
                id: loadingToastId,
            });
            setSelectDisabled(false);
        }
    }

    const handleMultiSelectChange = (selectedValues: string[]) => {
        const selectedValuesString = selectedValues.join(', ');
        form.setValue(CustomFields.CLIENTE.id, selectedValuesString);
        form.trigger(CustomFields.CLIENTE.id);
    };

    useEffect(() => {
        if (!hasFetched.current && !disabled) {
            hasFetched.current = true;
            getClients();
        }
    }, [projectKey, disabled]);

    useEffect(() => {
        if (value) {
            form.setValue(CustomFields.CLIENTE.id, value);
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
                            <MultiSelect
                                options={clients}
                                value={field.value ? field.value.split(', ') : []}
                                onValueChange={(values) => {
                                    handleMultiSelectChange(values.map(option => option.value));
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
                        </div>
                    )}
                />
            </div>
        </Fragment>
    );
}
