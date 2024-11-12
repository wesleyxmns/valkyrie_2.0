interface WorklogProps {
  activeTaskIndex: string | null;
  taskTimes: { [key: string]: number };
  isRunning: boolean;
  toggleTimer: (taskIndex: string, initialTime: number) => void;
  formatTime: (seconds: number) => string;
  TimerButton: React.FC<{ issueKey: string; initialTime: number }>;
}