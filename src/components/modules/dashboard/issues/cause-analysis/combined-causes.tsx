'use client'
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CauseAnalysis, Whys } from "@/shared/interfaces/cause-analysis";
import { Trash2 } from "lucide-react";

interface CausesProps {
  issueKey: string,
  whys: string[],
  causeAnalysis: CauseAnalysis
  localCauses: Whys[],
  setLocalCauses: React.Dispatch<React.SetStateAction<Whys[]>>
  setCausesaction: React.Dispatch<React.SetStateAction<CauseAnalysis>>
}

export function CombinedCauses({ issueKey, whys, causeAnalysis, localCauses, setCausesaction, setLocalCauses }: CausesProps) {
  const keyMapping = {
    firstBecause: whys[0],
    secondBecause: whys[1],
    thirdBecause: whys[2],
    fourthBecause: whys[3],
    fifthBecause: whys[4],
    rootCause: 'Causa Raíz'
  };

  const handleDelete = (index: number) => {
    const updatedCauseaction = causeAnalysis.whys.filter((_, idx) => idx !== index);
    const updatedLocalCauses = localCauses?.filter((_, idx) => idx !== index);

    setCausesaction((prevState) => ({ ...prevState, whys: updatedCauseaction }));
    setLocalCauses(updatedLocalCauses);
  };

  return (
    <div className="h-full flex flex-col gap-1">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">{`Análise de Causa - ${issueKey}`}</h2>
          <Button
            className="w-[65px]"
            variant="outline"
            size="sm"
            onClick={() => setCausesaction((prevState) => ({ ...prevState, whys: [] }))}
          >
            Limpar
          </Button>
        </div>
        <ScrollArea className="h-[500px]">
          <div className="w-full flex flex-col gap-1 overflow-auto">
            {causeAnalysis.whys?.map((element: Record<string, any>, idx: number) => (
              <div key={idx} className="p-4 border rounded-md text-semibold">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold mb-2">{`Causa ${idx + 1}`}</h3>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(idx)}>
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
                <ul className="list-disc pl-5">
                  {Object.entries(element).map(([key, value]) => {
                    if (value && value.trim() !== '') {
                      return (
                        <li key={key} className="">
                          <span className={`text-sm font-semibold ${key === 'rootCause' ? 'text-red-500' : ''}`}>
                            {keyMapping[key]}:
                          </span>
                          <span className="text-sm"> {value}</span>
                        </li>
                      );
                    }
                    return null;
                  })}
                </ul>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}