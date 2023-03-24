import { Player } from "../../domain/entities/player";

export type PlayerOutput = {
  id: string;
  name: string;
};

export class PlayerOutputMapper {
  static toOutput(entity: Player): PlayerOutput {
    return entity.toJSON();
  }
}
