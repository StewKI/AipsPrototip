export type ToolType = 'rectangle' | 'line' | 'arrow' | 'text';

export interface DrawingElement {
  id: string;
  type: ToolType;
  color: string;
}

export interface Rectangle extends DrawingElement {
  type: 'rectangle';
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Line extends DrawingElement {
  type: 'line';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Arrow extends DrawingElement {
  type: 'arrow';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Text extends DrawingElement {
  type: 'text';
  x: number;
  y: number;
  content: string;
}

export type DrawingElementType = Rectangle | Line | Arrow | Text;

export interface WhiteboardState {
  code: string;
  elements: DrawingElementType[];
}
