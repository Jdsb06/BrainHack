const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

// *** Replace with your actual Gemini API key ***
const GEMINI_API_KEY = 'AIzaSyBgkUMZ-uXSuVBQd2EaP1h8yW3wVmeFpkI';

app.use(cors());
app.use(bodyParser.json());

// In-memory store of user schedules
const schedules = {};

/**
 * 1) Chat proxy → Gemini API
 */
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    // messages is an array of { role: 'system'|'user', content: '…' }

    // Separate system messages and conversation messages
    const systemMessages = messages.filter(m => m.role === 'system');
    const conversationMessages = messages.filter(m => m.role !== 'system');

    // Combine system messages into a single string for systemInstruction
    const systemInstruction = systemMessages.map(m => m.content).join('\n');

    // Map conversation messages to Gemini's format
    const contents = conversationMessages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    // Make the API call to Gemini
    const gmRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        contents: contents
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Extract the reply from the response
    const reply = gmRes.data.candidates[0].content.parts[0].text;
    res.json({ reply });
  } catch (e) {
    console.error('❌ /api/chat error:', e.response?.data || e.message);
    res.status(500).json({ error: 'Error calling Gemini API' });
  }
});

/**
 * 2) Get a user's schedule (today + future days)
 */
app.get('/api/schedule/:userId', (req, res) => {
  const { userId } = req.params;
  res.json({ schedule: schedules[userId] || [] });
});

/**
 * 3) Add an urgent task to today’s schedule
 */
app.post('/api/urgent_task', (req, res) => {
  const { userId, task, estimatedTime } = req.body;
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  if (!schedules[userId]) schedules[userId] = [];
  let day = schedules[userId].find(d => d.date === today);
  if (!day) {
    day = { date: today, tasks: [] };
    schedules[userId].push(day);
  }

  day.tasks.push({ task, time: `${estimatedTime} mins` });
  res.json({ newSchedule: schedules[userId] });
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});