import { PlayerModel, Prisma } from "@prisma/client";
import { LoadEntityError } from "../../../../@seedwork/domain/errors/load-entity.error";
import NotFoundError from "../../../../@seedwork/domain/errors/not-found.error";
import { EntityValidationError } from "../../../../@seedwork/domain/errors/validation-error";
import prisma from "../../../../utils/db";
import { Player, PlayerId } from "../../../domain/entities/player";
import { PlayerRepository as PlayerRepositoryContract } from "../../../domain/repository/player.repository";

export namespace PlayerPrisma {
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

    async findById(id: string | PlayerId): Promise<Player> {
      let _id = `${id}`;
      if (typeof id !== "string") {
        _id = id.value;
      }
      const model = await this._get(_id);
      return PlayerModelMapper.toEntity(model);
    }

    private async _get(id: string) {
      try {
        return await prisma.playerModel.findUniqueOrThrow({
          where: { id },
        });
      } catch (e) {
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === "P2025"
        ) {
          throw new NotFoundError(`Entity not found using ID ${id}`);
        } else {
          throw e;
        }
      }
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

  export class PlayerModelMapper {
    static toEntity(model: PlayerModel) {
      const { id, name } = model;
      try {
        return new Player({ name }, new PlayerId(id));
      } catch (e) {
        if (e instanceof EntityValidationError) {
          throw new LoadEntityError(e.error);
        }

        throw e;
      }
    }
  }
}
