import * as paper from 'paper';
import { Toolbox } from '../toolbox';
import './color-toolbox.scss';

export class ColorToolbox extends Toolbox {
    protected readonly title = 'Couleur';

    private static readonly colors = [
        '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50',
        '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B'
    ];

    private currentColorElement?: HTMLInputElement;

    public get currentColor(): string {
        if (!this.currentColorElement) {
            throw new Error(`${this.createElement.name} was not called!`);
        }

        return this.currentColorElement.value;
    }

    public get currentPaperColor(): paper.Color {
        return new paper.Color(this.currentColor);
    }

    public createElement(): HTMLElement {
        const element = super.createElement();

        element.classList.add('color-toolbox');

        const colorsElement = document.createElement('div');

        this.currentColorElement = document.createElement('input');

        this.currentColorElement.type = 'color';
        this.currentColorElement.value = ColorToolbox.colors[ColorToolbox.colors.length - 1];
        this.currentColorElement.classList.add('input-current-color');

        element.appendChild(this.currentColorElement);

        colorsElement.classList.add('palette');

        for (const color of ColorToolbox.colors) {
            const colorElement = document.createElement('div');

            colorElement.style.backgroundColor = color;
            colorElement.classList.add('palette-color');

            colorElement.addEventListener('click', () => this.currentColorElement!.value = color);

            colorsElement.appendChild(colorElement);
        }

        element.appendChild(colorsElement);

        return element;
    }
}
