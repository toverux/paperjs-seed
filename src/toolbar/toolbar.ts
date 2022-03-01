import { Tool } from './tool';
import './toolbar.scss';

export class Toolbar {
    private readonly elementByTool = new Map<Tool, HTMLElement>();

    private enabledTool?: Tool;

    public static create(host: HTMLElement): Toolbar {
        const toolbarElement = document.createElement('div');

        toolbarElement.classList.add('toolbar');

        host.appendChild(toolbarElement);

        return new Toolbar(toolbarElement);
    }

    private constructor(private readonly element: HTMLElement) {
    }

    public addTool(tool: Tool): void {
        const toolElement = document.createElement('div');

        this.elementByTool.set(tool, toolElement);

        toolElement.title = tool.name;
        toolElement.classList.add('tool');

        toolElement.appendChild(tool.icon.node[0]);

        toolElement.addEventListener('click', () => this.toggleTool(tool));

        this.element.appendChild(toolElement);
    }

    private toggleTool(tool: Tool): void {
        if (this.enabledTool) {
            this.enabledTool.disable?.();

            const toolElement = this.elementByTool.get(this.enabledTool)!;
            toolElement.classList.remove('active');
        }

        if (tool == this.enabledTool) {
            this.enabledTool = undefined;
            return;
        }

        tool.enable();

        const toolElement = this.elementByTool.get(tool)!;
        toolElement.classList.add('active');

        this.enabledTool = tool;
    }
}
