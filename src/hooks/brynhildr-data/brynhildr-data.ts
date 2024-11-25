import { BrynhildrContext } from "@/contexts/brynhildr-data/brynhildr-data-context";
import { useContext } from "react";

export function useBrynhildrData() {
  const context = useContext(BrynhildrContext);
  if (!context) {
    throw new Error('useDynamicFormQueries must be used within a DynamicFormQueriesProvider');
  }
  return context;
}