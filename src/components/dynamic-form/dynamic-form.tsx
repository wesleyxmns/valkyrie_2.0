'use client'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollBar } from "@/components/ui/scroll-area";
import { CustomFields } from "@/shared/constants/jira/jira-custom-fields";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { formSchemas } from "./form-schemas";

interface DynamicFormProps {
  key: string;
  fieldsComponents: Record<string, React.ReactNode>;
}

export const DynamicForm = ({ key, fieldsComponents }: DynamicFormProps) => {

  const schemaComponents = formSchemas[key];

  if (!schemaComponents) {
    return null;
  }

  const rightColumnComponents = [
    'description',
    CustomFields.ITEM_RNC.id,
    "comments",
    'attachments',
    'actions',
    'actionsTable',
    'actionsList',
  ]

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="w-full h-full gap-6 rounded-lg"
    >
      <ResizablePanel defaultSize={35} className="h-full">
        <ScrollArea className="min-h-[50rem] w-full p-3">
          <div className="h-full space-y-2">
            {schemaComponents.filter((fieldKey: string) => !rightColumnComponents.includes(fieldKey))
              .map((fieldKey: string, idx: number) => (
                <div key={idx}>
                  {fieldsComponents[fieldKey]}
                </div>
              ))}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={65} className="h-full">
        <ScrollArea className="h-full w-full p-3">
          <div className="min-h-[50rem] space-y-2">
            {rightColumnComponents.map((fieldKey: string, idx: number) => (
              <div key={idx}>
                {fieldsComponents[fieldKey]}
              </div>
            ))}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
};
