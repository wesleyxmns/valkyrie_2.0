'use client'
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { useBrynhildrData } from '@/hooks/brynhildr-data/brynhildr-data';
import { CustomFields } from '@/shared/constants/jira/jira-custom-fields';
import { extractEnumeratedRootCauses } from '@/shared/functions/extract-root-cause';
import { AlertCircle, CheckCircle, ChevronDown, Clock } from 'lucide-react';
import Image from 'next/image';
import React, { Fragment } from 'react';
import CORRECTIVEACTIONICON from '../../../../../../public/assets/images/png/corretiveaction.png';
import CAUSEANALYSISICON from '../../../../../../public/svg/cause-analysis-icon.svg';
import { BrynhildrService } from "@/services/external/brynhildr-service/brynhildr-service";
import { useActions } from "@/hooks/actions/use-actions";
import { parseCookies } from "nookies";
import { getStatusInfo } from "@/shared/functions/get-status-info";
import { getPriorityColor } from "@/shared/functions/get-priority-color";

const brynhildrService = new BrynhildrService();

export const CauseAnalysisSectors: React.FC<{ epicLink }> = ({ epicLink }) => {

  const [currentTaskKey, setCurrentTaskKey] = React.useState<string>('');

  const { '@valkyrie:auth-token': token } = parseCookies();
  const userAuth = `Basic ${token}`;

  const { getIssue } = brynhildrService;

  const { setActionsField, setEnabled } = useActions();
  const { useGetCauseAnalysis } = useBrynhildrData();
  const { data: causeAnalysis } = useGetCauseAnalysis(epicLink);

  async function handleGetActionKeyClick(taskKey: string) {
    setCurrentTaskKey(taskKey);
    if (currentTaskKey === taskKey) {
      const issue = await getIssue(taskKey, userAuth);
      setActionsField(issue);
      setEnabled((prevState) => !prevState);
    }
  }

  return (
    <Fragment>
      {causeAnalysis?.issues?.map((issue: Record<string, any>) => {
        const { color: statusColor } = getStatusInfo(issue.fields.status.name);

        return (
          <FloatingLabelInput
            key={issue.id}
            id={`Análise de Causa`}
            label={`Análise de Causa`}
          >
            <Collapsible className="w-full mb-4">
              <Card>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
                  <div className="flex items-center space-x-4">
                    <Image src={CAUSEANALYSISICON} alt="cause-analysis-icon" />
                    <div className="flex flex-col">
                      <Badge
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGetActionKeyClick(issue.key);
                        }}
                        className="font-medium text-xs text-center hover:bg-gray-200 w-fit"
                        variant="outline"
                      >
                        {issue.key}
                      </Badge>
                      <span className="text-xs text-gray-600 whitespace-nowrap">
                        {issue.fields.summary}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="flex items-center space-x-2">
                        <Badge className='text-xs whitespace-nowrap' variant="outline">
                          {issue.fields[CustomFields.SETOR_ORIGEM.id]}
                        </Badge>
                        <Badge className={`${getPriorityColor(issue.fields.priority.name)} text-center`}>
                          <div className="text-center w-full flex items-center gap-1 text-xs">
                            <Image
                              src={issue.fields.priority.iconUrl}
                              width={12}
                              height={12}
                              alt="cause-analysis-icon"
                            />
                            {issue.fields.priority.name}
                          </div>
                        </Badge>
                        <Badge className={`${statusColor} text-center whitespace-nowrap`}>
                          <div className="text-center w-full">
                            {issue.fields.status.name}
                          </div>
                        </Badge>
                      </div>
                      <div className="hidden md:grid grid-cols-2">
                        {extractEnumeratedRootCauses(issue.fields.description)
                          .slice(0, 5)
                          .map((cause, index) => (
                            <Badge key={index} variant="secondary">
                              {cause}
                            </Badge>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 transition-transform transform rotate-0 group-open:rotate-90" />
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <Card className="m-4">
                    <ul className="divide-y">
                      {issue.fields.issuelinks?.map((linkedIssue: Record<string, any>, idx: number) => {
                        const { color: actionStatusColor } = getStatusInfo(linkedIssue.inwardIssue.fields.status.name);

                        return (
                          <li key={linkedIssue.id} className="flex items-center justify-between p-4">
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                handleGetActionKeyClick(linkedIssue.inwardIssue.key);
                              }}
                              className="flex items-center space-x-4 cursor-pointer"
                            >
                              <Image src={CORRECTIVEACTIONICON} alt="corrective-action-icon" />
                              <div className="flex flex-col">
                                <Badge
                                  className="font-medium text-xs text-center hover:bg-gray-200 w-fit"
                                  variant="outline"
                                >
                                  {linkedIssue.inwardIssue.key}
                                </Badge>
                              </div>
                              <Badge className='bg-CorrectiveAction text-white dark:' variant="outline">
                                {linkedIssue.inwardIssue.fields.issuetype.name}
                              </Badge>
                              <div className="flex flex-col">
                                <span className="font-medium">{linkedIssue.key}</span>
                                <span className="text-sm text-gray-600">
                                  {linkedIssue.inwardIssue.fields.summary}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge
                                className={`${getPriorityColor(linkedIssue.inwardIssue.fields.priority.name)} text-center flex items-center gap-2`}
                              >
                                <Image
                                  src={linkedIssue.inwardIssue.fields.priority.iconUrl}
                                  width={15}
                                  height={15}
                                  alt="cause-analysis-icon"
                                />
                                {linkedIssue.inwardIssue.fields.priority.name}
                              </Badge>
                              <Badge className={`${actionStatusColor} text-center`}>
                                {linkedIssue.inwardIssue.fields.status.name}
                              </Badge>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </Card>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </FloatingLabelInput>
        );
      })}
    </Fragment>
  );
};