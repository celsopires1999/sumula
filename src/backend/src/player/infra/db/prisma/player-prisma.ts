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

    async search(
      props: PlayerRepositoryContract.SearchParams
    ): Promise<PlayerRepositoryContract.SearchResult> {
      const offset = (props.page - 1) * props.per_page;
      const limit = props.per_page;

      // let where: { name?: { mode: "insensitive"; contains: string } } = {};
      // let orderBy: { name?: "asc" | "desc" } = {};
      let where: any = {};
      let orderBy: any = {};

      if (props.filter && props.filter.name) {
        where.name = { mode: "insensitive", contains: props.filter.name };
      }
      orderBy =
        props.sort && this.sortableFields.includes(props.sort)
          ? { [props.sort]: props.sort_dir }
          : { name: "asc" };

      const [count, models] = await prisma.$transaction([
        prisma.playerModel.count({
          where,
        }),
        prisma.playerModel.findMany({
          skip: offset,
          take: limit,
          where,
          orderBy,
        }),
      ]);

      return new PlayerRepositoryContract.SearchResult({
        items: models.map((m) => PlayerModelMapper.toEntity(m)),
        current_page: props.page,
        per_page: props.per_page,
        total: count,
        filter: props.filter,
        sort: props.sort,
        sort_dir: props.sort_dir,
      });
    }

    async insert(entity: Player): Promise<void> {
      await prisma.playerModel.create({
        data: entity.toJSON(),
      });
    }
    async bulkInsert(entities: Player[]): Promise<void> {
      const data = entities.map((e) => e.toJSON());
      const batchPayload = await prisma.playerModel.createMany({
        data,
      });

      if (batchPayload.count !== data.length) {
        throw new Error(
          `Not all players have been created. Requested: ${data.length}, Done: ${batchPayload.count}`
        );
      }
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

    async findAll(): Promise<Player[]> {
      const models = await prisma.playerModel.findMany();
      return models.map((m) => PlayerModelMapper.toEntity(m));
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
