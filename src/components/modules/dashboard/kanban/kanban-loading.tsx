import { Skeleton } from "@/components/ui/skeleton";

export const KanbanLoading = ({ columns }) => {
  return (
    <div className="flex h-[600px] pt-12 pb-10 mt-18 mb-2 p-2 overflow-x-hidden space-x-4">
      {columns.map((column) => (
        <div key={column.id} className="w-72 flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex justify-end space-x-2 items-center mb-4">
            <Skeleton className="h-6 w-24 bg-gray-300 dark:bg-gray-700" />
            <Skeleton className="h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-700" />
          </div>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-md bg-gray-300 dark:bg-gray-700" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};