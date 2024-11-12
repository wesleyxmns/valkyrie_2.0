import { CauseAnalysisContextProps } from "@/shared/interfaces/cause-analysis";
import { createContext } from "react";

export const CauseAnalysisContext = createContext<CauseAnalysisContextProps | undefined>(undefined);