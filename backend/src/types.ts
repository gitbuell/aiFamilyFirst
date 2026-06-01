// Augment Express Request with the authenticated user (set by requireAuth).
export interface AuthUser {
  id: string;
  role: 'patient' | 'parent' | 'np' | 'admin';
  email: string;
  sessionId: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
