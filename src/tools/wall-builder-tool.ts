import { icon } from "@fortawesome/fontawesome-svg-core";
import { faDrawPolygon } from "@fortawesome/free-solid-svg-icons";
import { Color, Group, Path, Point } from "paper";
import { Plan } from "../plan";
import { PaperTool } from "../toolbar";

export class WallBuilderTool extends PaperTool {
  private vectorStart: InstanceType<typeof Point> = new Point(0, 0);
  private vector: InstanceType<typeof Point> = new Point(0, 0);
  // private vectorPrevious: InstanceType<typeof Point> | null = null;
  private vectorItem: InstanceType<typeof Group> | null = null;
  public readonly name = "Construire des murs";

  public readonly icon = icon(faDrawPolygon);

  public constructor(private readonly plan: Plan) {
    super();

    this.paperTool.onMouseDown = this.onMouseDown.bind(this);
    this.paperTool.onMouseDrag = this.onMouseDrag.bind(this);
    this.paperTool.onMouseUp = this.onMouseUp.bind(this);
    this.paperTool.onKeyDown = this.onKeyDown.bind(this);
  }

  private processVector(event: paper.ToolEvent) {
    this.vector = event.point.subtract(this.vectorStart);
    this.drawVector();
  }
  private drawVector() {
    if (this.vectorItem !== null) this.vectorItem.remove();
    let end = this.vectorStart.add(this.vector);
    this.vectorItem = new Group([new Path([this.vectorStart, end])]);
    this.vectorItem.strokeWidth = 0.75;
    this.vectorItem.strokeColor = new Color("#e4141b");
  }

  public onMouseDown(event: paper.ToolEvent): void {
    let end = this.vectorStart.add(this.vector);
    this.vectorStart = end;
    this.processVector(event);
  }

  public onMouseDrag(event: paper.ToolEvent) {
    this.processVector(event);
  }

  public onMouseUp(event: paper.ToolEvent) {
    this.processVector(event);
    if (this.vectorItem !== null) this.vectorItem.remove();
    this.plan.addSegment(event.point);
  }

  public onKeyDown(event: any): void {
    if (event.modifiers.control && event.key.charCodeAt(0) === 122) {
      this.plan.removeLast();
    }
  }
}
