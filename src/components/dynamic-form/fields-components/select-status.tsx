'use client'
import { Badge } from "@/components/ui/badge";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IssueTypes } from "@/shared/enums/jira-enums/issue-types";
import { SelectControllerProps } from "@/shared/interfaces/dynamic-form";
import { Fragment, useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { useGetListStatuses } from "../services/use-dynamic-form-queries";

interface SelectTaskStatus extends SelectControllerProps {
  showComponent?: boolean;
  projectKey: string;
}

export function SelectStatus({ form, name, projectKey, value, disabled, showComponent = true }: SelectTaskStatus) {

  const [data, setData] = useState<Record<string, any>[]>([]);
  const [selectedValue, setSelectedValue] = useState<string>("");

  function getTaskStatuses() {
    const { data: result } = useGetListStatuses(projectKey);
    const filteredStatus = result.filter((el: Record<string, any>) => el.name === IssueTypes.EPIC);

    const uniqueStatuses = Array.from(new Set(filteredStatus.map(status => status.id)))
      .map(id => filteredStatus.find(status => status.id === id));

    setData(uniqueStatuses);
  }

  const handleSelectChange = (value: string) => {
    const parsedValue = JSON.parse(value);
    form.setValue(name, parsedValue);
    setSelectedValue(value);
  };

  useEffect(() => {
    getTaskStatuses();
  }, []);

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
                    {data.map((el, idx) => (
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