'use client'
import { Badge } from "@/components/ui/badge";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBrynhildrData } from "@/hooks/brynhildr-data/brynhildr-data";
import { IssueTypes } from "@/shared/enums/jira-enums/issue-types";
import { SelectControllerProps } from "@/shared/interfaces/dynamic-form";
import { useMutation } from "@tanstack/react-query";
import { Fragment, useState } from "react";
import { Controller } from "react-hook-form";

interface SelectTaskStatus extends SelectControllerProps {
  showComponent?: boolean;
  projectKey: string;
}

export function SelectStatus({ form, name, projectKey, value, disabled, showComponent = true }: SelectTaskStatus) {
  const { useGetListStatuses } = useBrynhildrData()
  const { data } = useGetListStatuses(projectKey);

  const [selectedValue, setSelectedValue] = useState<string>("");

  const mutation = useMutation({
    mutationFn: () => {
      const filteredStatus = data.filter((el: Record<string, any>) => el.name === IssueTypes.EPIC);

      const uniqueStatuses = Array.from(new Set(filteredStatus.map(status => status.id)))
        .map(id => filteredStatus.find(status => status.id === id));

      return Promise.resolve(uniqueStatuses);
    },
  })

  const handleSelectChange = (value: string) => {
    const parsedValue = JSON.parse(value);
    form.setValue(name, parsedValue);
    setSelectedValue(value);
  };

  return (
    <Fragment>
      {showComponent &&
        <FloatingLabelInput id="Status" label="Status" >
          <Controller
            name={name}
            control={form.control}
            render={({ field }) => {
              return (
                <Select
                  disabled
                  value={selectedValue}
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={value ? value : "Selecione"}>
                      {field.value?.name || "Selecione"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {mutation.data && mutation.data.map((el, idx) => (
                      <SelectGroup key={idx}>
                        {el.status.map((element, itemIdx) => {
                          const badgeColorClass = badgeColorClasses[element.statusCategory.colorName] || 'default';
                          return (
                            <SelectItem key={itemIdx} value={JSON.stringify({ name: element.name })}>
                              <Badge variant={"outline"} className={`rounded-sm cursor-pointer text-xs ${badgeColorClass}`}>
                                {element.name.toUpperCase()}
                              </Badge>
                            </SelectItem>
                          )
                        })}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              )
            }}
          />
        </FloatingLabelInput>
      }
    </Fragment>
  );
}

const badgeColorClasses = {
  success: 'bg-green-500 text-white',
  inprogress: 'bg-blue-500 text-white',
}