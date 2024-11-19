'use client';
import MultiSelect from '@/components/ui/multi-select';
import { useBrynhildrData } from '@/hooks/brynhildr-data/brynhildr-data';
import { CustomFields } from '@/shared/constants/jira/jira-custom-fields';
import { SelectControllerProps } from '@/shared/interfaces/dynamic-form';
import { Fragment, useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';

interface ClientProps extends SelectControllerProps {
    projectKey: string;
    disabled?: boolean;
}

export function SelectClient({ form, projectKey, name, disabled, value }: ClientProps) {
    const [clients, setClients] = useState<{ label: string; value: string }[]>([]);
    const [selectDisabled, setSelectDisabled] = useState<boolean>(true);

    const { useGetAllProjects } = useBrynhildrData()
    const { data: projects } = useGetAllProjects()

    const _clientList = projects?.filter(
        (project: Record<string, any>) => project?.projectCategory?.name === "CLIENTES"
    );

    function setClientList() {
        if (projects) {
            const clientList = _clientList?.map((project: Record<string, any>) => project.name);
            const mappedClientList = clientList.map((client: string) => ({ label: client, value: client }));
            setSelectDisabled(false);
            setClients(mappedClientList);
        } else {
            setSelectDisabled(false);
        }
    }

    const handleMultiSelectChange = (selectedValues: string[]) => {
        const selectedValuesString = selectedValues.join(', ');
        form.setValue(CustomFields.CLIENTE.id, selectedValuesString);
        form.trigger(CustomFields.CLIENTE.id);
    };

    useEffect(() => {
        setClientList();
    }, [projectKey, disabled, projects]);

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
