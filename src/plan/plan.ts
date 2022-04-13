import { Walls } from "./walls/walls";

export interface Plan {
  externalWalls: Walls;
  walls: Walls;
}
