'use client'
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ShinyButton } from "@/components/ui/shiny-button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Plus, X } from "lucide-react";
import React, { forwardRef, memo, useState } from "react";
import { Controller, FormProvider } from "react-hook-form";
import useCreateAutomatic from "./hooks/use-create-automatic";
import useCreateManual from "./hooks/use-create-manual";
import { avoidDefaultDomBehavior } from "@/shared/functions/avoidDefaultDomBehavior";
import { SelectClient } from "@/components/dynamic-form/fields-components/select-client";

const _ToggleCreateIssue = (
  { children, projectKey }: { children: React.ReactNode; projectKey: string },
  ref: React.Ref<HTMLDivElement>
) => {
  const [activeTab, setActiveTab] = useState('manual');

  const {
    form,
    openDialog,
    handleOpenChange,
    onHandleSendFormValues,
    memoizedFieldsComponents,
    isSubmitting } = useCreateManual(projectKey);

  const {
    form: automaticFormInstance,
    handleSearch,
    listIssues,
    selectedIssues,
    handleSelectIssue,
    handleOpenReport
  } = useCreateAutomatic(form, setActiveTab);

  return (
    <Dialog open={openDialog} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        onPointerDownOutside={avoidDefaultDomBehavior}
        onInteractOutside={avoidDefaultDomBehavior}
        ref={ref}
        className="w-auto min-w-[1500px] min-h-[600px]"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <DialogHeader>
            <DialogTitle className="flex gap-3 items-center">
              Nova Tarefa
              <TabsList>
                <TabsTrigger value="manual" className="w-full">Manual</TabsTrigger>
                <TabsTrigger value="automatica" className="w-full">Automática</TabsTrigger>
              </TabsList>
            </DialogTitle>
            <DialogDescription>
              Preencha os campos necessários e clique em 'criar' quando terminar.
            </DialogDescription>
          </DialogHeader>

          <TabsContent value="manual">
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onHandleSendFormValues)}>
                <ScrollArea className="h-[750px]">
                  {memoizedFieldsComponents}
                  <ScrollBar orientation="vertical" />
                </ScrollArea>
                <DialogFooter className="flex items-center">
                  <ShinyButton
                    className={isSubmitting ? 'animate-pulse' : ''}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ?
                      <div>
                        <span className="mr-1">Criando</span>
                        <span className="animate-[ping_1.5s_0.5s_ease-in-out_infinite]">.</span>
                        <span className="animate-[ping_1.5s_0.7s_ease-in-out_infinite]">.</span>
                        <span className="animate-[ping_1.5s_0.9s_ease-in-out_infinite]">.</span>
                      </div> :
                      'Criar'
                    }
                  </ShinyButton>
                </DialogFooter>
              </form>
            </FormProvider>
          </TabsContent>

          <TabsContent value="automatica" className="flex flex-col gap-6 justify-start">
            <FormProvider {...automaticFormInstance}>
              <form onSubmit={handleSearch}>
                <div className="flex items-center gap-4 w-full" style={{ flexWrap: 'wrap' }}>
                  <div className="flex-1 w-[600px]">
                    <FloatingLabelInput id="Cliente" label="Cliente">
                      <SelectClient name="client" form={automaticFormInstance} projectKey={projectKey} />
                    </FloatingLabelInput>
                  </div>

                  <div className="flex-1 min-w-[200px]">
                    <FloatingLabelInput id="Ordem de Produção" label="Ordem de Produção">
                      <Controller name="op" control={automaticFormInstance.control} render={({ field }) => {
                        return (
                          <Input
                            {...field}
                            placeholder="Ex: A0000001001"
                            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                          />
                        )
                      }}
                      />
                    </FloatingLabelInput>
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <FloatingLabelInput id="Descrição" label="Descrição">
                      <Controller name="description" control={automaticFormInstance.control} render={({ field }) => {
                        return <Input {...field} />;
                      }}
                      />
                    </FloatingLabelInput>
                  </div>
                  <Button type="submit">Pesquisar</Button>
                  <Button onClick={handleOpenReport} disabled={selectedIssues.length === 0}>
                    Abrir relatório
                  </Button>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <span className="font-semibold text-sm">Tarefas selecionadas:</span>
                  {selectedIssues.length > 0 ? (
                    selectedIssues.map((issue) => (
                      <div key={issue.issueKey} className="flex items-center gap-2">
                        <Badge className="flex items-center gap-1">
                          {issue.issueKey} - {issue.op}
                          <Button
                            onClick={() => handleSelectIssue(issue)}
                            variant="outline"
                            size="xs"
                            className="h-5 rounded-full bg-white text-black p-1"
                          >
                            <X size={12} />
                          </Button>
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <span className="font-semibold text-sm" >Nenhuma tarefa selecionada</span>
                  )}
                </div>
              </form>
            </FormProvider>
            {listIssues.length > 0 && (
              <ScrollArea className="overflow-x-auto h-[500px]">
                <Card>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="text-center">
                          {Object.keys(listIssues[0] || {}).map((key) => {
                            const translatedKey = {
                              issueKey: "Chave",
                              reporter: "Reporter",
                              assignee: "Assignee",
                              order: "Pedido",
                              op: "Ordem de Produção",
                              descricao: "Descrição",
                              sbItemProposta: "SB_Item_Proposta",
                              cliente: "Cliente",
                              qtdItem: "Quantidade"
                            }[key] || key;

                            return (
                              <TableHead key={key} className="text-center">
                                {translatedKey}
                              </TableHead>
                            );
                          })}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {listIssues.map((issue: Record<string, any>, idx: number) => {
                          return (
                            <TableRow className="text-center" key={idx}>
                              {Object.keys(issue).map((key) => (
                                <TableCell key={key} className="text-center">
                                  {typeof issue[key] === 'string' ?
                                    (key === 'reporter' || key === 'assignee' ? issue[key].replace('.', ' ').toUpperCase() : issue[key].toUpperCase())
                                    : issue[key]}
                                </TableCell>
                              ))}
                              <TableCell>
                                <Button
                                  onClick={() => handleSelectIssue(issue)}
                                  variant={selectedIssues.some(i => i.issueKey === issue.issueKey) ? "default" : "outline"}
                                >
                                  {selectedIssues.some(i => i.issueKey === issue.issueKey) ? <Check size={16} /> : <Plus size={16} />}
                                </Button>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export const ToggleCreateIssue = memo(forwardRef(_ToggleCreateIssue));