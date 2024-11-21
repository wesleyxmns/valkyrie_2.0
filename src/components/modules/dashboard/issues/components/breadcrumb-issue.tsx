'use client'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { useActions } from "@/hooks/actions/use-actions";

interface BreadcrumbIssueProps {
    issueKey: string,
    backToEpic: () => void,
    renderSubtask: () => void
}

export function BreadcrumbIssue({ issueKey, renderSubtask, backToEpic }: BreadcrumbIssueProps) {

    const { actionsField } = useActions();

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbLink onClick={backToEpic} className="cursor-pointer">
                    {issueKey}
                </BreadcrumbLink>
                <BreadcrumbSeparator />
                {actionsField && (
                    <BreadcrumbItem className="cursor-pointer" onClick={renderSubtask}>
                        <BreadcrumbLink>{actionsField.key}</BreadcrumbLink>
                    </BreadcrumbItem>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    );
}