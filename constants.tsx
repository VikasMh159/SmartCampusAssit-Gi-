
import { ScheduleItem, TaskItem, CampusEvent } from './types';

export const MOCK_SCHEDULE: ScheduleItem[] = [
  { id: '1', subject: 'Data Structures', time: '09:00 AM', room: 'LH-102', type: 'Lecture' },
  { id: '2', subject: 'Operating Systems', time: '11:30 AM', room: 'CS-Lab 2', type: 'Lab' },
  { id: '3', subject: 'Cloud Computing', time: '02:00 PM', room: 'Audi-A', type: 'Lecture' },
];

export const MOCK_TASKS: TaskItem[] = [
  { id: 't1', title: 'DBMS Assignment 4', deadline: 'Today, 11:59 PM', status: 'pending' },
  { id: 't2', title: 'Maths Quiz Prep', deadline: 'Tomorrow', status: 'pending' },
  { id: 't3', title: 'English Presentation', deadline: 'Fri, 10th Oct', status: 'completed' },
];

export const MOCK_EVENTS: CampusEvent[] = [
  { id: 'e1', title: 'Hackathon 2024', date: 'Oct 15-16', location: 'Innovation Hub', category: 'Tech' },
  { id: 'e2', title: 'Annual Cultural Fest', date: 'Oct 20-22', location: 'Main Ground', category: 'Cultural' },
  { id: 'e3', title: 'Yoga Workshop', date: 'Oct 12', location: 'Sports Center', category: 'Workshop' },
];

export const SYSTEM_INSTRUCTION = `
You are an AI assistant inside an Android application named "Smart Campus Assist".
Your goal is to help college students manage their campus life efficiently.

User Role: College Student.
Topics: Class schedules, Exams, Assignments, College events, Daily reminders, General academic doubts.

Response Rules:
1. Use simple English or Hinglish.
2. Keep answers short and clear.
3. Be friendly and supportive.
4. Explain step-by-step when required.
5. Do not use complex technical words.
6. Avoid long paragraphs.
7. Output plain text only.

Current Context:
- Today is Monday.
- Student has Data Structures at 9 AM, OS Lab at 11:30 AM.
- DBMS Assignment is due tonight.
- Hackathon is on Oct 15th.

If a question is unclear, ask a polite follow-up question.
`;
