"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', focus: 65 },
  { name: 'Tue', focus: 75 },
  { name: 'Wed', focus: 85 },
  { name: 'Thu', focus: 70 },
  { name: 'Fri', focus: 80 },
  { name: 'Sat', focus: 90 },
  { name: 'Sun', focus: 95 },
];

export default function Dashboard() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold gradient-text">Dashboard</h1>
        <Button className="gradient-button">Start Focus Session</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-black/80 backdrop-blur-md border-orange-500/20">
          <h3 className="text-lg font-semibold text-orange-400">Focus Score</h3>
          <p className="text-3xl font-bold text-white mt-2">85%</p>
          <Progress value={85} className="mt-2" />
        </Card>

        <Card className="p-6 bg-black/80 backdrop-blur-md border-orange-500/20">
          <h3 className="text-lg font-semibold text-orange-400">Tasks Completed</h3>
          <p className="text-3xl font-bold text-white mt-2">12/15</p>
          <Progress value={80} className="mt-2" />
        </Card>

        <Card className="p-6 bg-black/80 backdrop-blur-md border-orange-500/20">
          <h3 className="text-lg font-semibold text-orange-400">Focus Time</h3>
          <p className="text-3xl font-bold text-white mt-2">4h 30m</p>
          <Progress value={75} className="mt-2" />
        </Card>

        <Card className="p-6 bg-black/80 backdrop-blur-md border-orange-500/20">
          <h3 className="text-lg font-semibold text-orange-400">Productivity</h3>
          <p className="text-3xl font-bold text-white mt-2">78%</p>
          <Progress value={78} className="mt-2" />
        </Card>
      </div>

      <Card className="p-6 bg-black/80 backdrop-blur-md border-orange-500/20">
        <h2 className="text-2xl font-bold text-orange-400 mb-4">Weekly Focus Trend</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: '1px solid rgba(255,165,0,0.2)',
                  color: '#fff' 
                }}
              />
              <Line 
                type="monotone" 
                dataKey="focus" 
                stroke="#f97316" 
                strokeWidth={2}
                dot={{ fill: '#f97316' }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-black/80 backdrop-blur-md border-orange-500/20">
          <h2 className="text-2xl font-bold text-orange-400 mb-4">Recent Tasks</h2>
          <div className="space-y-4">
            {['Complete project proposal', 'Review team updates', 'Client meeting prep'].map((task, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-black/60 border border-orange-500/10">
                <span className="text-gray-100">{task}</span>
                <Button variant="outline" className="border-orange-500 text-orange-400 hover:bg-orange-500/10">
                  View
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-black/80 backdrop-blur-md border-orange-500/20">
          <h2 className="text-2xl font-bold text-orange-400 mb-4">Focus Tips</h2>
          <div className="space-y-4">
            {[
              'Take regular breaks using the Pomodoro technique',
              'Stay hydrated and maintain good posture',
              'Use noise-canceling headphones for better concentration'
            ].map((tip, i) => (
              <div key={i} className="p-3 rounded-lg bg-black/60 border border-orange-500/10">
                <p className="text-gray-100">{tip}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
