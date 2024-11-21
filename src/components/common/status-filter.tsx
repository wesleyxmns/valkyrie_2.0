import React, { cloneElement, Fragment, ReactElement } from 'react';
import { JiraStatusesId } from '../../shared/enums/jira-enums/jira-statuses-id';

interface StatusFilterProps {
  children: React.ReactNode;
  currentStatus: JiraStatusesId;
  all?: boolean;
  statuses?: JiraStatusesId[];
}

export const StatusFilter: React.FC<StatusFilterProps> = ({ children, currentStatus, all = false, statuses = [] }) => {
  const isDisabled = !all && !statuses.includes(currentStatus);
  const childrenWithProps = cloneElement(children as ReactElement, { disabled: isDisabled });

  if (all || statuses.includes(currentStatus)) {
    return <Fragment>{childrenWithProps} </Fragment>
  }

  return null;
};
