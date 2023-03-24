import { PlayerOutput } from "../../../application/dto/player-output";

export class PlayerPresenter {
  id: string;
  name: string;

  constructor(output: PlayerOutput) {
    this.id = output.id;
    this.name = output.name;
  }
}
