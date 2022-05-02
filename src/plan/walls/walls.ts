import { Point } from "../point";

export interface Walls {
  getCornerNear(point: Point, radius: number): Point | null;
  getCorners(): Point[];
  getCornerOnX(point: Point, radius: number): Point | null;
  getCornerOnY(point: Point, radius: number): Point | null;
  isEmpty(): boolean;
  addCorner(point: Point): void;
  removeLastCorner(): void;
}
