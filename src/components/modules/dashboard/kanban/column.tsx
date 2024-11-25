import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { TasksList } from "./tasks-list";
import { ColumnKanbanProps } from "@/shared/types/kanban";
import { Draggable } from "@hello-pangea/dnd";

interface ColumnProps extends ColumnKanbanProps {
  index: number;
}

export function Column({ id, title, tasks, index }: ColumnProps) {
  return (
    <Draggable key={id} draggableId={id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
        >
            <Card
            ref={provided.innerRef}
            className="col-span-1 min-w-[250px] h-auto rounded-2xl p-4 space-y-4 select-none shadow-lg border bg-gray-100 dark:bg-gray-800"
            {...provided.dragHandleProps}
            >
            <CardHeader className="border-b-2">
              <span className="flex items-center gap-3 font-semibold text-sm">
              <span className="ml-auto ">{title}</span>
                <Badge variant={"outline"} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                {tasks.length}
                </Badge>
              </span>
            </CardHeader>
            <TasksList tasks={tasks} columnId={id} />
            </Card>
        </div>
      )}
    </Draggable>
  );
}