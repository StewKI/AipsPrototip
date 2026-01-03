import { useState, useEffect, useRef, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';
import type { DrawingElementType, WhiteboardState } from '../types/whiteboard';

const HUB_URL = '/hubs/whiteboard';

export function useSignalR() {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL)
      .withAutomaticReconnect()
      .build();

    connectionRef.current = newConnection;

    newConnection.start()
      .then(() => {
        setIsConnected(true);
        setError(null);
      })
      .catch((err) => {
        setError(`Connection failed: ${err.message}`);
        setIsConnected(false);
      });

    newConnection.onreconnecting(() => setIsConnected(false));
    newConnection.onreconnected(() => setIsConnected(true));
    newConnection.onclose(() => setIsConnected(false));

    return () => {
      newConnection.stop();
    };
  }, []);

  const createWhiteboard = useCallback(async (): Promise<string> => {
    if (!connectionRef.current) throw new Error('Not connected');
    return await connectionRef.current.invoke<string>('CreateWhiteboard');
  }, []);

  const joinWhiteboard = useCallback(async (code: string): Promise<WhiteboardState> => {
    if (!connectionRef.current) throw new Error('Not connected');
    return await connectionRef.current.invoke<WhiteboardState>('JoinWhiteboard', code);
  }, []);

  const leaveWhiteboard = useCallback(async (code: string): Promise<void> => {
    if (!connectionRef.current) return;
    await connectionRef.current.invoke('LeaveWhiteboard', code);
  }, []);

  const drawRectangle = useCallback(async (code: string, x: number, y: number, width: number, height: number, color: string): Promise<void> => {
    if (!connectionRef.current) throw new Error('Not connected');
    await connectionRef.current.invoke('DrawRectangle', code, x, y, width, height, color);
  }, []);

  const drawLine = useCallback(async (code: string, x1: number, y1: number, x2: number, y2: number, color: string): Promise<void> => {
    if (!connectionRef.current) throw new Error('Not connected');
    await connectionRef.current.invoke('DrawLine', code, x1, y1, x2, y2, color);
  }, []);

  const drawArrow = useCallback(async (code: string, x1: number, y1: number, x2: number, y2: number, color: string): Promise<void> => {
    if (!connectionRef.current) throw new Error('Not connected');
    await connectionRef.current.invoke('DrawArrow', code, x1, y1, x2, y2, color);
  }, []);

  const drawText = useCallback(async (code: string, x: number, y: number, content: string, color: string): Promise<void> => {
    if (!connectionRef.current) throw new Error('Not connected');
    await connectionRef.current.invoke('DrawText', code, x, y, content, color);
  }, []);

  const onElementDrawn = useCallback((callback: (element: DrawingElementType) => void) => {
    if (!connectionRef.current) return () => {};
    connectionRef.current.on('ElementDrawn', callback);
    return () => {
      connectionRef.current?.off('ElementDrawn', callback);
    };
  }, []);

  return {
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
  };
}
