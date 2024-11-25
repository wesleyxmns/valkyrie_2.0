'use client'
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { UserDTO } from "@/dtos/responses/user-dto";
import { useActions } from "@/hooks/actions/use-actions";
import { useAuth } from "@/hooks/auth/use-auth";
import { useBrynhildrData } from "@/hooks/brynhildr-data/brynhildr-data";
import React, { forwardRef, Fragment, useState } from "react";
import { ActionContentForm } from "./action-content-form";

interface SubtaskFormEditableProps {
  children: React.ReactNode;
  tasks: Array<Record<string, any>>;
  index: number;
};

export const ActionEditableForm = forwardRef<HTMLDivElement, SubtaskFormEditableProps>(({ children, tasks, index }, ref) => {

  const projectKey = tasks[index].fields?.project?.key;

  const [isOpen, setIsOpen] = useState(false);

  const toggleForm = () => setIsOpen(!isOpen);

  const { user } = useAuth()

  const { setActionsField } = useActions();

  const { useGetAllTasks } = useBrynhildrData();
  const { data: tasksData } = useGetAllTasks(user as UserDTO, projectKey);

  const currentAction = tasksData?.find((task) => task.key === tasks[index].key);

  const handleSubtaskClick = () => {
    if (!currentAction?.key) return;
    if (currentAction) {
      setActionsField(currentAction);
    }
    toggleForm();
  };

  return (
    <Fragment>
      {React.isValidElement(children) && React.cloneElement(children as React.ReactElement<any>, {
        onClick: () => currentAction?.key && handleSubtaskClick(),
        ref: ref
      })}
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <ActionContentForm isVisible={isOpen} />
          </DialogContent>
        </Dialog>
      )}
    </Fragment>
  );
});