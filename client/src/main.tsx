import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ClerkProvider } from '@clerk/clerk-react';

// 🚀 FIXED: Enforce absolute flat relative path compilation for your stylesheet
import './styles.css';

// Safety gate protection for Clerk production publishable keys context
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  console.warn("⚠️ [Matrix Initialization] VITE_CLERK_PUBLISHABLE_KEY is missing from environment context.");
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);