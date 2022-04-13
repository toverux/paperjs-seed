import { Point } from "../point";

export interface Walls {
  getCorners(): Point[];

  isEmpty(): boolean;

  addCorner(point: Point): void;

  removeLastCorner(): void;
}
