import { Toolbox } from './toolbox';
import './toolboxes-container.scss';

export class ToolboxesContainer {
    public static create(host: HTMLElement): ToolboxesContainer {
        const element = document.createElement('div');

        element.classList.add('toolboxes-container');

        host.appendChild(element);

        return new ToolboxesContainer(element);
    }

    private constructor(private readonly element: HTMLElement) {
    }

    public addToolbox(toolbox: Toolbox): void {
        this.element.appendChild(toolbox.createElement());
    }
}
