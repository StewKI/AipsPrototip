import { useState, useEffect, useCallback } from 'react';
import { useSignalR } from './hooks/useSignalR';
import { Home } from './components/Home';
import { Whiteboard } from './components/Whiteboard';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { authService } from './services/authService';
import type { DrawingElementType, WhiteboardState } from './types/whiteboard';
import type { User } from './types/auth';
import './App.css';

type View = 'home' | 'whiteboard' | 'login' | 'register';

function App() {
  const [view, setView] = useState<View>('login');
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [whiteboardState, setWhiteboardState] = useState<WhiteboardState | null>(null);

  const {
    isConnected,
    error,
    createWhiteboard,
    joinWhiteboard,
    leaveWhiteboard,
    drawRectangle,
    drawLine,
    drawArrow,
    drawText,
    onElementDrawn,
  } = useSignalR();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setView('home');
        }
      } catch (err) {
        console.error('Failed to check auth:', err);
      } finally {
        setIsInitializing(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (!whiteboardState) return;

    const unsubscribe = onElementDrawn((element: DrawingElementType) => {
      setWhiteboardState((prev) => {
        if (!prev) return prev;
        if (prev.elements.some((e) => e.id === element.id)) {
          return prev;
        }
        return {
          ...prev,
          elements: [...prev.elements, element],
        };
      });
    });

    return unsubscribe;
  }, [whiteboardState, onElementDrawn]);

  const handleCreateWhiteboard = useCallback(async () => {
    const code = await createWhiteboard();
    setWhiteboardState({ code, elements: [] });
    setView('whiteboard');
  }, [createWhiteboard]);

  const handleJoinWhiteboard = useCallback(async (code: string) => {
    const state = await joinWhiteboard(code);
    setWhiteboardState(state);
    setView('whiteboard');
  }, [joinWhiteboard]);

  const handleLeave = useCallback(async () => {
    if (whiteboardState) {
      await leaveWhiteboard(whiteboardState.code);
    }
    setWhiteboardState(null);
    setView('home');
  }, [whiteboardState, leaveWhiteboard]);

  const handleDrawRectangle = useCallback(async (x: number, y: number, width: number, height: number, color: string) => {
    if (whiteboardState) {
      await drawRectangle(whiteboardState.code, x, y, width, height, color);
    }
  }, [whiteboardState, drawRectangle]);

  const handleDrawLine = useCallback(async (x1: number, y1: number, x2: number, y2: number, color: string) => {
    if (whiteboardState) {
      await drawLine(whiteboardState.code, x1, y1, x2, y2, color);
    }
  }, [whiteboardState, drawLine]);

  const handleDrawArrow = useCallback(async (x1: number, y1: number, x2: number, y2: number, color: string) => {
    if (whiteboardState) {
      await drawArrow(whiteboardState.code, x1, y1, x2, y2, color);
    }
  }, [whiteboardState, drawArrow]);

  const handleDrawText = useCallback(async (x: number, y: number, content: string, color: string) => {
    if (whiteboardState) {
      await drawText(whiteboardState.code, x, y, content, color);
    }
  }, [whiteboardState, drawText]);

  const handleAuthSuccess = useCallback((userId: string, userName: string) => {
    setUser({ userId, userName, email: '' }); // Email isn't returned by login/register but we can fetch it later if needed
    setView('home');
  }, []);

  const handleLogout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setView('login');
  }, []);

  if (isInitializing) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (view === 'login') {
    return (
      <Login
        onLoginSuccess={handleAuthSuccess}
        onSwitchToRegister={() => setView('register')}
      />
    );
  }

  if (view === 'register') {
    return (
      <Register
        onRegisterSuccess={handleAuthSuccess}
        onSwitchToLogin={() => setView('login')}
      />
    );
  }

  if (view === 'whiteboard' && whiteboardState) {
    return (
      <Whiteboard
        code={whiteboardState.code}
        elements={whiteboardState.elements}
        onDrawRectangle={handleDrawRectangle}
        onDrawLine={handleDrawLine}
        onDrawArrow={handleDrawArrow}
        onDrawText={handleDrawText}
        onLeave={handleLeave}
      />
    );
  }

  return (
    <Home
      isConnected={isConnected}
      error={error}
      user={user}
      onCreateWhiteboard={handleCreateWhiteboard}
      onJoinWhiteboard={handleJoinWhiteboard}
      onLogout={handleLogout}
    />
  );
}

export default App;
