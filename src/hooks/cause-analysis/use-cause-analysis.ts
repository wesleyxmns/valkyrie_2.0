import { CauseAnalysisContext } from "@/contexts/cause-analysis/cause-analysis";
import { useContext } from "react";

export const useCauseAnalysis = () => {
  const context = useContext(CauseAnalysisContext);
  if (!context) {
    throw new Error('usecauseAnalysisContext must be used within a causeAnalysisProvider');
  }
  return context;
};