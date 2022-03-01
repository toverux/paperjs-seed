import { project } from 'paper';
import { Toolbox } from '../toolbox';
import * as paper from 'paper';

export class SaveToolbox extends Toolbox {
    protected readonly title = 'Projet';

    public constructor() {
        super();
    }

    public createElement(): HTMLElement {
        const element = super.createElement();

        const saveButtonElement = document.createElement('button');

        saveButtonElement.classList.add('btn');
        saveButtonElement.appendChild(document.createTextNode('Sauvegarder (localStorage)'));

        saveButtonElement.addEventListener('click', () => this.saveProject());

        element.appendChild(saveButtonElement);

        const restoreButtonElement = document.createElement('button');

        restoreButtonElement.classList.add('btn');
        restoreButtonElement.appendChild(document.createTextNode('Restaurer'));

        restoreButtonElement.addEventListener('click', () => this.restoreProject());

        element.appendChild(restoreButtonElement);

        this.visible = true;

        return element;
    }

    private saveProject(): void {
        const json = paper.project.exportJSON();

        localStorage.setItem('planEditorSave', json);
    }

    private restoreProject(): void {
        const json = localStorage.getItem('planEditorSave');

        if (json) {
            project.clear();
            project.importJSON(json);
        }
    }
}
