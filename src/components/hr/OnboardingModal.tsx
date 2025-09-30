import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Circle, UserPlus, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
export interface OnboardingTask {
  id: string;
  text: string;
  completed: boolean;
}
export interface OnboardingData {
  employee_name: string;
  start_date: string;
  checklist: OnboardingTask[];
}
interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: OnboardingData | null;
}
export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, data }) => {
  const [tasks, setTasks] = useState<OnboardingTask[]>([]);
  useEffect(() => {
    if (data) {
      setTasks(data.checklist);
    }
  }, [data]);
  const progress = useMemo(() => {
    if (tasks.length === 0) return 0;
    const completedCount = tasks.filter(task => task.completed).length;
    return (completedCount / tasks.length) * 100;
  }, [tasks]);
  const handleTaskToggle = (taskId: string) => {
    setTasks(currentTasks =>
      currentTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };
  if (!data) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl p-0">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DialogHeader className="p-6 pb-4">
                <DialogTitle className="text-2xl font-bold font-display">New Hire Onboarding</DialogTitle>
                <DialogDescription className="flex items-center gap-6 text-base">
                  <span className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-muted-foreground" />
                    {data.employee_name}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    Start Date: {data.start_date}
                  </span>
                </DialogDescription>
              </DialogHeader>
              <div className="px-6 pb-6">
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-muted-foreground">Progress</span>
                    <span className="text-sm font-bold text-primary">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                  {tasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex items-center p-3 rounded-md border bg-secondary/30 hover:bg-secondary/70 transition-colors"
                    >
                      <Checkbox
                        id={task.id}
                        checked={task.completed}
                        onCheckedChange={() => handleTaskToggle(task.id)}
                        className="mr-3"
                      />
                      <label
                        htmlFor={task.id}
                        className={cn(
                          "flex-1 text-sm cursor-pointer",
                          task.completed && "line-through text-muted-foreground"
                        )}
                      >
                        {task.text}
                      </label>
                      <div className="ml-3">
                        {task.completed ? (
                          <Check className="w-5 h-5 text-green-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground/50" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                  <Button onClick={onClose}>Close</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};