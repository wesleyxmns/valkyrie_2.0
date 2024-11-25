export enum IssueLinkType {
  BLOCK = 'Blocks', // blocks | is blocked by
  CLONED = 'Cloners', // clones | is cloned by
  CHILD = 'Child', // is child of | is parent of
  DEVELOPS = 'Develops', // is being developed in | develops
  DUPLICATE = 'Duplicates', // duplicates | is duplicated by,
  PARENT_CHILD = 'Parent-Child', // is child of | is parent of
  RELATES = 'Relates', // relates to | relates to
  GANTT_START_TO_START = 'Gantt Start To Start', // has to be started together with
  GANTT_START_TO_END = 'Gantt Start To End', // earliest end is start of | start is earliest end of
  GANTT_END_TO_START = 'Gantt End To Start', // has to be done before | has to be done after
  GANTT_END_TO_END = 'Gantt End To End', // has to be finished together with
}