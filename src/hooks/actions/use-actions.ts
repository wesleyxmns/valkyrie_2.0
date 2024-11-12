import { ActionsContext } from '@/contexts/actions/actions-context';
import { useContext } from "react";

export function useSubtasksContext() {
  const context = useContext(ActionsContext)
  if (!context) {
    throw new Error("useSubtasks must be used within a SubtasksProvider")
  } else {
    return context
  }
}