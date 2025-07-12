export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: 'guest' | 'user' | 'admin';
  reputation: number;
}

export interface Question {
  id: string;
  title: string;
  description: string;
  tags: string[];
  author: User;
  voteScore: number;
  answers: Answer[];
  views: number;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Answer {
  id: string;
  content: string;
  author: User;
  question: string;
  voteScore: number;
  isAccepted: boolean;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Vote {
  id: string;
  user: string;
  question?: string;
  answer?: string;
  type: 'upvote' | 'downvote';
}

export interface Notification {
  id: string;
  recipient: string;
  sender: User;
  type: 'answer' | 'comment' | 'vote' | 'accepted';
  question: Question;
  answer?: Answer;
  message: string;
  read: boolean;
  createdAt: string;
}