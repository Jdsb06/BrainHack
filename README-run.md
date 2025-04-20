# How to Run the Brain Hack Website

This guide provides instructions for setting up and running the Brain Hack website, which consists of multiple components:

1. Next.js frontend
2. Flask backend
3. Bot server
4. Genkit development server

## Prerequisites

Before you begin, make sure you have the following installed:

- Node.js (v14 or later)
- npm (v6 or later)
- Python (v3.8 or later)
- pip (Python package manager)

## Setup Instructions

### 1. Install Node.js Dependencies

First, install the Node.js dependencies for the main application:

```bash
# In the root directory
npm install
```

Then, install the Node.js dependencies for the Bot component:

```bash
# Navigate to the Bot directory
cd Bot
npm install
# Return to the root directory
cd ..
```

### 2. Set Up Python Environment for Flask Backend

Create and activate a Python virtual environment, then install the required dependencies:

```bash
# Navigate to the flask_app directory
cd flask_app

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
# venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Return to the root directory
cd ..
```

## Running the Website

### Option 1: Run All Components Together (Recommended)

The easiest way to run the entire website is to use the `dev:all` script, which starts all components concurrently:

```bash
npm run dev:all
```

This command will start:
- Next.js frontend on port 9002 (http://localhost:9002)
- Flask backend on port 5000 (http://localhost:5000)
- Bot server on port 3001 (http://localhost:3001)
- Genkit development server

### Option 2: Run Components Separately

If you need to run components separately, you can use the following commands:

#### Next.js Frontend

```bash
# In the root directory
npm run dev
```

The frontend will be available at http://localhost:9002.

#### Flask Backend

```bash
# In the flask_app directory
cd flask_app
# Make sure your virtual environment is activated
python app.py
```

The Flask API will be available at http://localhost:5000.

#### Bot Server

```bash
# In the Bot directory
cd Bot
npm start
```

The Bot server will be available at http://localhost:3001.

#### Genkit Development Server

```bash
# In the root directory
npm run genkit:dev
```

## Troubleshooting

### Port Conflicts

If you encounter port conflicts, you may need to modify the port numbers in the following files:

- For the Next.js frontend: `package.json` (change the port in the `dev` script)
- For the Flask backend: `flask_app/app.py` (change the port in the `app.run()` call)
- For the Bot server: `Bot/server.js` (change the `PORT` constant)

### Dependencies Issues

If you encounter issues with dependencies:

1. Make sure all Node.js dependencies are installed correctly:
   ```bash
   npm install
   cd Bot && npm install && cd ..
   ```

2. Make sure all Python dependencies are installed correctly:
   ```bash
   cd flask_app
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

### API Connection Issues

If the frontend cannot connect to the Flask API or Bot server:

1. Make sure all servers are running
2. Check that the ports match what the frontend is expecting
3. Check for any CORS issues in the browser console

## Additional Information

For more detailed information about specific components:

- Flask Backend: See `flask_app/README.md` and `INTEGRATION_README.md`
- Firebase Setup: See `README.md`
- Firebase Functions: See `README-functions.md`