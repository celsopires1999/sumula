import { CollectionPresenter } from "@/backend/src/@seedwork/infra/http/presenters/collection.presenter";
import { PlayerOutput } from "../../../application/dto/player-output";
import ListPlayersUseCase from "../../../application/use-cases/list-player.use-case";

export class PlayerPresenter {
  id: string;
  name: string;

  constructor(output: PlayerOutput) {
    this.id = output.id;
    this.name = output.name;
  }
}

export class PlayerCollectionPresenter extends CollectionPresenter {
  data: PlayerPresenter[];

  constructor(output: ListPlayersUseCase.Output) {
    const { items, ...paginationProps } = output;
    super(paginationProps);
    this.data = items.map((item) => new PlayerPresenter(item));
  }
}
