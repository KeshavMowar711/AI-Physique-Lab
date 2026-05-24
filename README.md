
Full-stack starter for an AI-powered physique progress tracker.

## Stack

- Frontend: React + TypeScript + HTML + CSS + Vite
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- AI: OpenAI API for physique feedback, workout suggestions, and diet guidance
 Auth: Google OAuth
- Media storage: Cloudinary signed uploads

## Features

- Weekly physique check-ins with front, side, and back photo URLs
Google sign-in with per-user dashboard data
- Cloudinary image uploads from the frontend with backend-generated signatures
- Progress history and dashboard summary
- AI-generated physique observations
- Lagging muscle detection suggestions
- Workout and diet recommendations
- MongoDB persistence

## Project Structure

- `client`: React frontend
- `server`: Express API, MongoDB models, OpenAI integration

## Environment

Create these files before running locally:

- `server/.env`
- `client/.env`

Use the included `.env.example` files as templates.

## Local Development

```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

Backend runs on `http://localhost:5000`

## Production Deployment

### Frontend

Deploy `client` on Vercel or Netlify.

Set:

- `VITE_API_BASE_URL`
 `VITE_GOOGLE_CLIENT_ID`

### Backend

Deploy `server` on Render, Railway, or Fly.io.

Set:

- `PORT`
- `CLIENT_URL`
- `MONGODB_URI`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
`JWT_SECRET`
- `GOOGLE_CLIENT_ID`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_UPLOAD_FOLDER`

## Notes

This starter does not claim medical accuracy from image analysis. The AI output is framed as general fitness guidance and should be reviewed before production use.

## Auth and Upload Flow

1. User signs in with Google on the React frontend.
2. Frontend sends the Google credential to `POST /api/auth/google`.
3. Backend verifies the token, upserts the user in MongoDB, and returns a JWT.
4. Protected routes use that JWT for dashboard access and check-in creation.
5. Frontend requests a signed Cloudinary upload payload from `GET /api/uploads/signature`.
6. Images upload directly to Cloudinary, then the secure URLs are stored with the check-in.