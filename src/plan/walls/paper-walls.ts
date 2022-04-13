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

  public getCorners(): Point[] {
    return this.corners.segments.map((s: paper.Segment) =>
      paperPointToPoint(s.point)
    );
  }

  public isEmpty(): boolean {
    return this.corners.isEmpty();
  }

  public addCorner(point: Point): void {
    //TODO: check if there is already a point on the same axis (x or y) and delete it if it's inside
    // this.externalWalls.closePath();
    // let closestPoints = this.walls.
    this.corners.add(pointToPaperPoint(point));
    this.corners = this.corners.reduce([]);
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
