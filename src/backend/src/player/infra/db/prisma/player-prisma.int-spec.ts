import prisma from "../../../../utils/db";
import { Player } from "../../../domain/entities/player";
import { PlayerPrisma } from "./player-prisma";
import NotFoundError from "../../../../@seedwork/domain/errors/not-found.error";

const { PlayerRepository } = PlayerPrisma;

describe("Player Integration Test", () => {
  beforeEach(async () => {
    await prisma.playerModel.deleteMany();
  });
  afterEach(async () => {
    await prisma.playerModel.deleteMany();
  });

  it("should create a player", async () => {
    const entity = new Player({ name: "John Doe" });
    const repository = new PlayerRepository();
    await repository.insert(entity);
    const createdPlayer = await repository.findById(entity.id);
    expect(createdPlayer.toJSON()).toEqual(entity.toJSON());
  });

  it("should find a player by id", async () => {
    const entity = new Player({ name: "Mary Doe" });
    const repository = new PlayerRepository();
    await repository.insert(entity);
    const createdPlayer = await repository.findById(entity.id);
    expect(createdPlayer.toJSON()).toEqual(entity.toJSON());
  });

  it("should throw an error when player is not found", async () => {
    const repository = new PlayerRepository();
    expect(repository.findById("fake-id")).rejects.toThrow(
      new NotFoundError(`Entity not found using ID fake-id`)
    );
  });
});
