"use client";

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';
import {useState, useEffect} from 'react';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import { storeRiskPrediction, auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

const RiskPredictorPage = () => {
  const router = useRouter();

  // Form fields matching Flask backend requirements
  const [timeOfDayHour, setTimeOfDayHour] = useState('12');
  const [dayOfWeek, setDayOfWeek] = useState('Mon');
  const [location, setLocation] = useState('home');
  const [currentActivity, setCurrentActivity] = useState('studying');
  const [productiveSessionDuration, setProductiveSessionDuration] = useState('30');
  const [timeSinceProductiveActivity, setTimeSinceProductiveActivity] = useState('15');
  const [stressLevel, setStressLevel] = useState('3');
  const [fatigueLevel, setFatigueLevel] = useState('3');
  const [notificationsLast30min, setNotificationsLast30min] = useState('5');
  const [phoneUnlocksLastHour, setPhoneUnlocksLastHour] = useState('3');

  // Response state
  const [riskPercentage, setRiskPercentage] = useState<number | null>(null);
  const [recommendation, setRecommendation] = useState<string>('');
  const [alternative, setAlternative] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [showTimer, setShowTimer] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Check if user is authenticated
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
      setAuthError(user ? null : "You must be logged in to save predictions");
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Reset error state
    setError(null);

    // Create inputs object for storing in database
    const inputs = {
      time_of_day_hour: timeOfDayHour,
      day_of_week: dayOfWeek,
      location: location,
      current_activity: currentActivity,
      productive_session_duration_minutes: productiveSessionDuration,
      time_since_productive_activity_minutes: timeSinceProductiveActivity,
      stress_level: stressLevel,
      fatigue_level: fatigueLevel,
      notifications_last_30min: notificationsLast30min,
      phone_unlocks_last_hour: phoneUnlocksLastHour
    };

    try {
      // Create FormData object to match Flask backend expectations
      const formData = new FormData();
      formData.append('time_of_day_hour', timeOfDayHour);
      formData.append('day_of_week', dayOfWeek);
      formData.append('location', location);
      formData.append('current_activity', currentActivity);
      formData.append('productive_session_duration_minutes', productiveSessionDuration);
      formData.append('time_since_productive_activity_minutes', timeSinceProductiveActivity);
      formData.append('stress_level', stressLevel);
      formData.append('fatigue_level', fatigueLevel);
      formData.append('notifications_last_30min', notificationsLast30min);
      formData.append('phone_unlocks_last_hour', phoneUnlocksLastHour);

      // Send data to the Flask API
      // Use environment variable or default to local Flask API URL
      // In a static export, relative URLs like '/api/predict' won't work
      const apiUrl = process.env.NEXT_PUBLIC_FLASK_API_URL || 'http://localhost:5000/predict';
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get prediction from server');
      }

      const data = await response.json();
      setRiskPercentage(data.risk_percentage);
      setRecommendation(data.recommendation);
      setAlternative(data.alternative);
      setShowTimer(true);

      // Store prediction in Firestore if user is authenticated
      if (isAuthenticated) {
        try {
          await storeRiskPrediction({
            riskPercentage: data.risk_percentage,
            recommendation: data.recommendation,
            alternative: data.alternative,
            inputs: inputs
          });
          console.log("Prediction stored successfully");
        } catch (storeError) {
          console.error("Error storing prediction:", storeError);
          setAuthError("Failed to save prediction. Please try again.");
        }
      }
    } catch (error) {
      console.error('Error getting prediction:', error);

      // Set error message
      setError('Could not connect to the prediction server. Using fallback prediction instead.');

      // Fallback to random prediction if API call fails
      const randomRisk = Math.floor(Math.random() * 100);
      setRiskPercentage(randomRisk);

      // Set default recommendations
      setRecommendation("Consider minimizing distractions in your environment");
      setAlternative("Try breaking your task into smaller chunks and take regular breaks to maintain focus");
      setShowTimer(true);

      // Store fallback prediction in Firestore if user is authenticated
      if (isAuthenticated) {
        try {
          await storeRiskPrediction({
            riskPercentage: randomRisk,
            recommendation: "Consider minimizing distractions in your environment",
            alternative: "Try breaking your task into smaller chunks and take regular breaks to maintain focus",
            inputs: inputs
          });
          console.log("Fallback prediction stored successfully");
        } catch (storeError) {
          console.error("Error storing fallback prediction:", storeError);
          setAuthError("Failed to save prediction. Please try again.");
        }
      }
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Focus Flow: Distraction Risk Predictor</h1>

      <Card>
        <CardHeader>
          <CardTitle>Predict Your Distraction Risk</CardTitle>
          <CardDescription>
            Enter your current context to see your distraction risk level and
            get personalized recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="timeOfDayHour" className="text-orange-400">Current Hour (0-23)</Label>
                <Input
                  type="number"
                  id="timeOfDayHour"
                  value={timeOfDayHour}
                  onChange={e => setTimeOfDayHour(e.target.value)}
                  min="0"
                  max="23"
                  required
                  className="bg-white text-black border-orange-500/30 focus:border-orange-500"
                />
              </div>
              <div>
                <Label htmlFor="dayOfWeek" className="text-orange-400">Day of Week</Label>
                <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                  <SelectTrigger className="bg-white text-black border-orange-500/30 focus:border-orange-500">
                    <SelectValue placeholder="Select day" className="text-black" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-black">
                    <SelectItem value="Mon" className="text-black">Monday</SelectItem>
                    <SelectItem value="Tue" className="text-black">Tuesday</SelectItem>
                    <SelectItem value="Wed" className="text-black">Wednesday</SelectItem>
                    <SelectItem value="Thu" className="text-black">Thursday</SelectItem>
                    <SelectItem value="Fri" className="text-black">Friday</SelectItem>
                    <SelectItem value="Sat" className="text-black">Saturday</SelectItem>
                    <SelectItem value="Sun" className="text-black">Sunday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location" className="text-orange-400">Current Location</Label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="bg-white text-black border-orange-500/30 focus:border-orange-500">
                    <SelectValue placeholder="Select location" className="text-black" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-black">
                    <SelectItem value="home" className="text-black">Home</SelectItem>
                    <SelectItem value="school" className="text-black">School</SelectItem>
                    <SelectItem value="library" className="text-black">Library</SelectItem>
                    <SelectItem value="coffee_shop" className="text-black">Coffee Shop</SelectItem>
                    <SelectItem value="other" className="text-black">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="currentActivity" className="text-orange-400">Current Activity</Label>
                <Select value={currentActivity} onValueChange={setCurrentActivity}>
                  <SelectTrigger className="bg-white text-black border-orange-500/30 focus:border-orange-500">
                    <SelectValue placeholder="Select activity" className="text-black" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-black">
                    <SelectItem value="studying" className="text-black">Studying</SelectItem>
                    <SelectItem value="break" className="text-black">Taking a Break</SelectItem>
                    <SelectItem value="lecture" className="text-black">In a Lecture</SelectItem>
                    <SelectItem value="relaxing" className="text-black">Relaxing</SelectItem>
                    <SelectItem value="exercise" className="text-black">Exercise</SelectItem>
                    <SelectItem value="meal" className="text-black">Having a Meal</SelectItem>
                    <SelectItem value="other" className="text-black">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="productiveSessionDuration" className="text-orange-400">Productive Session Duration (minutes)</Label>
                <Input
                  type="number"
                  id="productiveSessionDuration"
                  value={productiveSessionDuration}
                  onChange={e => setProductiveSessionDuration(e.target.value)}
                  min="0"
                  required
                  className="bg-white text-black border-orange-500/30 focus:border-orange-500"
                />
              </div>
              <div>
                <Label htmlFor="timeSinceProductiveActivity" className="text-orange-400">Time Since Productive Activity (minutes)</Label>
                <Input
                  type="number"
                  id="timeSinceProductiveActivity"
                  value={timeSinceProductiveActivity}
                  onChange={e => setTimeSinceProductiveActivity(e.target.value)}
                  min="0"
                  required
                  className="bg-white text-black border-orange-500/30 focus:border-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stressLevel" className="text-orange-400">Stress Level (1-5)</Label>
                <Input
                  type="range"
                  id="stressLevel"
                  value={stressLevel}
                  onChange={e => setStressLevel(e.target.value)}
                  min="1"
                  max="5"
                  className="w-full bg-white text-black border-orange-500/30 focus:border-orange-500"
                />
                <div className="flex justify-between text-xs mt-1 text-black">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>
              <div>
                <Label htmlFor="fatigueLevel" className="text-orange-400">Fatigue Level (1-5)</Label>
                <Input
                  type="range"
                  id="fatigueLevel"
                  value={fatigueLevel}
                  onChange={e => setFatigueLevel(e.target.value)}
                  min="1"
                  max="5"
                  className="w-full bg-white text-black border-orange-500/30 focus:border-orange-500"
                />
                <div className="flex justify-between text-xs mt-1 text-black">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="notificationsLast30min" className="text-orange-400">Notifications (Last 30 min)</Label>
                <Input
                  type="number"
                  id="notificationsLast30min"
                  value={notificationsLast30min}
                  onChange={e => setNotificationsLast30min(e.target.value)}
                  min="0"
                  required
                  className="bg-white text-black border-orange-500/30 focus:border-orange-500"
                />
              </div>
              <div>
                <Label htmlFor="phoneUnlocksLastHour" className="text-orange-400">Phone Unlocks (Last Hour)</Label>
                <Input
                  type="number"
                  id="phoneUnlocksLastHour"
                  value={phoneUnlocksLastHour}
                  onChange={e => setPhoneUnlocksLastHour(e.target.value)}
                  min="0"
                  required
                  className="bg-white text-black border-orange-500/30 focus:border-orange-500"
                />
              </div>
            </div>

            <Button type="submit" className="w-full gradient-button">Predict Distraction Risk</Button>

            {error && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                {error}
              </div>
            )}

            {authError && !error && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-600 text-sm">
                {authError} <button className="underline" onClick={() => router.push('/login')}>Login</button>
              </div>
            )}
          </form>

          {riskPercentage !== null && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-black">
              <h2 className="text-xl font-semibold text-black">Your Distraction Risk</h2>

              <div className="w-full h-8 bg-gray-200 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
                  style={{ width: `${riskPercentage}%` }}
                ></div>
              </div>
              <p className="font-bold text-lg mt-1 text-black">{riskPercentage}% Risk</p>

              <div className="mt-4">
                <h3 className="text-lg font-semibold text-black">Recommendation:</h3>
                <p className="mt-1 text-black">{recommendation}</p>
                <p className="mt-2 text-black">{alternative}</p>
              </div>

              {showTimer && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-black">Focus Timer</h3>
                  <p className="text-black">Based on your current risk level, we recommend:</p>
                  <div className="flex flex-col sm:flex-row gap-2 mt-2">
                    <Button className="bg-green-600 hover:bg-green-700 text-white">Start Focus Session (25 min)</Button>
                    <Button className="bg-amber-500 hover:bg-amber-600 text-white">Take Break (5 min)</Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskPredictorPage;
