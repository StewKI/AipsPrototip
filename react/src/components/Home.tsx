import { useState } from 'react';
import type { User } from '../types/auth';
import './Home.css';

interface HomeProps {
  isConnected: boolean;
  error: string | null;
  user: User | null;
  onCreateWhiteboard: () => Promise<void>;
  onJoinWhiteboard: (code: string) => Promise<void>;
  onLogout: () => Promise<void>;
}

export function Home({ isConnected, error, user, onCreateWhiteboard, onJoinWhiteboard, onLogout }: HomeProps) {
  const [joinCode, setJoinCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleCreate = async () => {
    setIsLoading(true);
    setLocalError(null);
    try {
      await onCreateWhiteboard();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to create whiteboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoin = async () => {
    if (joinCode.length !== 8) {
      setLocalError('Please enter a valid 8-digit code');
      return;
    }
    setIsLoading(true);
    setLocalError(null);
    try {
      await onJoinWhiteboard(joinCode);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to join whiteboard');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Collaborative Whiteboard</h1>
        {user && (
          <div className="user-info">
            <span>Welcome, {user.userName}!</span>
            <button onClick={onLogout} className="logout-button">Logout</button>
          </div>
        )}
      </div>

      <div className="connection-status">
        Status: {isConnected ?
          <span className="connected">Connected</span> :
          <span className="disconnected">Disconnected</span>
        }
      </div>

      {(error || localError) && (
        <div className="error-message">{error || localError}</div>
      )}

      <div className="actions">
        <div className="action-section">
          <h2>Create New Whiteboard</h2>
          <button
            onClick={handleCreate}
            disabled={!isConnected || isLoading}
            className="primary-button"
          >
            {isLoading ? 'Creating...' : 'Create Whiteboard'}
          </button>
        </div>

        <div className="divider">OR</div>

        <div className="action-section">
          <h2>Join Existing Whiteboard</h2>
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.replace(/\D/g, '').slice(0, 8))}
            placeholder="Enter 8-digit code"
            maxLength={8}
            className="code-input"
          />
          <button
            onClick={handleJoin}
            disabled={!isConnected || isLoading || joinCode.length !== 8}
            className="primary-button"
          >
            {isLoading ? 'Joining...' : 'Join Whiteboard'}
          </button>
        </div>
      </div>
    </div>
  );
}
