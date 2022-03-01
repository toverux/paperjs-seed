import './toolbox.scss';

export abstract class Toolbox {
    protected abstract readonly title: string;

    protected element?: HTMLElement;

    public constructor() {
    }

    public get visible(): boolean {
        return this.element?.style.display == 'flex';
    }

    public set visible(value: boolean) {
        if (this.element) {
            this.element.style.display = value ? 'flex' : 'none';
        }
    }

    public createElement(): HTMLElement {
        this.element = document.createElement('div');

        this.element.style.display = 'none';
        this.element.classList.add('toolbox');

        const titleElement = document.createElement('div');

        titleElement.classList.add('toolbox-title');
        titleElement.innerText = this.title;

        this.element.appendChild(titleElement);

        return this.element;
    }
}
