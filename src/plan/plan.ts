import * as paper from "paper";
import { Path } from "paper/dist/paper-core";

export class Plan {
  private externalWalls: paper.Path = new paper.Path();
  private walls: paper.Path = new paper.Path();

  public initialize(): Plan {
    this.externalWalls.strokeColor = new paper.Color("#e9e9ff");
    this.externalWalls.strokeWidth = 10;
    this.externalWalls.selected = true;
    // this.walls.strokeColor = new paper.Color("#e9e9ff");
    // this.walls.selected = true;
    return this;
  }
  public addExternalWallPoint(x: paper.Point): void {
    //TODO: check if there is already a point on the same axis (x or y) and delete it if it's inside
    this.externalWalls.closePath();
    // let closestPoints = this.walls.
    this.externalWalls.add(x);
  }

  public addWallPoint(x: paper.Point): void {
    this.walls.add(x);
  }

  public removeLast(): void {
    if (this.walls.segments.length !== 0) {
      this.walls.removeSegment(this.walls.segments.length - 1);
    }
    if (this.walls.segments.length === 1) {
      this.walls.removeSegment(0);
    }
  }

  public isEmpty(): boolean {
    return this.walls.isEmpty();
  }

  public getExternalWalls(): InstanceType<typeof Path> {
    return this.externalWalls;
  }

  public getWalls(): InstanceType<typeof Path> {
    return this.walls;
  }
}
