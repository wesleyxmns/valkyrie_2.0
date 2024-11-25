import { WorklogContext } from "@/contexts/worklog/worklog-context";
import { useContext } from "react";

export const useWorklog = () => {
  const context = useContext(WorklogContext);
  if (!context) {
    throw new Error('useWorklog must be used within a WorklogProvider');
  }
  return context;
};