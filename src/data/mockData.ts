import { Client, Note, NoteType, Session, Tool, SessionAttendance } from "../types";

export const noteTypes: NoteType[] = [
  {
    id: "1",
    name: "Cytat Klienta",
    color: "#4c6fff",
    icon: "quote",
    visible: true,
  },
  {
    id: "2",
    name: "Spostrzeżenie Terapeuty",
    color: "#10b981",
    icon: "lightbulb",
    visible: true,
  },
  {
    id: "3",
    name: "Obserwacja",
    color: "#6366f1",
    icon: "eye",
    visible: true,
  },
  {
    id: "4",
    name: "Zadanie do Wykonania",
    color: "#f43f5e",
    icon: "check-square",
    visible: true,
  },
  {
    id: "5",
    name: "Refleksja",
    color: "#fbbf24",
    icon: "brain",
    visible: true,
  },
  {
    id: "6",
    name: "Pytanie",
    color: "#8b5cf6",
    icon: "help-circle",
    visible: true,
  },
  {
    id: "7",
    name: "Notatka z Postępu",
    color: "#06b6d4",
    icon: "activity",
    visible: true,
  },
  {
    id: "8",
    name: "Materiały",
    color: "#14b8a6",
    icon: "book",
    visible: true,
  },
];

export const mockNotes: Note[] = [
  {
    id: "1",
    content: "Ostatnio czuję się przytłoczony pracą, nie mogę się skupić na niczym innym.",
    type: noteTypes[0],
    timestamp: new Date(Date.now() - 1000 * 60 * 20),
    createdAt: new Date(Date.now() - 1000 * 60 * 20),
    updatedAt: new Date(Date.now() - 1000 * 60 * 20),
  },
  {
    id: "2",
    content: "Klient wykazuje oznaki lęku związanego z pracą. Na następnej sesji omówić mechanizmy radzenia sobie.",
    type: noteTypes[1],
    timestamp: new Date(Date.now() - 1000 * 60 * 17),
    createdAt: new Date(Date.now() - 1000 * 60 * 17),
    updatedAt: new Date(Date.now() - 1000 * 60 * 17),
  },
  {
    id: "3",
    content: "Postawa klienta stała się bardziej napięta podczas rozmowy o terminach w pracy.",
    type: noteTypes[2],
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    createdAt: new Date(Date.now() - 1000 * 60 * 15),
    updatedAt: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: "4",
    content: "Praktykować 5-minutowe ćwiczenia uważności 3 razy dziennie",
    type: noteTypes[3],
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    createdAt: new Date(Date.now() - 1000 * 60 * 10),
    updatedAt: new Date(Date.now() - 1000 * 60 * 10),
  },
  {
    id: "5",
    content: "Myślę, że mój lęk związany z pracą odzwierciedla głębsze obawy o udowodnienie swojej wartości.",
    type: noteTypes[4],
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
    updatedAt: new Date(Date.now() - 1000 * 60 * 5),
  },
];

export const mockTools: Tool[] = [
  {
    id: "1",
    name: "Koło Emocji",
    description: "Pomoc klientom w identyfikacji i wyrażaniu ich emocji z precyzją",
    category: "Świadomość Emocjonalna",
    icon: "heart",
  },
  {
    id: "2",
    name: "Ćwiczenie Oddechowe",
    description: "Technika oddechu 4-7-8 na złagodzenie lęku",
    category: "Uważność",
    icon: "wind",
  },
  {
    id: "3",
    name: "Zapis Myśli",
    description: "Dokumentowanie i kwestionowanie negatywnych automatycznych myśli",
    category: "CBT",
    icon: "file-text",
  },
  {
    id: "4",
    name: "Eksploracja Wartości",
    description: "Identyfikacja podstawowych wartości kierujących znaczącym działaniem",
    category: "ACT",
    icon: "compass",
  },
  {
    id: "5",
    name: "Ćwiczenie Uziemiające",
    description: "Technika świadomości zmysłowej 5-4-3-2-1 na złagodzenie lęku",
    category: "Uważność",
    icon: "anchor",
  },
];

// Generowanie historii obecności za ostatni rok
const generateAttendanceHistory = (): SessionAttendance[] => {
  const history: SessionAttendance[] = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setFullYear(today.getFullYear() - 1);
  
  // Sesje tygodniowe przez rok
  for (let i = 0; i < 52; i++) {
    const sessionDate = new Date(startDate);
    sessionDate.setDate(sessionDate.getDate() + (i * 7));
    
    // 80% frekwencja
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
    name: "Adam Kowalski",
    startDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    attendanceHistory: generateAttendanceHistory(),
    sessions: [],
    issues: ["Lęk", "Stres w pracy", "Trudności w związku"],
    backgroundInfo: "Adam zmaga się z lękiem związanym z pracą od roku. Niedawno awansował na stanowisko kierownicze i ma trudności z równoważeniem nowych obowiązków z życiem osobistym."
  },
  {
    id: "2",
    name: "Teresa Nowak",
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 6)),
    attendanceHistory: generateAttendanceHistory().slice(26),
    sessions: [],
    issues: ["Depresja", "Samoocena", "Żałoba"],
    backgroundInfo: "Teresa rozpoczęła terapię po stracie rodzica sześć miesięcy temu. Doświadcza uporczywego obniżenia nastroju, zaburzeń snu i braku motywacji."
  },
  {
    id: "3",
    name: "Jakub Wiśniewski",
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 3)),
    attendanceHistory: generateAttendanceHistory().slice(39),
    sessions: [],
    issues: ["ADHD", "Organizacja", "Wyniki w nauce"],
    backgroundInfo: "Jakub jest studentem, u którego niedawno zdiagnozowano ADHD. Szuka strategii poprawy koncentracji, organizacji i wyników w nauce."
  },
];

export const mockSessions: Session[] = [
  {
    id: "1",
    clientId: "1",
    title: "Sesja Tygodniowa",
    date: new Date(),
    notes: mockNotes,
    status: "in-progress",
    goals: ["Radzenie sobie z lękiem w pracy", "Praktyka uważności", "Poznanie strategii radzenia sobie"]
  },
];

// Dodanie sesji do klientów
mockClients[0].sessions = [mockSessions[0]]; 