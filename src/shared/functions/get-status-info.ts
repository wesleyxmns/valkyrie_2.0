import { AlertCircle, CheckCircle, Clock } from "lucide-react";

export const getStatusInfo = (status: string) => {
  switch (status) {
    case 'In Progress':
    case 'Under Review':
      return { color: 'bg-blue-100 text-blue-800', icon: AlertCircle };
    case 'Done':
      return { color: 'bg-green-100 text-green-800', icon: CheckCircle };
    default:
      return { color: 'bg-gray-100 text-gray-800', icon: Clock };
  }
};