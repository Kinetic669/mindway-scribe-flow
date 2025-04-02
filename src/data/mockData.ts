
import { Client, Note, NoteType, Session, Tool } from "../types";

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
    name: "Grounding Exercise",
    description: "5-4-3-2-1 sensory awareness technique for anxiety relief",
    category: "Mindfulness",
    icon: "anchor",
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
    name: "Breathing Exercise",
    description: "Guided diaphragmatic breathing for relaxation",
    category: "Mindfulness",
    icon: "wind",
  },
];

export const mockClients: Client[] = [
  {
    id: "1",
    name: "Alex Johnson",
    sessions: [],
  },
  {
    id: "2",
    name: "Taylor Smith",
    sessions: [],
  },
  {
    id: "3",
    name: "Jordan Davis",
    sessions: [],
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
  },
];

// Add sessions to clients
mockClients[0].sessions = [mockSessions[0]];
