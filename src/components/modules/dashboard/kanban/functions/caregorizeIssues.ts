import { JiraStatuses } from "@/shared/enums/jira-enums/jira-statuses";

interface CategorizeIssuesProps {
    statusOfEachTasks: Array<Record<string, any>>;
    issues: Array<Record<string, any>>
}

export function categorizeIssues({ statusOfEachTasks, issues }: CategorizeIssuesProps) {
    const statusSet = new Set();

    statusOfEachTasks?.forEach(issueType => {
        issueType.statuses.forEach((status: any) => {
            statusSet.add(JSON.stringify(status));
        });
    });

    const uniqueStatuses = Array.from(statusSet).map((status: unknown) => {
        const _status = JSON.parse(status as string);
        return {
            id: _status.id,
            title: _status.name,
            tasks: issues?.filter((issue: any) => issue.fields.status.id === _status.id)
                .map((issue: any) => ({ ...issue, issueKey: issue.key }))
        }
    });

    const uniqueStatusesArray = uniqueStatuses.filter(
        item => item.title !== JiraStatuses.DONE && item.title !== JiraStatuses.CANCELLED
    );

    const sortByOrder = (array, statusOrders, key) => {
        const order = statusOrders[key];
        if (!order) {
            throw new Error(`Order for key "${key}" not found in statusOrders.`);
        }

        const orderMap = order.reduce((acc, title, index) => {
            acc[title] = index;
            return acc;
        }, {});

        return array?.sort((a, b) => {
            return orderMap[a.title] - orderMap[b.title];
        });
    };

    const sortedArray = sortByOrder(uniqueStatusesArray, statusOrders, 'WFTQ');
    return sortedArray;
}

const statusOrders = {
    WFTQ: ['Backlog', 'To Do', 'Em Análise', 'VALIDA', 'INVALIDA', 'Aguardando Aprovação', 'In Progress', 'Aguardando Aprovação', 'APROVADA', 'Under Review']
}