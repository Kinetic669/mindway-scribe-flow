
export type NoteType = {
  id: string;
  name: string;
  color: string;
  icon?: string;
  visible: boolean;
};

export type Note = {
  id: string;
  content: string;
  type: NoteType;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type Tool = {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  previewImage?: string;
  component?: React.FC<any>;
};

export type Session = {
  id: string;
  clientId: string;
  title: string;
  date: Date;
  notes: Note[];
  duration?: number; // in minutes
  status: 'scheduled' | 'in-progress' | 'completed';
  goals?: string[];
  summary?: string;
};

export type SessionAttendance = {
  date: Date;
  attended: boolean;
};

export type Client = {
  id: string;
  name: string;
  avatar?: string;
  sessions: Session[];
  attendanceHistory: SessionAttendance[];
  startDate: Date;
  issues?: string[];
  backgroundInfo?: string;
};

export type DrawingTool = {
  type: 'pen' | 'eraser' | 'highlighter';
  size: number;
  color: string;
};
