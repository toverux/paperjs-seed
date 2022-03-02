import { icon } from '@fortawesome/fontawesome-svg-core';
import { faDrawPolygon } from '@fortawesome/free-solid-svg-icons';
import { Plan } from '../plan';
import { PaperTool } from '../toolbar';

export class WallBuilderTool extends PaperTool {
    public readonly name = 'Construire des murs';

    public readonly icon = icon(faDrawPolygon);

    public constructor(private readonly plan: Plan) {
        super();

        this.paperTool.onMouseDown = this.onMouseDown.bind(this);
        this.paperTool.onKeyDown = this.onKeyDown.bind(this);
    }

    public onMouseDown(event: paper.ToolEvent): void {
        this.plan.addSegment(event.downPoint);
    }

    public onKeyDown(event: any): void
    {
        if (event.modifiers.control && event.key.charCodeAt(0) === 122) {
            this.plan.removeLast();
        }
    }
}
