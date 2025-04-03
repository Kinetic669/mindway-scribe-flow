
import { Client, Note, NoteType, Session, Tool, SessionAttendance } from "../types";

export const noteTypes: NoteType[] = [
  {
    id: "1",
    name: "Client Quote",
    color: "#4c6fff",
    icon: "quote",
    visible: true,
  },
  {
    id: "2",
    name: "Therapist Insight",
    color: "#10b981",
    icon: "lightbulb",
    visible: true,
  },
  {
    id: "3",
    name: "Observation",
    color: "#6366f1",
    icon: "eye",
    visible: true,
  },
  {
    id: "4",
    name: "Action Item",
    color: "#f43f5e",
    icon: "check-square",
    visible: true,
  },
  {
    id: "5",
    name: "Reflection",
    color: "#fbbf24",
    icon: "brain",
    visible: true,
  },
];

export const mockNotes: Note[] = [
  {
    id: "1",
    content: "I've been feeling overwhelmed with work lately, can't seem to focus on anything else.",
    type: noteTypes[0],
    timestamp: new Date(Date.now() - 1000 * 60 * 20),
    createdAt: new Date(Date.now() - 1000 * 60 * 20),
    updatedAt: new Date(Date.now() - 1000 * 60 * 20),
  },
  {
    id: "2",
    content: "Client shows signs of work-related anxiety. Explore coping mechanisms in next session.",
    type: noteTypes[1],
    timestamp: new Date(Date.now() - 1000 * 60 * 17),
    createdAt: new Date(Date.now() - 1000 * 60 * 17),
    updatedAt: new Date(Date.now() - 1000 * 60 * 17),
  },
  {
    id: "3",
    content: "Client's posture became more tense when discussing work deadlines.",
    type: noteTypes[2],
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    createdAt: new Date(Date.now() - 1000 * 60 * 15),
    updatedAt: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: "4",
    content: "Practice 5-minute mindfulness exercise 3x daily",
    type: noteTypes[3],
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    createdAt: new Date(Date.now() - 1000 * 60 * 10),
    updatedAt: new Date(Date.now() - 1000 * 60 * 10),
  },
  {
    id: "5",
    content: "I think my anxiety about work reflects deeper concerns about proving my worth.",
    type: noteTypes[4],
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
    updatedAt: new Date(Date.now() - 1000 * 60 * 5),
  },
];

export const mockTools: Tool[] = [
  {
    id: "1",
    name: "Emotion Wheel",
    description: "Help clients identify and articulate their emotions with precision",
    category: "Emotional Awareness",
    icon: "heart",
  },
  {
    id: "2",
    name: "Breathing Exercise",
    description: "4-7-8 breath technique for anxiety relief",
    category: "Mindfulness",
    icon: "wind",
  },
  {
    id: "3",
    name: "Thought Record",
    description: "Document and challenge negative automatic thoughts",
    category: "CBT",
    icon: "file-text",
  },
  {
    id: "4",
    name: "Values Exploration",
    description: "Identify core values to guide meaningful action",
    category: "ACT",
    icon: "compass",
  },
  {
    id: "5",
    name: "Grounding Exercise",
    description: "5-4-3-2-1 sensory awareness technique for anxiety relief",
    category: "Mindfulness",
    icon: "anchor",
  },
];

// Generate attendance history for the past year
const generateAttendanceHistory = (): SessionAttendance[] => {
  const history: SessionAttendance[] = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setFullYear(today.getFullYear() - 1);
  
  // Weekly sessions for a year
  for (let i = 0; i < 52; i++) {
    const sessionDate = new Date(startDate);
    sessionDate.setDate(sessionDate.getDate() + (i * 7));
    
    // 80% attendance rate
    const attended = Math.random() > 0.2;
    
    history.push({
      date: sessionDate,
      attended
    });
  }
  
  return history;
};

export const mockClients: Client[] = [
  {
    id: "1",
    name: "Alex Johnson",
    startDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    attendanceHistory: generateAttendanceHistory(),
    sessions: [],
    issues: ["Anxiety", "Work stress", "Relationship difficulties"],
    backgroundInfo: "Alex has been struggling with work-related anxiety for the past year. Recently promoted to a management position, they're finding it difficult to balance new responsibilities with personal life."
  },
  {
    id: "2",
    name: "Taylor Smith",
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 6)),
    attendanceHistory: generateAttendanceHistory().slice(26),
    sessions: [],
    issues: ["Depression", "Self-esteem", "Grief"],
    backgroundInfo: "Taylor started therapy after losing a parent six months ago. They've been experiencing persistent low mood, sleep disturbances, and lack of motivation."
  },
  {
    id: "3",
    name: "Jordan Davis",
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 3)),
    attendanceHistory: generateAttendanceHistory().slice(39),
    sessions: [],
    issues: ["ADHD", "Organization", "Academic performance"],
    backgroundInfo: "Jordan is a college student recently diagnosed with ADHD. They're seeking strategies to improve focus, organization, and academic performance."
  },
];

export const mockSessions: Session[] = [
  {
    id: "1",
    clientId: "1",
    title: "Weekly Session",
    date: new Date(),
    notes: mockNotes,
    status: "in-progress",
    goals: ["Address work anxiety", "Practice mindfulness", "Explore coping strategies"]
  },
];

// Add sessions to clients
mockClients[0].sessions = [mockSessions[0]];
