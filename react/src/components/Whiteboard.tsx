import { useEffect, useRef, useCallback, useState } from 'react';
import type { DrawingElementType, ToolType } from '../types/whiteboard';
import ToolPicker from './ToolPicker';
import './Whiteboard.css';

interface WhiteboardProps {
  code: string;
  elements: DrawingElementType[];
  onDrawRectangle: (x: number, y: number, width: number, height: number, color: string) => void;
  onDrawLine: (x1: number, y1: number, x2: number, y2: number, color: string) => void;
  onDrawArrow: (x1: number, y1: number, x2: number, y2: number, color: string) => void;
  onDrawText: (x: number, y: number, content: string, color: string) => void;
  onLeave: () => void;
}

export function Whiteboard({ code, elements, onDrawRectangle, onDrawLine, onDrawArrow, onDrawText, onLeave }: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<ToolType>('rectangle');
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPreview, setCurrentPreview] = useState<{ x: number; y: number } | null>(null);
  const [textInput, setTextInput] = useState<{ x: number; y: number; value: string } | null>(null);

  const drawElement = useCallback((ctx: CanvasRenderingContext2D, element: DrawingElementType) => {
    ctx.strokeStyle = element.color;
    ctx.fillStyle = element.color;
    ctx.lineWidth = 2;

    switch (element.type) {
      case 'rectangle':
        ctx.strokeRect(element.x, element.y, element.width, element.height);
        break;
      case 'line':
        ctx.beginPath();
        ctx.moveTo(element.x1, element.y1);
        ctx.lineTo(element.x2, element.y2);
        ctx.stroke();
        break;
      case 'arrow': {
        ctx.beginPath();
        ctx.moveTo(element.x1, element.y1);
        ctx.lineTo(element.x2, element.y2);
        ctx.stroke();

        const angle = Math.atan2(element.y2 - element.y1, element.x2 - element.x1);
        const arrowLength = 15;
        const arrowAngle = Math.PI / 6;

        ctx.beginPath();
        ctx.moveTo(element.x2, element.y2);
        ctx.lineTo(
          element.x2 - arrowLength * Math.cos(angle - arrowAngle),
          element.y2 - arrowLength * Math.sin(angle - arrowAngle)
        );
        ctx.moveTo(element.x2, element.y2);
        ctx.lineTo(
          element.x2 - arrowLength * Math.cos(angle + arrowAngle),
          element.y2 - arrowLength * Math.sin(angle + arrowAngle)
        );
        ctx.stroke();
        break;
      }
      case 'text':
        ctx.font = '16px sans-serif';
        ctx.fillText(element.content, element.x, element.y);
        break;
    }
  }, []);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    elements.forEach((element) => {
      drawElement(ctx, element);
    });

    if (startPoint && currentPreview && (selectedTool === 'rectangle' || selectedTool === 'line' || selectedTool === 'arrow')) {
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);

      if (selectedTool === 'rectangle') {
        const width = currentPreview.x - startPoint.x;
        const height = currentPreview.y - startPoint.y;
        ctx.strokeRect(startPoint.x, startPoint.y, width, height);
      } else if (selectedTool === 'line') {
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(currentPreview.x, currentPreview.y);
        ctx.stroke();
      } else if (selectedTool === 'arrow') {
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(currentPreview.x, currentPreview.y);
        ctx.stroke();
      }

      ctx.setLineDash([]);
    }
  }, [elements, startPoint, currentPreview, selectedTool, selectedColor, drawElement]);

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

  const getCanvasCoordinates = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const handleCanvasMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoordinates(event);
    if (!coords) return;

    if (selectedTool === 'text') {
      setTextInput({ x: coords.x, y: coords.y, value: '' });
    } else if (selectedTool === 'rectangle' || selectedTool === 'line' || selectedTool === 'arrow') {
      setStartPoint(coords);
      setIsDrawing(true);
    }
  };

  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const coords = getCanvasCoordinates(event);
    if (!coords) return;

    setCurrentPreview(coords);
  };

  const handleCanvasMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPoint) return;

    const coords = getCanvasCoordinates(event);
    if (!coords) return;

    if (selectedTool === 'rectangle') {
      const width = coords.x - startPoint.x;
      const height = coords.y - startPoint.y;
      if (Math.abs(width) > 5 && Math.abs(height) > 5) {
        onDrawRectangle(startPoint.x, startPoint.y, width, height, selectedColor);
      }
    } else if (selectedTool === 'line') {
      onDrawLine(startPoint.x, startPoint.y, coords.x, coords.y, selectedColor);
    } else if (selectedTool === 'arrow') {
      onDrawArrow(startPoint.x, startPoint.y, coords.x, coords.y, selectedColor);
    }

    setStartPoint(null);
    setIsDrawing(false);
    setCurrentPreview(null);
  };

  const handleTextSubmit = () => {
    if (textInput && textInput.value.trim()) {
      onDrawText(textInput.x, textInput.y, textInput.value, selectedColor);
      setTextInput(null);
    }
  };

  const handleTextKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleTextSubmit();
    } else if (event.key === 'Escape') {
      setTextInput(null);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="whiteboard-container">
      <ToolPicker
        selectedTool={selectedTool}
        selectedColor={selectedColor}
        onToolChange={setSelectedTool}
        onColorChange={setSelectedColor}
      />

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
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          className="whiteboard-canvas"
          style={{ cursor: isDrawing ? 'crosshair' : 'default' }}
        />
        {textInput && (
          <input
            type="text"
            autoFocus
            value={textInput.value}
            onChange={(e) => setTextInput({ ...textInput, value: e.target.value })}
            onKeyDown={handleTextKeyDown}
            onBlur={handleTextSubmit}
            style={{
              position: 'absolute',
              left: textInput.x,
              top: textInput.y,
              fontSize: '16px',
              border: '1px solid #000',
              padding: '2px',
              zIndex: 1000,
            }}
          />
        )}
      </div>

      <footer className="whiteboard-footer">
        <p>
          {selectedTool === 'rectangle' && 'Click and drag to draw a rectangle'}
          {selectedTool === 'line' && 'Click and drag to draw a line'}
          {selectedTool === 'arrow' && 'Click and drag to draw an arrow'}
          {selectedTool === 'text' && 'Click to add text'}
        </p>
        <p className="circle-count">{elements.length} element(s) drawn</p>
      </footer>
    </div>
  );
}
