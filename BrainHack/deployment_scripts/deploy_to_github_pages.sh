#!/bin/bash
# Script to deploy the BrainHack frontend to GitHub Pages

echo "Preparing to deploy BrainHack frontend to GitHub Pages..."

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "Git is not installed. Please install it first."
    exit 1
fi

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo "Not in a git repository. Please run this script from the root of your git repository."
    exit 1
fi

# Create a public directory for GitHub Pages
if [ ! -d "public" ]; then
    echo "Creating public directory for GitHub Pages..."
    mkdir -p public
fi

# Copy the frontend files to the public directory
echo "Copying frontend files to public directory..."
cp -r templates/* public/

# Modify the API endpoint in the frontend code
echo "Updating API endpoint in the frontend code..."
read -p "Enter your backend API URL (e.g., https://your-app.herokuapp.com): " api_url

# Replace the API endpoint in the JavaScript code
if [ -f "public/index.html" ]; then
    # For macOS, use different sed syntax
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|url: '/predict'|url: '$api_url/predict'|g" public/index.html
    else
        sed -i "s|url: '/predict'|url: '$api_url/predict'|g" public/index.html
    fi
    echo "API endpoint updated in public/index.html"
else
    echo "Warning: Could not find public/index.html to update API endpoint."
fi

# Create a Firebase configuration file
echo "Creating Firebase configuration file..."
cat > public/firebase-config.js << EOF
// Your Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
EOF

echo "Firebase configuration file created. Please update with your actual Firebase config."

# Check if gh-pages branch exists
if git show-ref --verify --quiet refs/heads/gh-pages; then
    echo "gh-pages branch already exists."
    read -p "Do you want to update the existing gh-pages branch? (y/n): " update_branch
    if [ "$update_branch" != "y" ]; then
        echo "Deployment cancelled."
        exit 0
    fi
else
    echo "Creating gh-pages branch..."
    git checkout --orphan gh-pages
    git reset --hard
    git commit --allow-empty -m "Initial gh-pages commit"
    git checkout main
    echo "gh-pages branch created."
fi

# Deploy to GitHub Pages
echo "Deploying to GitHub Pages..."
current_branch=$(git rev-parse --abbrev-ref HEAD)

# Stash any changes in the current branch
git stash

# Switch to gh-pages branch
git checkout gh-pages

# Remove existing files (except .git and public)
find . -maxdepth 1 ! -name .git ! -name public ! -name . -exec rm -rf {} \;

# Copy files from public to root
cp -r public/* .

# Add all files
git add .

# Commit changes
git commit -m "Update GitHub Pages"

# Push to GitHub
git push origin gh-pages

# Switch back to original branch
git checkout "$current_branch"

# Apply stashed changes if any
git stash pop 2>/dev/null || true

echo "Deployment complete!"
echo "Your BrainHack frontend is now deployed to GitHub Pages!"
echo "It will be available at: https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/"
echo "Note: It may take a few minutes for the changes to propagate."
echo "Remember to update the Firebase configuration in firebase-config.js with your actual Firebase project details."