import { useState, useEffect, useRef, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';
import type { Circle, WhiteboardState } from '../types/whiteboard';

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

  const drawCircle = useCallback(async (code: string, x: number, y: number): Promise<void> => {
    if (!connectionRef.current) throw new Error('Not connected');
    await connectionRef.current.invoke('DrawCircle', code, x, y);
  }, []);

  const onCircleDrawn = useCallback((callback: (circle: Circle) => void) => {
    if (!connectionRef.current) return () => {};
    connectionRef.current.on('CircleDrawn', callback);
    return () => {
      connectionRef.current?.off('CircleDrawn', callback);
    };
  }, []);

  return {
    isConnected,
    error,
    createWhiteboard,
    joinWhiteboard,
    leaveWhiteboard,
    drawCircle,
    onCircleDrawn,
  };
}
