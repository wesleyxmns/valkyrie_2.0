import { BrynhildrService } from '@/services/external/brynhildr-service/brynhildr-service';
import { buildIssueStructure } from '@/shared/builds/build-structure-actions';
import { CustomFields } from '@/shared/constants/jira/jira-custom-fields';
import { IssueLinkType } from '@/shared/enums/jira-enums/issue-link-types';
import { IssueTypesId } from '@/shared/enums/jira-enums/issues-types-id';
import { JiraStatusesId } from '@/shared/enums/jira-enums/jira-statuses-id';
import { ProjectsId } from '@/shared/enums/jira-enums/projects-id';
import { CauseAnalysisTransitions } from '@/shared/enums/rnc-enums/cause-analysis-transitions';
import { buildCauseAnalysisText } from '@/shared/functions/build-causes-analysis-text';
import { CauseAnalysis } from '@/shared/interfaces/cause-analysis';
import { parseCookies } from 'nookies';

interface OnHandleLinkCauseAnalysis {
    fields: Record<string, any>
    issueKey: string;
    setCauseAnalysisKeys: React.Dispatch<React.SetStateAction<string[]>>;
    causeAnalysis: CauseAnalysis
}

const brynhildrService = new BrynhildrService()

export async function onHandleLinkCauseAnalysis({ fields = {}, issueKey, causeAnalysis, setCauseAnalysisKeys }: OnHandleLinkCauseAnalysis) {

    const { '@valkyrie:auth-token': token } = parseCookies();
    const userAuthorization = `Basic ${token}`;

    const { createIssue, createBulkIssues, getTransitions, doTransition, createIssueLink } = brynhildrService;

    const causeAnalisyBody = {
        projectId: ProjectsId.WFTQ,
        issueTypeId: IssueTypesId.ANALISE_DE_CAUSA,
        summary: `Análise de Causa - ${fields[CustomFields.EPIC_NAME.id]}`,
        reporter: causeAnalysis.reporter,
        assignee: causeAnalysis.assignee,
        description: buildCauseAnalysisText(causeAnalysis.whys),
        args: {
            [CustomFields.SETOR_ORIGEM.id]: causeAnalysis.originSector,
            [CustomFields.EPIC_LINK.id]: issueKey
        }
    }

    const causeAnalysiRes = await createIssue({
        userAuthorization,
        fields: causeAnalisyBody,
    });

    if (causeAnalysiRes) {
        const responseTransition = await getTransitions(causeAnalysiRes.key, userAuthorization);
        const toInProgressTransition = responseTransition.find((transition: Record<string, any>) => transition.to.id === JiraStatusesId.IN_PROGRESS);
        if (toInProgressTransition) {
            await doTransition(causeAnalysiRes.key, CauseAnalysisTransitions.CONFIRMAR, userAuthorization);
        }

        const correctiveActionIssues = buildIssueStructure({ actions: causeAnalysis.correctiveActions, parentKey: issueKey });
        if (correctiveActionIssues.length > 0) {
            const correctiveActionRes = await createBulkIssues({
                userAuthorization,
                issues: correctiveActionIssues
            })

            const correctiveActionKeys = correctiveActionRes.issues?.map((issue: Record<string, any>) => issue.key);
            setCauseAnalysisKeys(correctiveActionKeys);

            for await (const task of correctiveActionRes.issues) {
                await createIssueLink({
                    userAuthorization,
                    type: IssueLinkType.RELATES,
                    inwardKey: task.key,
                    outwardKey: causeAnalysiRes.key
                })
            }
        }
    }
}