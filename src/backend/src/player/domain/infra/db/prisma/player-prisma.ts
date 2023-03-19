import { Player, PlayerId } from "../../../entities/player";
import { PlayerRepository as PlayerRepositoryContract } from "../../../entities/repository/player.repository";
import prisma from "../../../../../utils/db";

export class PlayerRepository implements PlayerRepositoryContract.Repository {
  exists(name: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  sortableFields: string[] = ["name"];

  search(
    props: PlayerRepositoryContract.SearchParams
  ): Promise<PlayerRepositoryContract.SearchResult> {
    throw new Error("Method not implemented.");
  }
  async insert(entity: Player): Promise<void> {
    await prisma.playerModel.create({
      data: { id: entity.id, name: entity.name },
    });
  }
  bulkInsert(entities: Player[]): Promise<void> {
    throw new Error("Method not implemented.");
  }
  findById(id: string | PlayerId): Promise<Player> {
    throw new Error("Method not implemented.");
  }
  findAll(): Promise<Player[]> {
    throw new Error("Method not implemented.");
  }
  update(entity: Player): Promise<void> {
    throw new Error("Method not implemented.");
  }
  delete(id: string | PlayerId): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
