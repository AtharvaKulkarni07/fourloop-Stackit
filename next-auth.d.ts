import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      role: 'guest' | 'user' | 'admin';
      reputation: number;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: 'guest' | 'user' | 'admin';
    reputation?: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: 'guest' | 'user' | 'admin';
  }
}