import { icon } from "@fortawesome/fontawesome-svg-core";
import { paperPointToPoint, pointToPaperPoint } from "../plan/paper-plan";
import { Walls } from "../plan/walls/walls";
import { PaperTool } from "../toolbar";
import * as paper from "paper";
import { isEqual } from "lodash";
import { faDrawPolygon } from "@fortawesome/free-solid-svg-icons";

export class ExternalWallsBuilderTool extends PaperTool {
  private static dragDistance = 20;
  private static minVectorLength = 10;
  private startVector: paper.Point | null = null;
  private currentVector: paper.Point | null = null;
  private previousVector: paper.Point | null = null;
  private dragLine: paper.Path | null = null;
  private dashedLine: paper.Path | null = null;
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

  private drawLine(start: paper.Point, end: paper.Point): void {
    this.dragLine?.remove();
    this.dragLine = new paper.Path([start, end]);
    this.dragLine.strokeWidth = 0.75;
    this.dragLine.strokeColor = new paper.Color("#e4141b");
  }

  private drawDashedLine(start: paper.Point, end: paper.Point): void {
    this.dashedLine?.remove();
    this.dashedLine = new paper.Path([start, end]);
    this.dashedLine.strokeWidth = 0.75;
    this.dashedLine.dashArray = [1, 2];
    this.dashedLine.strokeColor = new paper.Color("black");
  }

  private removeDashedLine(): void {
    this.dashedLine?.remove();
  }

  public onMouseDown(event: paper.ToolEvent): void {
    this.processCursorPosition(event.point);
  }

  public onMouseDrag(event: paper.ToolEvent): void {
    this.processCursorPosition(event.point);
  }

  private processCursorPosition(point: paper.Point) {
    if (this.startVector === null) {
      this.startVector = point.round();
    }
    if (
      this.startVector!.getDistance(point) >
      ExternalWallsBuilderTool.minVectorLength
    ) {
      this.currentVector = this.restrictVectorAngle(
        point.subtract(this.startVector!),
        this.wallsAngleRestrictFactor
      )
        .add(this.startVector!)
        .round();
      const nearPoint = this.walls.getCornerNear(
        paperPointToPoint(point),
        ExternalWallsBuilderTool.dragDistance
      );
      if (nearPoint !== null) {
        this.currentVector = pointToPaperPoint(nearPoint);
      }
      const cornerOnX = this.walls.getCornerOnX(
        this.currentVector,
        ExternalWallsBuilderTool.dragDistance
      );
      const cornerOnY = this.walls.getCornerOnY(
        this.currentVector,
        ExternalWallsBuilderTool.dragDistance
      );
      let clean = true;
      if (
        cornerOnX !== null &&
        !isEqual(cornerOnX, paperPointToPoint(this.startVector))
      ) {
        clean = false;
        this.currentVector.y = cornerOnX.y;
        this.drawDashedLine(this.currentVector, pointToPaperPoint(cornerOnX));
      }
      if (
        cornerOnY !== null &&
        !isEqual(cornerOnY, paperPointToPoint(this.startVector))
      ) {
        clean = false;
        this.currentVector.x = cornerOnY.x;
        this.drawDashedLine(this.currentVector, pointToPaperPoint(cornerOnY));
      }
      if (clean) {
        this.removeDashedLine();
      }

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
      this.walls.addCorner(pointToPaperPoint(this.startVector!));
    }
    this.walls.addCorner(pointToPaperPoint(this.currentVector!));
    // Memorize previous point
    this.previousVector = this.startVector;
    this.startVector = this.currentVector;
    if (this.dragLine !== null) this.dragLine?.remove();
    this.removeDashedLine();
    // this.dashedDragLineGroup = new paper.Group([]);
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
