import * as paper from "paper";
import { paperPointToPoint, pointToPaperPoint } from "../paper-plan";
import { Point } from "../point";
import { Walls } from "./walls";

export class PaperWalls implements Walls {
  private corners: paper.Path = new paper.Path();

  public constructor() {
    this.corners.strokeColor = new paper.Color("#e9e9ff");
    this.corners.strokeWidth = 10;
    this.corners.selected = true;
  }
  public getCornerOnX(point: Point, radius: number = 0): Point | null {
    let onX =
      this.corners.segments.find((s: paper.Segment) => {
        return Math.abs(s.point.y - point.y) <= radius;
      })?.point ?? null;
    if (onX === null) {
      return null;
    }
    return paperPointToPoint(onX);
  }
  public getCornerOnY(point: Point, radius: number = 0): Point | null {
    let onY =
      this.corners.segments.find((s: paper.Segment) => {
        return Math.abs(s.point.x - point.x) <= radius;
      })?.point ?? null;
    if (onY === null) {
      return null;
    }
    return paperPointToPoint(onY);
  }
  public getCornerNear(point: Point, radius: number): Point | null {
    let paperPoint = pointToPaperPoint(point);
    let nearest =
      this.corners.segments.find((s: paper.Segment) => {
        return s.point.getDistance(paperPoint) <= radius;
      })?.point ?? null;
    return nearest === null ? null : paperPointToPoint(nearest);
  }

  public getCorners(): Point[] {
    return this.corners.segments.map((s: paper.Segment) =>
      paperPointToPoint(s.point)
    );
  }

  public isEmpty(): boolean {
    return this.corners.isEmpty();
  }

  public addCorner(point: Point): void {
    this.corners.add(pointToPaperPoint(point));
  }

  public removeLastCorner(): void {
    if (this.corners.segments.length !== 0) {
      this.corners.removeSegment(this.corners.segments.length - 1);
    }
    if (this.corners.segments.length === 1) {
      this.corners.removeSegment(0);
    }
  }
}
