'use client'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { SelectControllerProps } from "@/shared/interfaces/dynamic-form";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { useGetIssueTypes } from "../services/use-dynamic-form-queries";

interface IssueType {
  id: string;
  name: string;
  iconUrl: string;
  subtask: boolean;
}

interface SelectTypesProps extends SelectControllerProps {
  projectKey: string;
}

export function SelectTypes({ name, form, projectKey, disabled }: SelectTypesProps) {

  const [data, setData] = useState<IssueType[]>([]);

  async function getTypesByProject() {
    const { data: result } = useGetIssueTypes(projectKey);
    setData(result);
  }

  useEffect(() => {
    getTypesByProject();
  }, []);

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field }) => {
        return (
          <Select
            disabled={disabled}
            value={field.value?.id || ''}
            onValueChange={(value) => field.onChange(data.find(item => item.id === value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione">
                {field.value ? (
                  <div className="flex items-center gap-1">
                    <Image
                      unoptimized
                      priority
                      src={field.value?.iconUrl}
                      width={15}
                      height={15}
                      alt="Padrão"
                    />
                    {field.value?.name}
                  </div>
                ) : "Selecione"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <div>
                <SelectGroup>
                  <SelectLabel>Padrão</SelectLabel>
                  {data.filter(el => !el.subtask).map((el, idx) => (
                    <SelectItem key={idx} value={el.id}>
                      <div className="flex items-center gap-1">
                        {el.iconUrl &&
                          <Image
                            unoptimized
                            priority
                            src={el.iconUrl}
                            loader={() => el.iconUrl}
                            width={15}
                            height={15}
                            alt={el.name}
                          />
                        }
                        {el.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
                <Separator className="my-1" />
                <SelectGroup>
                  <SelectLabel>Subtarefas</SelectLabel>
                  {data.filter(el => el.subtask).map((el, idx) => (
                    <SelectItem key={idx} value={el.id}>
                      <div className="flex items-center gap-1">
                        {el.iconUrl &&
                          <Image
                            unoptimized
                            priority
                            src={el.iconUrl}
                            loader={() => el.iconUrl}
                            width={15}
                            height={15}
                            alt={el.name}
                          />
                        }
                        {el.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </div>
            </SelectContent>
          </Select>
        )
      }}
    />
  )
}
