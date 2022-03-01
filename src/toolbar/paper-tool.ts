import * as paper from 'paper';
import { Tool } from './tool';

export abstract class PaperTool extends Tool {
    protected readonly paperTool = new paper.Tool();

    private static readonly neutralTool = new paper.Tool();

    public enable(): void {
        this.paperTool.activate();
    }

    public disable(): void {
        PaperTool.neutralTool.activate();
    }
}
