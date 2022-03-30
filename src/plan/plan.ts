import * as paper from "paper";
import { Path } from "paper/dist/paper-core";

export class Plan {
  private walls: paper.Path = new paper.Path();

  public initialize(): Plan {
    this.walls.strokeColor = new paper.Color("#e9e9ff");
    this.walls.selected = true;
    return this;
  }

  public addSegment(x: paper.Point): void {
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

  public getWalls(): InstanceType<typeof Path> {
    return this.walls;
  }
}
