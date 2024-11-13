'use client'
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { WorklogContext } from "@/contexts/worklog/worklog-context";
import { HttpStatus } from "@/lib/fetch/constants/http-status";
import { brynhildrAPI } from "@/lib/fetch/brynhildr-api";
import { avoidDefaultDomBehavior } from "@/shared/functions/avoidDefaultDomBehavior";
import { CirclePlay, Pause } from "lucide-react";
import { parseCookies } from "nookies";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const WorklogProvider = ({ children }) => {
  const { '@valkyrie:auth-token': token } = parseCookies()
  const UserAuth = `Basic ${token}`

  const [activeTaskIndex, setActiveTaskIndex] = useState<string | null>(null);
  const [taskTimes, setTaskTimes] = useState<{ [key: string]: number }>({});
  const [isRunning, setIsRunning] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [comment, setComment] = useState('');
  const [timeSpent, setTimeSpent] = useState(0);

  const startTimeRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number | null>(null);
  const initialTimesRef = useRef<{ [key: string]: number }>({});

  useEffect(() => {
    const savedTaskTimes = localStorage.getItem('taskTimes');
    if (savedTaskTimes) {
      setTaskTimes(JSON.parse(savedTaskTimes));
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isRunning && activeTaskIndex !== null) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsedSinceLastUpdate = lastUpdateTimeRef.current ? (now - lastUpdateTimeRef.current) / 1000 : 0;
        setTaskTimes(prevTimes => {
          const updatedTimes = { ...prevTimes };
          updatedTimes[activeTaskIndex] = Math.max(0, (updatedTimes[activeTaskIndex] || 0) - elapsedSinceLastUpdate);
          localStorage.setItem('taskTimes', JSON.stringify(updatedTimes));
          return updatedTimes;
        });
        lastUpdateTimeRef.current = now;
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, activeTaskIndex]);

  const toggleTimer = (taskIndex: string, initialTime: number) => {
    if (activeTaskIndex === taskIndex && isRunning) {
      handlePause();
    } else {
      handleStart(taskIndex, initialTime);
    }
  };

  const handleStart = (taskIndex: string, initialTime: number) => {
    const now = Date.now();
    setIsRunning(true);
    setActiveTaskIndex(taskIndex);
    startTimeRef.current = now;
    lastUpdateTimeRef.current = now;

    setTaskTimes(prevTimes => {
      const updatedTimes = {
        ...prevTimes,
        [taskIndex]: prevTimes[taskIndex] || initialTime // Use o tempo restante se existir, senão use initialTime
      };
      localStorage.setItem('taskTimes', JSON.stringify(updatedTimes));
      return updatedTimes;
    });
  };

  const handlePause = () => {
    const now = Date.now();
    const totalElapsed = startTimeRef.current ? (now - startTimeRef.current) / 1000 : 0;

    if (Math.abs(totalElapsed) < 60) {
      toast.info("O tempo não será enviado pois é menor que um minuto.");
      setIsRunning(false);
      setActiveTaskIndex(null);
      return;
    }

    setIsRunning(false);
    setTimeSpent(totalElapsed);
    setShowCommentModal(true);

    // Limpar localStorage, mantendo apenas o tempo remanescente
    if (activeTaskIndex) {
      const remainingTime = taskTimes[activeTaskIndex];
      setTaskTimes(prevTimes => ({
        ...prevTimes,
        [activeTaskIndex]: remainingTime
      }));
      localStorage.setItem('taskTimes', JSON.stringify({ [activeTaskIndex]: remainingTime }));
    }
  };

  const formatTime = (seconds: number) => {
    const isNegative = seconds < 0;
    const absoluteSeconds = Math.abs(seconds);
    const hours = Math.floor(absoluteSeconds / 3600);
    const minutes = Math.floor((absoluteSeconds % 3600) / 60);
    const remainingSeconds = Math.floor(absoluteSeconds % 60);
    return `${isNegative ? '-' : ''}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const saveComment = async () => {
    if (activeTaskIndex !== null) {
      const issueKey = localStorage.getItem('currentKey')?.replace(/['"]+/g, '');
      const date = `${new Date().toISOString()}+0000`.replace('Z', '')
      if (!issueKey) {
        toast.error("Erro ao salvar o comentário. Tente novamente.");
        return;
      }
      const body = {
        comment,
        started: date,
        timeSpentSeconds: Math.floor(Math.abs(timeSpent)),
      }
      const res = await brynhildrAPI(`/worklogs/${issueKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': UserAuth
        },
        body: JSON.stringify(body)
      })
      if (res.status === HttpStatus.CREATED) {
        toast.success("Tempo enviado com sucesso");
      }
    }
    setActiveTaskIndex(null);
    setComment('');
    setShowCommentModal(false);
    setTimeSpent(0);
  };

  const TimerButton: React.FC<{ issueKey: string; initialTime: number }> = ({ issueKey, initialTime }) => {
    const isActive = activeTaskIndex === issueKey && isRunning;
    const time = isActive ? taskTimes[issueKey] : initialTime;
    const isNegative = time < 0;

    const handleToggle = () => {
      localStorage.setItem('currentKey', JSON.stringify(issueKey));
      toggleTimer(issueKey, initialTime);
    };

    return (
      <button
        className={`mr-auto ${isNegative ? 'text-red-500' : 'text-white'}`}
        onClick={handleToggle}
      >
        {isActive ? (
          <div className="flex items-center">
            <Pause size={18} />
            <span className="ml-2">{formatTime(time)}</span>
          </div>
        ) : (
          <CirclePlay />
        )}
      </button>
    );
  };

  const handleCloseAttempt = () => {
    toast.error("Por favor, envie o tempo antes de fechar.");
  };

  return (
    <WorklogContext.Provider value={{
      activeTaskIndex,
      taskTimes,
      isRunning,
      toggleTimer,
      formatTime,
      TimerButton
    }}>
      {children}
      <Dialog open={showCommentModal} onOpenChange={handleCloseAttempt}>
        <DialogContent
          onPointerDownOutside={avoidDefaultDomBehavior}
          onInteractOutside={avoidDefaultDomBehavior}
          className="max-w-md w-full"
        >
          <DialogHeader>
            <DialogTitle>Adicionar comentário</DialogTitle>
            <DialogDescription>
              Tempo apontado: {formatTime(timeSpent)}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            rows={10}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Adicione seu comentário aqui..."
            className="min-h-[100px]"
          />
          <div className="flex justify-end mt-4">
            <Button onClick={saveComment}>Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </WorklogContext.Provider>
  );
};