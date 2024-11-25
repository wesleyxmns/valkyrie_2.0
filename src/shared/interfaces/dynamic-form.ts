import { FieldValues, UseFormReturn } from "react-hook-form"

export interface BuildFormProps {
  epicKey?: string
  projectKey: string
  fields?: Record<string, any>
}

export interface UseComponentFiledProps {
  epicKey?: string
  projectKey: string,
  form: UseFormReturn<FieldValues, any, undefined>,
  fields?: Record<string, any>
}

export interface SelectControllerProps {
  value?: any
  disabled?: boolean
  name: string;
  form: UseFormReturn<FieldValues, any, undefined>
}