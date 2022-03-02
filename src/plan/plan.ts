import * as paper from 'paper';

export class Plan {

    walls: paper.Path = new paper.Path();

    public initialize(): Plan {
        paper.view.center = new paper.Point(0, 0);
        this.walls.strokeColor = new paper.Color('#e9e9ff');
        this.walls.selected = true;
        return this;
    }

    public addSegment(x: paper.Point): void
    {
        this.walls.add(x);
    }

    public removeLast(): void
    {
        this.walls.removeSegment(this.walls.segments.length - 1);
    }
}
