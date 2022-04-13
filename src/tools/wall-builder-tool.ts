import { icon } from "@fortawesome/fontawesome-svg-core";
import { faDrawPolygon } from "@fortawesome/free-solid-svg-icons";
import { Color, Group, Path, Point } from "paper";
import { pointToPaperPoint } from "../plan/paper-plan";
import { Walls } from "../plan/walls/walls";
import { PaperTool } from "../toolbar";

export class ExternalWallsBuilderTool extends PaperTool {
  private static minVectorLength = 10;
  private startVector: InstanceType<typeof Point> | null = null;
  private currentVector: InstanceType<typeof Point> | null = null;
  private previousVector: InstanceType<typeof Point> | null = null;
  private dragVector: InstanceType<typeof Group> | null = null;
  public readonly name = "Construire des murs";

  public readonly icon = icon(faDrawPolygon);

  public constructor(
    private readonly walls: Walls,
    private readonly wallsAngleRestrictFactor: number
  ) {
    super();
    this.paperTool.onMouseDown = this.onMouseDown.bind(this);
    this.paperTool.onMouseDrag = this.onMouseDrag.bind(this);
    this.paperTool.onMouseUp = this.onMouseUp.bind(this);
    this.paperTool.onKeyDown = this.onKeyDown.bind(this);
  }

  private drawLine(start: paper.Point, end: paper.Point) {
    if (this.dragVector !== null) this.dragVector.remove();
    this.dragVector = new Group([new Path([start, end])]);
    this.dragVector.strokeWidth = 0.75;
    this.dragVector.strokeColor = new Color("#e4141b");
  }

  public onMouseDown(event: paper.ToolEvent): void {
    this.processCursorPosition(event.point);
  }

  public onMouseDrag(event: paper.ToolEvent): void {
    this.processCursorPosition(event.point);
  }

  private processCursorPosition(point: InstanceType<typeof Point>) {
    if (this.startVector === null) {
      this.startVector = point;
    }
    if (
      this.startVector!.getDistance(point) >
      ExternalWallsBuilderTool.minVectorLength
    ) {
      this.currentVector = this.restrictVectorAngle(
        point.subtract(this.startVector!),
        this.wallsAngleRestrictFactor
      ).add(this.startVector!);
      this.drawLine(this.startVector!, this.currentVector);
    }
  }

  private restrictVectorAngle(
    vector: paper.Point,
    restrictFactor: number
  ): paper.Point {
    let absoluteAngle = vector.angle;
    if (absoluteAngle < 0) {
      absoluteAngle += 360;
    }
    vector.angle = this.restrictAngle(absoluteAngle, restrictFactor);
    return vector;
  }

  /**
   * @param angle between 0 and 360
   * @param restrictFactor minimum 0
   * @returns
   */
  private restrictAngle(angle: number, restrictFactor: number): number {
    let degreeThreshold = 360 / restrictFactor;
    return (
      degreeThreshold *
      Math.floor((angle + degreeThreshold / 2) / degreeThreshold)
    );
  }

  public onMouseUp(_event: paper.ToolEvent) {
    if (this.walls.isEmpty()) {
      this.walls.addCorner(this.startVector!);
    }
    this.walls.addCorner(this.currentVector!);
    // Memorize previous point
    this.previousVector = this.startVector;
    this.startVector = this.currentVector;
    if (this.dragVector !== null) this.dragVector.remove();
  }

  public onKeyDown(event: any): void {
    if (event.modifiers.control && event.key.charCodeAt(0) === 122) {
      this.walls.removeLastCorner();
      if (this.walls.isEmpty()) {
        this.startVector = null;
        this.previousVector = null;
      } else {
        this.startVector = this.previousVector;
        let walls = this.walls.getCorners();
        let previousPoint = walls.at(walls.length - 2) ?? null;
        this.previousVector = previousPoint
          ? pointToPaperPoint(previousPoint)
          : null;
      }
    }
  }
}
