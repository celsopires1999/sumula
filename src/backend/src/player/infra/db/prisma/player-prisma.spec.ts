import { prismaMock } from "../../../../utils/singleton";
import { PlayerModel, Prisma } from "@prisma/client";
import { Player, PlayerId } from "../../../domain/entities/player";
import { PlayerPrisma } from "./player-prisma";
import NotFoundError from "../../../../@seedwork/domain/errors/not-found.error";

const { PlayerRepository } = PlayerPrisma;

describe("Player Unit Test", () => {
  it("should insert a player", async () => {
    const entity = new Player({ name: "John Doe" });
    const model: PlayerModel = {
      id: entity.id,
      name: entity.name,
      created_at: new Date(),
      update_at: new Date(),
    };
    prismaMock.playerModel.create.mockResolvedValue(model);

    const repository = new PlayerRepository();
    expect(repository.insert(entity)).resolves.not.toThrow();
  });

  it("should throw an error on inserting a player", async () => {
    const entity = new Player({ name: "John Doe" });
    prismaMock.playerModel.create.mockRejectedValue(
      new Error("database error")
    );

    const repository = new PlayerRepository();
    expect(repository.insert(entity)).rejects.toThrow("database error");
  });

  it("should find a player by Id", async () => {
    const entity = new Player({ name: "John Doe" });
    const model: PlayerModel = {
      id: entity.id,
      name: entity.name,
      created_at: new Date(),
      update_at: new Date(),
    };
    prismaMock.playerModel.findUniqueOrThrow.mockResolvedValue(model);
    const expectedPlayer = new Player(
      { name: entity.name },
      new PlayerId(entity.id)
    );
    const repository = new PlayerRepository();
    const foundPlayer = await repository.findById(entity.id);

    expect(foundPlayer.toJSON()).toEqual(expectedPlayer.toJSON());
  });

  it("should throw an error when player is not found", async () => {
    const entity = new Player({ name: "John Doe" });
    prismaMock.playerModel.findUniqueOrThrow.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("Not Found", {
        code: "P2025",
        clientVersion: "v1",
      })
    );

    const repository = new PlayerRepository();
    expect(repository.findById(entity.id)).rejects.toThrow(
      new NotFoundError(`Entity not found using ID ${entity.id}`)
    );
  });
});
