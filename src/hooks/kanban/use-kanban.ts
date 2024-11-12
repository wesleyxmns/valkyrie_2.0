import { KanbanContext } from "@/contexts/kanban/kanban-context"
import { useContext } from "react"

export function useKanban() {
  const context = useContext(KanbanContext)
  if (!context) {
    throw new Error("useKanbanContext must be used within a SubtasksProvider")
  } else {
    return context
  }
}