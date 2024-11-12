'use client'
import { CauseAnalysisContext } from "@/contexts/cause-analysis/cause-analysis";
import { CauseAnalysis } from "@/shared/interfaces/cause-analysis";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";

export const CauseAnalysisProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const form = useForm();
  const [causeAnalysis, setCauseAnalysis] = useState<CauseAnalysis>({} as CauseAnalysis);

  const [causeAnalysisKeys, setCauseAnalysisKeys] = useState<string[]>([]);

  const addcauseAnalysis = (data) => {
    setCauseAnalysis(data);
  };

  return (
    <CauseAnalysisContext.Provider value={{
      form,
      addcauseAnalysis,
      causeAnalysis,
      causeAnalysisKeys,
      setCauseAnalysisKeys,
      setCauseAnalysis
    }}>
      {children}
    </CauseAnalysisContext.Provider>
  );
};