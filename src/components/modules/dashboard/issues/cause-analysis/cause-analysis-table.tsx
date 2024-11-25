'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CorrectiveAction } from "@/shared/types/corrective-action";
import { ClipboardListIcon, ListIcon } from "lucide-react";
import Image from "next/image";
import { Fragment } from "react";
import CorrectActionIcon from '../../../../../../public/assets/images/png/corretiveaction.png';

interface CorrectiveActionsTableProps {
  issueKey: string,
  correctiveActions: CorrectiveAction[],
}

export function CorrectiveActionsTable({ issueKey, correctiveActions }: CorrectiveActionsTableProps) {
  return (
    <Fragment>
      {correctiveActions.length > 0 && (
        <ScrollArea className="overflow-x-auto">
          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="text-center">
                    <TableHead className="text-center">Tipo de Tarefa</TableHead>
                    <TableHead className="text-center">Sumário</TableHead>
                    <TableHead className="text-center">Reporter</TableHead>
                    <TableHead className="text-center">Assignee</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {correctiveActions.map((action: Record<string, any>, index: number) => {
                    return (
                      <TableRow className="text-center" key={index}>
                        <TableCell className="flex items-center justify-center">
                          <div className="mt-3">
                            <Image
                              unoptimized
                              priority
                              src={CorrectActionIcon}
                              width={15}
                              height={15}
                              alt="tipo-da-subtask"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{action.summary}</TableCell>
                        <TableCell className="text-center">{formatName(action.reporter)}</TableCell>
                        <TableCell className="text-center">{formatName(action.assignee)}</TableCell>

                        <TableCell className="text-center">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <ClipboardListIcon className="h-4 w-4" />
                                  <span className="sr-only">Cause action</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="font-medium">Análises de Causa</div>
                                {correctiveActions?.length > 0 && (
                                  <ul className="space-y-1 text-muted-foreground text-sm">
                                    <li className="text-white" key={index}>{`Análise ${issueKey}`}</li>
                                  </ul>
                                )}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>

                        <TableCell className="text-center">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <ListIcon className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="font-medium">Labels</div>
                                {action.labels?.length > 0 && (
                                  <ul className="space-y-1 text-muted-foreground text-sm">
                                    {action.labels.map((label: string, index: number) => {
                                      return (
                                        <li className="text-white" key={index}>{label}</li>
                                      )
                                    })}
                                  </ul>
                                )}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <ScrollBar orientation='horizontal' />
        </ScrollArea>
      )}
    </Fragment>
  )

  function formatName(name: string) {
    return name?.split('.').map(word => word.toUpperCase()).join(' ');
  }
}



