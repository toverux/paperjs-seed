import * as paper from "paper";
import { Plan } from "./plan";
import { Point } from "./point";
import { Walls } from "./walls/walls";

export function pointToPaperPoint(point: Point): paper.Point {
  return new paper.Point(point.x, point.y);
}

export function paperPointToPoint(point: paper.Point): Point {
  return new Point(point.x, point.y);
}

export class PaperPlan implements Plan {
  public constructor(
    public readonly walls: Walls,
    public readonly externalWalls: Walls
  ) {}
}
