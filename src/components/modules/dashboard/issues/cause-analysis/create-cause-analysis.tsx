'use client'
import { Button } from "@/components/ui/button";
import { CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SquarePlus } from "lucide-react";
import { CauseactionContainer } from "./cause-action-container";
import { CausePanel } from "./cause-panel";
import { CombinedCauses } from "./combined-causes";
import { useCauseAnalysis } from "./useCauseAnalysis";
import { avoidDefaultDomBehavior } from "@/shared/functions/avoidDefaultDomBehavior";
import { ActionPanel } from "./cause-subtasks-panel";
import { Fragment } from "react";

interface CreateCauseAnalysis {
  fields: Record<string, any>;
  projectKey: string,
  issueKey: string
}

export function CreateCauseAnalysis({ issueKey, projectKey, fields = {} }: CreateCauseAnalysis) {
  const {
    openDialog,
    handleOpenChange,
    form,
    isLoading,
    onHandleCreateCauseAnalysis,
    whys,
    causeAnalysis,
    localCauses,
    setCauseAnalysis,
    setLocalCauses,
    newCorrectiveAction,
    setNewCorrectiveAction,
    missingCorrectiveActions,
    setMissingCorrectiveActions,
  } = useCauseAnalysis({ issueKey, projectKey, fields });

  return (
    <CauseactionContainer>
      <Dialog open={openDialog} onOpenChange={handleOpenChange} >
        <DialogTrigger>
          <SquarePlus size={18} className="cursor-pointer" />
        </DialogTrigger>

        <DialogContent className="p-6 h-[800px] max-w-[1800px]" onPointerDownOutside={avoidDefaultDomBehavior} onInteractOutside={avoidDefaultDomBehavior}>

          <div className="w-full h-full flex flex-col space-y-4" >
            <DialogHeader>
              <CardHeader>
                <DialogTitle>Análises de Causas</DialogTitle>
                <DialogDescription>
                  Crie um Análise de Causa e as Ações Corretivas para o problema.
                </DialogDescription>
              </CardHeader>
            </DialogHeader>


            <form className="flex-grow flex flex-col overflow-hidden"
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit(onHandleCreateCauseAnalysis)()
              }}>
              <ResizablePanelGroup className="flex-grow rounded-lg border" direction="horizontal">
                <ResizablePanel defaultSize={30} minSize={30}>
                  <ResizablePanelGroup direction="vertical">
                    <ResizablePanel defaultSize={50} minSize={30}>
                      <ScrollArea className="h-full p-3">
                        <CausePanel
                          fields={fields}
                          issueKey={issueKey}
                          whys={whys}
                          form={form}
                          projectKey={projectKey}
                          causeAnalysis={causeAnalysis}
                          localCauses={localCauses}
                          setCauseAnalysis={setCauseAnalysis}
                          setLocalCauses={setLocalCauses}
                        />
                      </ScrollArea>
                    </ResizablePanel>
                    {causeAnalysis.whys?.length > 0 && (
                      <Fragment>
                        <ResizableHandle withHandle />
                        <ResizablePanel defaultSize={50} minSize={30}>
                          <ScrollArea className="h-full p-3">
                            <CombinedCauses
                              issueKey={issueKey}
                              whys={whys}
                              causeAnalysis={causeAnalysis}
                              localCauses={localCauses}
                              setLocalCauses={setLocalCauses}
                              setCausesaction={setCauseAnalysis}
                            />
                          </ScrollArea>
                        </ResizablePanel>
                      </Fragment>
                    )}
                  </ResizablePanelGroup>
                </ResizablePanel>

                <ResizableHandle withHandle />

                <ResizablePanel defaultSize={50} minSize={30}>
                  <ScrollArea className="h-full p-4">
                    <ActionPanel
                      issueKey={issueKey}
                      form={form}
                      projectKey={projectKey}
                      disabled={causeAnalysis.whys?.length === 0}
                      causesAnalysis={causeAnalysis}
                      setCausesAnalysis={setCauseAnalysis}
                      newCorrectiveAction={newCorrectiveAction}
                      setNewCorrectiveAction={setNewCorrectiveAction}
                      localCauses={localCauses}
                      setLocalCauses={setLocalCauses}
                      missingCorrectiveActions={missingCorrectiveActions}
                      setMissingCorrectiveActions={setMissingCorrectiveActions}
                    />
                  </ScrollArea>
                </ResizablePanel>
              </ResizablePanelGroup>

              <DialogFooter className="mt-4">
                <Button
                  className="cursor-pointer"
                  disabled={isLoading || !form.formState.isValid}
                  type="submit"
                >
                  {isLoading ? 'Vinculando...' : 'Vincular'}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </CauseactionContainer>
  )
}