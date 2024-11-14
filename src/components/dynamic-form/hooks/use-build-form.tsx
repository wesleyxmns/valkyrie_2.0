'use client'
import { BuildFormProps } from "@/shared/interfaces/dynamic-form";
import { useForm } from "react-hook-form";
import { useBuildDynamicForm } from "./use-build-dynamic-form";

export function useBuildForm({ epicKey, projectKey, fields }: BuildFormProps) {
  const form = useForm();
  const { fieldsComponents, textFieldsComponentsValues, setTextFieldsComponentsValues } = useBuildDynamicForm({ epicKey, form, projectKey, fields })

  return {
    form,
    fieldsComponents,
    textFieldsComponentsValues,
    setTextFieldsComponentsValues
  }
}
