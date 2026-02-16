
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ScheduleItem {
  id: string;
  subject: string;
  time: string;
  room: string;
  type: 'Lecture' | 'Lab' | 'Seminar';
}

export interface TaskItem {
  id: string;
  title: string;
  deadline: string;
  status: 'pending' | 'completed';
}

export interface CampusEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  category: 'Sports' | 'Cultural' | 'Tech' | 'Workshop';
}
