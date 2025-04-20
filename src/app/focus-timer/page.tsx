"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';
import { Maximize, Minimize, Clock, BarChart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Create a worker code as a blob URL
const createWorkerBlobURL = () => {
  const workerCode = `
    let interval;

    self.onmessage = function(e) {
      if (e.data.type === 'start') {
        clearInterval(interval);
        let totalSeconds = e.data.totalSeconds;

        interval = setInterval(() => {
          totalSeconds--;
          self.postMessage({ totalSeconds, type: 'tick' });

          if (totalSeconds <= 0) {
            clearInterval(interval);
            self.postMessage({ type: 'complete' });
          }
        }, 1000);
      } else if (e.data.type === 'pause') {
        clearInterval(interval);
      } else if (e.data.type === 'reset') {
        clearInterval(interval);
      }
    };
  `;

  return URL.createObjectURL(new Blob([workerCode], { type: 'application/javascript' }));
};

const FocusTimerPage = () => {
  const { toast } = useToast();
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('');
  const [sessionStats, setSessionStats] = useState<{
    completed: boolean;
    duration: number;
    breaks: number;
  } | null>(null);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const [breaksTaken, setBreaksTaken] = useState(0);

  const workerRef = useRef<Worker | null>(null);
  const timerContainerRef = useRef<HTMLDivElement>(null);
  const sessionStartTimeRef = useRef<number | null>(null);

  // Initialize the web worker
  useEffect(() => {
    const workerBlobURL = createWorkerBlobURL();
    workerRef.current = new Worker(workerBlobURL);

    workerRef.current.onmessage = (e) => {
      if (e.data.type === 'tick') {
        const totalSeconds = e.data.totalSeconds;
        setMinutes(Math.floor(totalSeconds / 60));
        setSeconds(totalSeconds % 60);
      } else if (e.data.type === 'complete') {
        setIsActive(false);

        // Calculate session duration
        const sessionDuration = sessionStartTimeRef.current 
          ? Math.round((Date.now() - sessionStartTimeRef.current) / 60000) 
          : 0;

        setSessionStats({
          completed: true,
          duration: sessionDuration,
          breaks: breaksTaken
        });

        setTotalFocusTime(prev => prev + sessionDuration);

        // Show completion toast
        toast({
          title: "Focus Session Complete!",
          description: `You've completed a ${sessionDuration} minute focus session.`,
        });
      }
    };

    // Clean up
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
      URL.revokeObjectURL(workerBlobURL);
    };
  }, [toast, breaksTaken]);

  // Handle fullscreen mode
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      timerContainerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const startTimer = () => {
    const totalSeconds = minutes * 60 + seconds;

    if (totalSeconds <= 0) return;

    setIsActive(true);
    setSessionStats(null);

    if (!sessionStartTimeRef.current) {
      sessionStartTimeRef.current = Date.now();
    }

    workerRef.current?.postMessage({
      type: 'start',
      totalSeconds
    });
  };

  const pauseTimer = () => {
    setIsActive(false);
    workerRef.current?.postMessage({ type: 'pause' });
  };

  const resetTimer = () => {
    setIsActive(false);
    setSessionStats(null);
    sessionStartTimeRef.current = null;
    workerRef.current?.postMessage({ type: 'reset' });
  };

  const setPresetTime = (mins: number) => {
    if (isActive) {
      pauseTimer();
    }
    setMinutes(mins);
    setSeconds(0);
    setCustomMinutes('');
  };

  const handleCustomMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setCustomMinutes(value);
    }
  };

  const applyCustomMinutes = () => {
    const mins = parseInt(customMinutes, 10);
    if (!isNaN(mins) && mins > 0 && mins <= 180) {
      setPresetTime(mins);
    } else {
      toast({
        title: "Invalid Time",
        description: "Please enter a valid time between 1 and 180 minutes.",
        variant: "destructive"
      });
    }
  };

  const takeBreak = (duration: number) => {
    setBreaksTaken(prev => prev + 1);
    setPresetTime(duration);
    toast({
      title: "Break Started",
      description: `Taking a ${duration} minute break. Relax and recharge!`,
    });
    startTimer();
  };

  return (
    <div 
      ref={timerContainerRef} 
      className={`container mx-auto py-10 px-4 transition-all duration-300 ${
        isFullscreen ? 'bg-gray-900 text-white min-h-screen flex items-center justify-center' : ''
      }`}
    >
      <div className={`${isFullscreen ? 'max-w-2xl w-full' : ''}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Focus Timer</h1>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
        </div>

        {!sessionStats ? (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Intelligent Focus Timer</CardTitle>
                <CardDescription>
                  Stay focused with intelligent work/break intervals.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="text-7xl font-bold mb-8">
                  {minutes < 10 ? `0${minutes}` : minutes}:
                  {seconds < 10 ? `0${seconds}` : seconds}
                </div>

                <div className="grid grid-cols-4 gap-2 w-full max-w-md mb-6">
                  <Button 
                    variant={minutes === 25 && seconds === 0 ? "default" : "outline"} 
                    onClick={() => setPresetTime(25)}
                    className="col-span-1"
                  >
                    25m
                  </Button>
                  <Button 
                    variant={minutes === 50 && seconds === 0 ? "default" : "outline"} 
                    onClick={() => setPresetTime(50)}
                    className="col-span-1"
                  >
                    50m
                  </Button>
                  <Button 
                    variant={minutes === 90 && seconds === 0 ? "default" : "outline"} 
                    onClick={() => setPresetTime(90)}
                    className="col-span-1"
                  >
                    90m
                  </Button>
                  <div className="col-span-1 flex">
                    <input
                      type="text"
                      placeholder="Custom"
                      value={customMinutes}
                      onChange={handleCustomMinutesChange}
                      className="w-full p-2 text-sm border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          applyCustomMinutes();
                        }
                      }}
                    />
                    <Button 
                      className="rounded-l-none px-2" 
                      onClick={applyCustomMinutes}
                    >
                      Set
                    </Button>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    size="lg"
                    onClick={isActive ? pauseTimer : startTimer}
                    className="w-32"
                  >
                    {isActive ? 'Pause' : 'Start'}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={resetTimer}
                    className="w-32"
                  >
                    Reset
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className="text-sm text-gray-500 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Total focus time today: {totalFocusTime} minutes
                </p>
              </CardFooter>
            </Card>
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Session Complete!</CardTitle>
              <CardDescription>
                Great job on completing your focus session.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-md">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-blue-500" />
                    <span>Focus Time</span>
                  </div>
                  <span className="font-semibold">{sessionStats.duration} minutes</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-md">
                  <div className="flex items-center">
                    <BarChart className="h-5 w-5 mr-2 text-green-500" />
                    <span>Breaks Taken</span>
                  </div>
                  <span className="font-semibold">{sessionStats.breaks}</span>
                </div>

                <div className="mt-6">
                  <h3 className="font-medium mb-2">Take a break before your next session:</h3>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => takeBreak(5)}>
                      5 min break
                    </Button>
                    <Button variant="outline" onClick={() => takeBreak(10)}>
                      10 min break
                    </Button>
                    <Button variant="outline" onClick={() => takeBreak(15)}>
                      15 min break
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => {
                setSessionStats(null);
                setPresetTime(25);
              }}>
                Start New Session
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FocusTimerPage;
