"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Type definitions for our goals
interface SubTask {
  id: string;
  text: string;
  completed: boolean;
}

interface Goal {
  id: string;
  title: string;
  subTasks: SubTask[];
  createdAt: number;
}

interface GoalsByHorizon {
  today: Goal[];
  thirtyDay: Goal[];
  ninetyDay: Goal[];
  oneYear: Goal[];
}

const GoalsPage = () => {
  const { toast } = useToast();
  const [goals, setGoals] = useState<GoalsByHorizon>({
    today: [],
    thirtyDay: [],
    ninetyDay: [],
    oneYear: [],
  });
  const [newGoalTitle, setNewGoalTitle] = useState<{ [key: string]: string }>({
    today: '',
    thirtyDay: '',
    ninetyDay: '',
    oneYear: '',
  });
  const [newSubTaskText, setNewSubTaskText] = useState<{ [key: string]: string }>({});
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load goals from localStorage on component mount
  useEffect(() => {
    const savedGoals = localStorage.getItem('brainhack-goals');
    if (savedGoals) {
      try {
        setGoals(JSON.parse(savedGoals));
      } catch (error) {
        console.error('Failed to parse saved goals:', error);
      }
    }

    // Set up reminder notifications
    const checkMilestones = () => {
      const now = new Date();

      // Check 30-day goals
      goals.thirtyDay.forEach(goal => {
        const daysSinceCreation = Math.floor((now.getTime() - goal.createdAt) / (1000 * 60 * 60 * 24));
        if (daysSinceCreation === 15) { // Halfway through
          toast({
            title: "Milestone Reminder",
            description: `You're halfway through your 30-day goal: "${goal.title}"`,
          });
        }
      });

      // Check 90-day goals
      goals.ninetyDay.forEach(goal => {
        const daysSinceCreation = Math.floor((now.getTime() - goal.createdAt) / (1000 * 60 * 60 * 24));
        if (daysSinceCreation === 45) { // Halfway through
          toast({
            title: "Milestone Reminder",
            description: `You're halfway through your 90-day goal: "${goal.title}"`,
          });
        }
      });

      // Check 1-year goals
      goals.oneYear.forEach(goal => {
        const daysSinceCreation = Math.floor((now.getTime() - goal.createdAt) / (1000 * 60 * 60 * 24));
        if (daysSinceCreation === 182) { // Halfway through (approximately)
          toast({
            title: "Milestone Reminder",
            description: `You're halfway through your 1-year goal: "${goal.title}"`,
          });
        }
      });
    };

    // Check for milestones once a day
    const dailyCheck = setInterval(checkMilestones, 24 * 60 * 60 * 1000);
    // Also check on component mount
    checkMilestones();

    return () => clearInterval(dailyCheck);
  }, [toast]);

  // Save goals to localStorage whenever they change (with debounce)
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      localStorage.setItem('brainhack-goals', JSON.stringify(goals));
      setLastSaved(new Date());
    }, 500); // 500ms debounce

    return () => clearTimeout(saveTimeout);
  }, [goals]);

  // Add a new goal to the specified horizon
  const addGoal = (horizon: keyof GoalsByHorizon) => {
    if (!newGoalTitle[horizon].trim()) return;

    const newGoal: Goal = {
      id: Date.now().toString(),
      title: newGoalTitle[horizon],
      subTasks: [],
      createdAt: Date.now(),
    };

    setGoals(prev => ({
      ...prev,
      [horizon]: [...prev[horizon], newGoal],
    }));

    setNewGoalTitle(prev => ({
      ...prev,
      [horizon]: '',
    }));
  };

  // Add a new sub-task to a goal
  const addSubTask = (horizon: keyof GoalsByHorizon, goalId: string) => {
    const key = `${horizon}-${goalId}`;
    if (!newSubTaskText[key] || !newSubTaskText[key].trim()) return;

    const newSubTask: SubTask = {
      id: Date.now().toString(),
      text: newSubTaskText[key],
      completed: false,
    };

    setGoals(prev => ({
      ...prev,
      [horizon]: prev[horizon].map(goal => 
        goal.id === goalId 
          ? { ...goal, subTasks: [...goal.subTasks, newSubTask] }
          : goal
      ),
    }));

    setNewSubTaskText(prev => ({
      ...prev,
      [key]: '',
    }));
  };

  // Toggle sub-task completion
  const toggleSubTask = (horizon: keyof GoalsByHorizon, goalId: string, subTaskId: string) => {
    setGoals(prev => ({
      ...prev,
      [horizon]: prev[horizon].map(goal => 
        goal.id === goalId 
          ? { 
              ...goal, 
              subTasks: goal.subTasks.map(subTask => 
                subTask.id === subTaskId 
                  ? { ...subTask, completed: !subTask.completed }
                  : subTask
              )
            }
          : goal
      ),
    }));
  };

  // Delete a goal
  const deleteGoal = (horizon: keyof GoalsByHorizon, goalId: string) => {
    setGoals(prev => ({
      ...prev,
      [horizon]: prev[horizon].filter(goal => goal.id !== goalId),
    }));
  };

  // Calculate progress percentage for a goal
  const calculateProgress = (goal: Goal): number => {
    if (goal.subTasks.length === 0) return 0;
    const completedTasks = goal.subTasks.filter(task => task.completed).length;
    return Math.round((completedTasks / goal.subTasks.length) * 100);
  };

  // Render a circular progress indicator
  const CircularProgress = ({ percentage }: { percentage: number }) => {
    const circumference = 2 * Math.PI * 18; // r = 18
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg className="w-12 h-12">
          <circle
            className="text-gray-200"
            strokeWidth="4"
            stroke="currentColor"
            fill="transparent"
            r="18"
            cx="24"
            cy="24"
          />
          <circle
            className="text-blue-600"
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="18"
            cx="24"
            cy="24"
          />
        </svg>
        <span className="absolute text-xs font-semibold">{percentage}%</span>
      </div>
    );
  };

  // Render a goal horizon section
  const renderGoalHorizon = (title: string, horizon: keyof GoalsByHorizon) => (
    <Accordion type="single" collapsible className="w-full mb-4">
      <AccordionItem value={horizon}>
        <AccordionTrigger className="text-xl font-semibold">{title}</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            {goals[horizon].map(goal => (
              <Card key={goal.id} className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center space-x-4">
                    <CircularProgress percentage={calculateProgress(goal)} />
                    <CardTitle className="text-lg">{goal.title}</CardTitle>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => deleteGoal(horizon, goal.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {goal.subTasks.map(subTask => (
                      <div key={subTask.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={subTask.id} 
                          checked={subTask.completed}
                          onCheckedChange={() => toggleSubTask(horizon, goal.id, subTask.id)}
                        />
                        <label 
                          htmlFor={subTask.id}
                          className={`text-sm ${subTask.completed ? 'line-through text-gray-500' : ''}`}
                        >
                          {subTask.text}
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center mt-4">
                    <input
                      type="text"
                      placeholder="Add a sub-task..."
                      className="flex-1 p-2 text-sm border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newSubTaskText[`${horizon}-${goal.id}`] || ''}
                      onChange={(e) => setNewSubTaskText(prev => ({
                        ...prev,
                        [`${horizon}-${goal.id}`]: e.target.value,
                      }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          addSubTask(horizon, goal.id);
                        }
                      }}
                    />
                    <Button 
                      className="rounded-l-none" 
                      onClick={() => addSubTask(horizon, goal.id)}
                    >
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex items-center">
              <input
                type="text"
                placeholder={`Add a new ${title.toLowerCase()} goal...`}
                className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newGoalTitle[horizon]}
                onChange={(e) => setNewGoalTitle(prev => ({
                  ...prev,
                  [horizon]: e.target.value,
                }))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addGoal(horizon);
                  }
                }}
              />
              <Button 
                className="rounded-l-none flex items-center" 
                onClick={() => addGoal(horizon)}
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Add Goal
              </Button>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Goals</h1>
        {lastSaved && (
          <p className="text-sm text-gray-500">
            Last saved: {lastSaved.toLocaleTimeString()}
          </p>
        )}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Goal Management System</CardTitle>
          <CardDescription>
            Create, track, and manage your goals to stay focused and motivated.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Set goals across different time horizons, break them down into manageable sub-tasks, 
            and track your progress. Your goals are automatically saved as you make changes.
          </p>
        </CardContent>
      </Card>

      {renderGoalHorizon('Today', 'today')}
      {renderGoalHorizon('30-Day', 'thirtyDay')}
      {renderGoalHorizon('90-Day', 'ninetyDay')}
      {renderGoalHorizon('1-Year', 'oneYear')}
    </div>
  );
};

export default GoalsPage;
