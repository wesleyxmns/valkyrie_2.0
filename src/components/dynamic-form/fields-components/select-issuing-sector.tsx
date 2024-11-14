'use client'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/auth/use-auth";
import { jiraGroups } from "@/shared/constants/jira/jira-groups";
import { JiraSectorOptions } from "@/shared/constants/jira/jira-sector-options";

import { SelectControllerProps } from "@/shared/interfaces/dynamic-form";
import { Controller } from "react-hook-form";

export function SelectIssuingSector({ form, name, value, disabled }: SelectControllerProps) {
  const { user } = useAuth();

  const groups = user?.getGroups().items.map((group: any) => group.name);
  const listGroupsFromJira = Object.values(jiraGroups);

  let mainGroup;
  let _groups;

  _groups = groups?.filter((group) => group.includes("Managers") || group.includes("Global"))

  if (_groups?.length > 0) {
    const isQualityMember = _groups?.find((group) => group.includes("QUALIDADE - Managers") || group.includes("QUALIDADE - Global"))
    if (isQualityMember) {
      mainGroup = isQualityMember
    } else {
      mainGroup = listGroupsFromJira?.find((group) => groups?.includes(group) ?? false)
    }
  } else {
    mainGroup = listGroupsFromJira?.find((group) => groups?.includes(group) ?? false)
  }

  if (mainGroup?.includes("-")) {
    mainGroup = mainGroup?.split("-")[0].trim();
  }

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field }) => (
        <Select
          disabled={disabled}
          value={field.value}
          onValueChange={(newValue) => {
            field.onChange(newValue);
            form.setValue(name, newValue);
          }}
          defaultValue={mainGroup === "QUALIDADE" ? JiraSectorOptions?.find((sector) => sector.value.includes(mainGroup))?.value : mainGroup}
        >
          <SelectTrigger>
            <SelectValue placeholder={value ? value : "Selecione"} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {mainGroup === "QUALIDADE" ? (
                JiraSectorOptions.map((item: any, idx: number) => (
                  <SelectItem key={idx} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))
              ) : (
                <SelectItem disabled value={mainGroup}>
                  <div className="flex items-center gap-1">
                    {mainGroup}
                  </div>
                </SelectItem>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    />
  )
}