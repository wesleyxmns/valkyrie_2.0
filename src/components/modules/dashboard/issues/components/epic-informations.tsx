'use client';
import AttachmentThumbnails from "@/components/dynamic-form/fields-components/attachments-content";
import { Badge } from "@/components/ui/badge";
import { CardTitle } from "@/components/ui/card";
import { Comments } from "@/components/ui/coments";
import { Textarea } from "@/components/ui/textarea";
import { useBrynhildrData } from "@/hooks/brynhildr-data/brynhildr-data";
import { parseCookies } from "nookies";
import { Fragment } from "react";

interface EpicInformationsProps {
  epicKey: string;
}

export function EpicInformations({ epicKey }: EpicInformationsProps) {

  const { '@valkyrie:auth-token': token } = parseCookies();
  const userAuthorization = `Basic ${token}`;

  const { useGetIssue } = useBrynhildrData();
  const { data: issue } = useGetIssue(epicKey, userAuthorization);

  return (
    <Fragment>
      <div className="space-y-1" >
        <CardTitle className="text-2xl" >
          {issue?.key ?? ''}: {issue?.fields?.summary ?? ''}
        </CardTitle>
        < div className="flex items-center space-x-2" >
          <Badge variant="outline">{issue?.fields?.status?.name}</Badge>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2" >Descrição</h3>
        <div className="bg-muted p-4 rounded-md" >
          <Textarea className="resize-none" disabled value={issue?.fields?.description ?? ''} rows={8} />
        </div>
      </div>

      < div >
        <h3 className="text-lg font-semibold mb-2" > Anexos </h3>
        < div className="grid grid-cols-1 md:grid-cols-2 gap-4" >
          <AttachmentThumbnails attachments={issue?.fields?.attachment ?? []} />
        </div>
      </div>

      <Comments showComponent issueKey={issue?.key ?? ''} />
    </Fragment>
  )
}
