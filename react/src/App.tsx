import { useState, useEffect, useCallback } from 'react';
import { useSignalR } from './hooks/useSignalR';
import { Home } from './components/Home';
import { Whiteboard } from './components/Whiteboard';
import type { Circle, WhiteboardState } from './types/whiteboard';
import './App.css';

type View = 'home' | 'whiteboard';

function App() {
  const [view, setView] = useState<View>('home');
  const [whiteboardState, setWhiteboardState] = useState<WhiteboardState | null>(null);

  const {
    isConnected,
    error,
    createWhiteboard,
    joinWhiteboard,
    leaveWhiteboard,
    drawCircle,
    onCircleDrawn,
  } = useSignalR();

  useEffect(() => {
    if (!whiteboardState) return;

    const unsubscribe = onCircleDrawn((circle: Circle) => {
      setWhiteboardState((prev) => {
        if (!prev) return prev;
        if (prev.circles.some((c) => c.id === circle.id)) {
          return prev;
        }
        return {
          ...prev,
          circles: [...prev.circles, circle],
        };
      });
    });

    return unsubscribe;
  }, [whiteboardState, onCircleDrawn]);

  const handleCreateWhiteboard = useCallback(async () => {
    const code = await createWhiteboard();
    setWhiteboardState({ code, circles: [] });
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

  const handleDrawCircle = useCallback(async (x: number, y: number) => {
    if (whiteboardState) {
      await drawCircle(whiteboardState.code, x, y);
    }
  }, [whiteboardState, drawCircle]);

  if (view === 'whiteboard' && whiteboardState) {
    return (
      <Whiteboard
        code={whiteboardState.code}
        circles={whiteboardState.circles}
        onDrawCircle={handleDrawCircle}
        onLeave={handleLeave}
      />
    );
  }

  return (
    <Home
      isConnected={isConnected}
      error={error}
      onCreateWhiteboard={handleCreateWhiteboard}
      onJoinWhiteboard={handleJoinWhiteboard}
    />
  );
}

export default App;
