import { icon } from "@fortawesome/fontawesome-svg-core";
import { faFillDrip } from "@fortawesome/free-solid-svg-icons";
import * as paper from "paper";
import { PaperTool } from "../toolbar";
import { ColorToolbox } from "../toolboxes";

export class FillTool extends PaperTool {
  public readonly name = "Remplir la forme";

  public readonly icon = icon(faFillDrip);

  public constructor(private readonly colorToolbox: ColorToolbox) {
    super();

    this.paperTool.onMouseDown = this.onMouseDown.bind(this);
  }

  public enable(): void {
    super.enable();

    this.colorToolbox.visible = true;
  }

  public disable(): void {
    super.disable();

    this.colorToolbox.visible = false;
  }

  public onMouseDown(event: paper.ToolEvent): void {
    const hit = paper.project.activeLayer.hitTest(event.downPoint);

    if (hit?.item) {
      hit.item.fillColor = this.colorToolbox.currentPaperColor;
    }
  }
}
