import type { ToolType } from '../types/whiteboard';

interface ToolPickerProps {
  selectedTool: ToolType;
  selectedColor: string;
  onToolChange: (tool: ToolType) => void;
  onColorChange: (color: string) => void;
}

export default function ToolPicker({
  selectedTool,
  selectedColor,
  onToolChange,
  onColorChange,
}: ToolPickerProps) {
  const tools: { type: ToolType; label: string; icon: string }[] = [
    { type: 'rectangle', label: 'Rectangle', icon: '▭' },
    { type: 'line', label: 'Line', icon: '╱' },
    { type: 'arrow', label: 'Arrow', icon: '→' },
    { type: 'text', label: 'Text', icon: 'T' },
  ];

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '20px',
      backgroundColor: 'white',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      zIndex: 1000,
    }}>
      <div>
        <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>
          Tools
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {tools.map((tool) => (
            <button
              key={tool.type}
              onClick={() => onToolChange(tool.type)}
              style={{
                padding: '8px 12px',
                border: selectedTool === tool.type ? '2px solid #3B82F6' : '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: selectedTool === tool.type ? '#EFF6FF' : 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '16px',
              }}
            >
              <span style={{ fontSize: '20px' }}>{tool.icon}</span>
              <span>{tool.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>
          Color
        </div>
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => onColorChange(e.target.value)}
          style={{
            width: '100%',
            height: '40px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        />
        <div style={{ fontSize: '12px', color: '#666', marginTop: '5px', textAlign: 'center' }}>
          {selectedColor}
        </div>
      </div>
    </div>
  );
}
