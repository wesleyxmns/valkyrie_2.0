export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Low':
    case 'Lowest':
      return 'bg-blue-100 text-blue-800';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'High':
    case 'Highest':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
