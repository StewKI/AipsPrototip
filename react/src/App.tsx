import { useState, useEffect, useCallback } from 'react';
import { useSignalR } from './hooks/useSignalR';
import { Home } from './components/Home';
import { Whiteboard } from './components/Whiteboard';
import type { DrawingElementType, WhiteboardState } from './types/whiteboard';
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
    drawRectangle,
    drawLine,
    drawArrow,
    drawText,
    onElementDrawn,
  } = useSignalR();

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
      onCreateWhiteboard={handleCreateWhiteboard}
      onJoinWhiteboard={handleJoinWhiteboard}
    />
  );
}

export default App;
