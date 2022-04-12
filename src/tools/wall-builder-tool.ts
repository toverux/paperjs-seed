import { icon } from "@fortawesome/fontawesome-svg-core";
import { faDrawPolygon } from "@fortawesome/free-solid-svg-icons";
import { Color, Group, Path, Point } from "paper";
import { Plan } from "../plan";
import { PaperTool } from "../toolbar";

export class WallBuilderTool extends PaperTool {
  private startVector: InstanceType<typeof Point> | null = new Point(0, 0);
  private currentVector: InstanceType<typeof Point> | null = null;
  private previousVector: InstanceType<typeof Point> | null = null;
  private dragVector: InstanceType<typeof Group> | null = null;
  public readonly name = "Construire des murs";

  public readonly icon = icon(faDrawPolygon);

  public constructor(private readonly plan: Plan) {
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
    if (this.startVector === null) {
      this.startVector = event.point;
    }
    if (this.startVector!.getDistance(event.point) > 10) {
      this.drawLine(this.startVector!, event.point);
    }
  }

  public onMouseDrag(event: paper.ToolEvent) {
    if (this.startVector!.getDistance(event.point) > 10) {
      this.currentVector = this.restrictVectorAngle(
        event.point.subtract(this.startVector!),
        4
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
    console.log(angle);

    let degreeThreshold = 360 / restrictFactor; //90
    let div = Math.floor((angle + degreeThreshold / 2) / degreeThreshold);
    let result = degreeThreshold * div;

    console.log(result);
    return result;
    // if (angle >= 135 && angle < )
  }

  public onMouseUp(_event: paper.ToolEvent) {
    if (this.plan.isEmpty()) {
      this.plan.addSegment(this.startVector!);
    }
    this.plan.addSegment(this.currentVector!);
    // Memorize previous point
    this.previousVector = this.startVector;
    this.startVector = this.currentVector;
    if (this.dragVector !== null) this.dragVector.remove();
  }

  public onKeyDown(event: any): void {
    if (event.modifiers.control && event.key.charCodeAt(0) === 122) {
      this.plan.removeLast();
      if (this.plan.isEmpty()) {
        this.startVector = null;
        this.previousVector = null;
      } else {
        this.startVector = this.previousVector;
        let walls = this.plan.getWalls();
        this.previousVector =
          walls.segments.at(walls.segments.length - 2)?.point ?? null;
      }
    }
  }
}
