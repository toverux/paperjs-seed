import * as paper from 'paper';

export class Plan {
    public initialize(): void {
        paper.view.center = new paper.Point(0, 0);

        const decagon = new paper.Path.RegularPolygon(new paper.Point(0, 0), 10, 200);

        decagon.fillColor = new paper.Color('#e9e9ff');
        decagon.selected = true;
    }
}
