import { icon } from "@fortawesome/fontawesome-svg-core";
import { faDrawPolygon } from "@fortawesome/free-solid-svg-icons";
import { Color, Group, Path, Point } from "paper";
import { Plan } from "../plan";
import { PaperTool } from "../toolbar";

export class WallBuilderTool extends PaperTool {
  private vectorStart: InstanceType<typeof Point> | null = null;
  private vectorPrevious: InstanceType<typeof Point> | null = null;
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
    if (this.vectorStart === null) {
      this.vectorStart = event.point;
    }
    this.drawLine(this.vectorStart!, event.point);
  }

  public onMouseDrag(event: paper.ToolEvent) {
    this.drawLine(this.vectorStart!, event.point);
  }

  public onMouseUp(event: paper.ToolEvent) {
    if (this.plan.isEmpty()) {
      this.plan.addSegment(this.vectorStart!);
    }
    this.plan.addSegment(event.point);
    // Memorize previous point
    this.vectorPrevious = this.vectorStart;
    this.vectorStart = event.point;
    if (this.dragVector !== null) this.dragVector.remove();
  }

  public onKeyDown(event: any): void {
    if (event.modifiers.control && event.key.charCodeAt(0) === 122) {
      this.plan.removeLast();
      if (this.plan.isEmpty()) {
        this.vectorStart = null;
        this.vectorPrevious = null;
      } else {
        this.vectorStart = this.vectorPrevious;
        let walls = this.plan.getWalls();
        this.vectorPrevious =
          walls.segments.at(walls.segments.length - 2)?.point ?? null;
      }
    }
  }
}
