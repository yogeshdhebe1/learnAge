# Backend Setup Instructions

## Step 1: Install Dependencies

```bash
# Make sure you're in the backend folder
cd backend

# Install all required packages
pip install -r requirements.txt
```

## Step 2: Configure Firebase

1. Place your `serviceAccountKey.json` file in the `backend/firebase/` folder
2. Create the firebase folder if it doesn't exist:
   ```bash
   mkdir firebase
   ```

3. Your structure should look like:
   ```
   backend/
   ├── firebase/
   │   └── serviceAccountKey.json  <- Your Firebase key here
   ├── app/
   └── .env
   ```

## Step 3: Update .env File

Open `.env` and add your Gemini API key:

```
FIREBASE_CREDENTIALS_PATH=./firebase/serviceAccountKey.json
GEMINI_API_KEY=your_actual_gemini_api_key_here
FRONTEND_URL=http://localhost:3000
```

## Step 4: Run the Server

```bash
# From the backend folder
uvicorn app.main:app --reload --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

## Step 5: Test the API

Open browser and visit:
- http://localhost:8000 - Should show API info
- http://localhost:8000/docs - Interactive API documentation

## Troubleshooting

### Error: "ModuleNotFoundError"
- Make sure virtual environment is activated
- Run `pip install -r requirements.txt` again

### Error: "Firebase credentials not found"
- Check that `serviceAccountKey.json` is in `backend/firebase/` folder
- Check the path in `.env` file

### Error: "Invalid Gemini API key"
- Verify your API key in `.env` file
- Get a new key from https://aistudio.google.com/app/apikey
