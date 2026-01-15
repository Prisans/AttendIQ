# Deploying AttendIQ to Vercel

This project is configured to be deployed as a monorepo on Vercel.

## Prerequisites
- A Vercel account.
- A Supabase account (Optional but Highly Recommended for persistence).

## Deployment Steps

1. **Push to GitHub/GitLab/Bitbucket**:
   Ensure this project is pushed to a repository.

2. **Import into Vercel**:
   - Go to your Vercel Dashboard.
   - Click "Add New..." -> "Project".
   - Select your repository.

3. **Configure Project**:
   - **Framework Preset**: Vercel should auto-detect "Other" or "Vite". If it asks, "Vite" for the client is fine, but since we have a custom `vercel.json`, verify the settings.
   - **Root Directory**: Leave as `./` (default).

4. **Environment Variables**:
   To make the application functional (data persistence), you need a real database. The in-memory mock used locally will **NOT** work properly on Vercel (data is lost instantly).
   
   Add these variables in Vercel Settings:
   - `SUPABASE_URL`: Your Supabase Project URL.
   - `SUPABASE_KEY`: Your Supabase Anon Key.

5. **Deploy**:
   Click "Deploy".

## Notes
- The `vercel.json` file handles routing API requests to the backend (`server/`) and serving the frontend (`client/`).
- If you do *not* set Supabase variables, the app will run in "Mock Mode". In Vercel's serverless environment, this means meetings created might disappear immediately or be inaccessible to other users. **It is for demo purposes only.**
