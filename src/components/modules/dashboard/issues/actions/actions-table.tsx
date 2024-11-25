'use client'
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useActions } from "@/hooks/actions/use-actions";
import { Action } from "@/shared/interfaces/actions";
import Image from "next/image";
import { Fragment } from "react";
import CorrectiveAction from '../../../../../../public/assets/images/png/corretiveaction.png';
import ImmediateAction from '../../../../../../public/svg/immediateaction.svg';
import ImprovementAction from '../../../../../../public/svg/improvementaction.svg';

export function ActionsTable() {
  const { actions } = useActions();

  const actionsIcons: Record<string, any> = {
    "10800": ImmediateAction,
    "10801": CorrectiveAction,
    "10802": ImprovementAction,
  }

  return (
    <Fragment>
      {actions.length > 0 && (
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
                    {actions.some(action => action?.customfield_12304?.value) && (
                      <TableHead className="text-center">Subsetor</TableHead>
                    )}
                    <TableHead className="text-center">Data de Entrega</TableHead>
                    {actions.some(action => action?.timetracking?.originalEstimate) && (
                      <TableHead className="text-center">Tempo Estimado</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {actions.map((action: Action, idx: number) => {
                    const [year, month, day] = action.duedate?.split("-") ?? [];
                    const duedate = `${day}/${month}/${year}`;

                    return (
                      <TableRow className='text-center' key={idx}>
                        <TableCell className="flex items-center justify-center">
                          <div className="mt-1" >
                            <Image
                              unoptimized
                              priority
                              src={actionsIcons[action.issueTypeId]}
                              loader={() => actionsIcons[action.issueTypeId]}
                              width={15}
                              height={15}
                              alt="tipo-da-action"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{action.summary}</TableCell>
                        <TableCell className="text-center">{formatName(action.reporter)}</TableCell>
                        <TableCell className="text-center">{formatName(action.assignee)}</TableCell>
                        {action.customfield_12304 && <TableCell className="text-center">
                          {action.customfield_12304.value}
                        </TableCell>
                        }
                        {action.duedate && <TableCell className="text-center">{duedate}</TableCell>}
                        {action?.timetracking?.originalEstimate &&
                          <TableCell className="text-center">
                            {action?.timetracking?.originalEstimate}
                          </TableCell>
                        }
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
};