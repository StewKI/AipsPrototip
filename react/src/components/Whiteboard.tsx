import { useEffect, useRef, useCallback } from 'react';
import type { Circle } from '../types/whiteboard';
import './Whiteboard.css';

interface WhiteboardProps {
  code: string;
  circles: Circle[];
  onDrawCircle: (x: number, y: number) => void;
  onLeave: () => void;
}

export function Whiteboard({ code, circles, onDrawCircle, onLeave }: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    circles.forEach((circle) => {
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
      ctx.fillStyle = circle.color;
      ctx.fill();
      ctx.closePath();
    });
  }, [circles]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        redrawCanvas();
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [redrawCanvas]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    onDrawCircle(x, y);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="whiteboard-container">
      <header className="whiteboard-header">
        <div className="code-display">
          <span>Code: </span>
          <strong>{code}</strong>
          <button onClick={handleCopyCode} className="copy-button" title="Copy code">
            Copy
          </button>
        </div>
        <button onClick={onLeave} className="leave-button">
          Leave Whiteboard
        </button>
      </header>

      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="whiteboard-canvas"
        />
      </div>

      <footer className="whiteboard-footer">
        <p>Click anywhere on the canvas to draw a circle</p>
        <p className="circle-count">{circles.length} circle(s) drawn</p>
      </footer>
    </div>
  );
}
