
"use server";

import { cookies } from "next/headers";

type SessionPrepData = {
  sessionGoals: string[];
  sessionDuration: number;
  sessionNotes: string;
  plannedExercises: string[];
};

export async function saveSessionPrepData(data: SessionPrepData) {
  // In a real application, this would save to a database
  // For this demo, we'll use cookies since they're server-accessible
  
  const cookieStore = cookies();
  
  // Store data as a JSON string in a cookie
  // Note: In a production app, you'd want to use a proper database
  cookieStore.set({
    name: "session-prep-data",
    value: JSON.stringify(data),
    path: "/",
    // Short expiry since this is just for the demo flow
    maxAge: 60 * 60, // 1 hour
  });
  
  return { success: true };
}

export async function getSessionPrepData(): Promise<SessionPrepData | null> {
  const cookieStore = cookies();
  const data = cookieStore.get("session-prep-data");
  
  if (!data || !data.value) {
    return null;
  }
  
  try {
    return JSON.parse(data.value) as SessionPrepData;
  } catch (error) {
    console.error("Failed to parse session data:", error);
    return null;
  }
}

export async function clearSessionPrepData() {
  const cookieStore = cookies();
  cookieStore.delete("session-prep-data");
  return { success: true };
}
