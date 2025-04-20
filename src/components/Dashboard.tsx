import React, { useEffect, useState } from 'react';
import { getDashboardData } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth'; // Assuming you have an auth hook

// Define types for dashboard data
interface DistractionRiskLevel {
  percentage: number;
  interruptedSessions: number;
  totalSessions: number;
}

interface DailyStatistics {
  focusTimeHours: number;
  breaksTaken: number;
}

interface WeeklyStatistics {
  productiveDays: number;
  averageFocusTimeHours: number;
}

interface RiskPrediction {
  timestamp: Date;
  riskPercentage: number;
  recommendation: string;
  alternative: string;
}

interface DashboardData {
  distractionRiskLevel: DistractionRiskLevel;
  dailyStatistics: DailyStatistics;
  weeklyStatistics: WeeklyStatistics;
  productivityScore: number;
  latestRiskPrediction: RiskPrediction | null;
}

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth(); // Get the authenticated user

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) {
        setError('You must be logged in to view the dashboard');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getDashboardData();
        setDashboardData(data as DashboardData);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">No data available.</strong>
        <span className="block sm:inline"> Start a focus session to see your productivity metrics.</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Productivity Dashboard</h1>

      {/* Latest Risk Prediction (if available) */}
      {dashboardData.latestRiskPrediction && (
        <div className="mb-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Latest Risk Prediction</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-center">
                <div className="relative h-40 w-40">
                  <svg className="h-full w-full" viewBox="0 0 100 100">
                    <circle
                      className="text-gray-200 stroke-current"
                      strokeWidth="10"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                    />
                    <circle
                      className="text-red-500 stroke-current"
                      strokeWidth="10"
                      strokeLinecap="round"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      strokeDasharray={`${dashboardData.latestRiskPrediction.riskPercentage * 2.51} 251`}
                      strokeDashoffset="0"
                      transform="rotate(-90 50 50)"
                    />
                    <text
                      x="50"
                      y="50"
                      className="text-3xl font-bold"
                      dominantBaseline="middle"
                      textAnchor="middle"
                    >
                      {dashboardData.latestRiskPrediction.riskPercentage}%
                    </text>
                  </svg>
                </div>
              </div>
              <div className="mt-2 text-center text-sm text-gray-600">
                <p>Predicted on {new Date(dashboardData.latestRiskPrediction.timestamp).toLocaleString()}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Recommendations:</h3>
              <p className="mt-2">{dashboardData.latestRiskPrediction.recommendation}</p>
              <p className="mt-2">{dashboardData.latestRiskPrediction.alternative}</p>
              <div className="mt-4">
                <a href="/risk-predictor" className="text-blue-500 hover:text-blue-700 underline">
                  Get a new prediction
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Distraction Risk Level */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Distraction Risk Level</h2>
          <div className="flex justify-center">
            <div className="relative h-40 w-40">
              <svg className="h-full w-full" viewBox="0 0 100 100">
                <circle
                  className="text-gray-200 stroke-current"
                  strokeWidth="10"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                />
                <circle
                  className="text-red-500 stroke-current"
                  strokeWidth="10"
                  strokeLinecap="round"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  strokeDasharray={`${dashboardData.distractionRiskLevel.percentage * 2.51} 251`}
                  strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                />
                <text
                  x="50"
                  y="50"
                  className="text-3xl font-bold"
                  dominantBaseline="middle"
                  textAnchor="middle"
                >
                  {dashboardData.distractionRiskLevel.percentage}%
                </text>
              </svg>
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>{dashboardData.distractionRiskLevel.interruptedSessions} of {dashboardData.distractionRiskLevel.totalSessions} sessions interrupted in the last 24 hours</p>
          </div>
        </div>

        {/* Daily Statistics */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Daily Statistics</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Focus Time</p>
              <p className="text-2xl font-bold">{dashboardData.dailyStatistics.focusTimeHours} hours</p>
            </div>
            <div>
              <p className="text-gray-600">Breaks Taken</p>
              <p className="text-2xl font-bold">{dashboardData.dailyStatistics.breaksTaken}</p>
            </div>
          </div>
        </div>

        {/* Weekly Statistics */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Weekly Statistics</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Productive Days</p>
              <p className="text-2xl font-bold">{dashboardData.weeklyStatistics.productiveDays} / 7</p>
            </div>
            <div>
              <p className="text-gray-600">Avg. Daily Focus Time</p>
              <p className="text-2xl font-bold">{dashboardData.weeklyStatistics.averageFocusTimeHours} hours</p>
            </div>
          </div>
        </div>

        {/* Productivity Score */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Productivity Score</h2>
          <div className="flex justify-center items-center h-40">
            <div className="text-5xl font-bold text-blue-600">
              {dashboardData.productivityScore}
            </div>
            <div className="text-2xl text-gray-400 ml-1">/100</div>
          </div>
          <p className="mt-4 text-center text-sm text-gray-600">
            Based on your focus time over the last 7 days
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-8 flex justify-center space-x-4">
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Start Focus Session
        </button>
        <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
          Take a Break
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
