export interface Circle {
  id: string;
  x: number;
  y: number;
  radius: number;
  color: string;
}

export interface WhiteboardState {
  code: string;
  circles: Circle[];
}
