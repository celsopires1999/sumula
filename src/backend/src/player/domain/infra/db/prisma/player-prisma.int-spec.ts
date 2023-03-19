import prisma from "../../../../../utils/db";
import { Player } from "../../../entities/player";
import { PlayerRepository } from "./player-prisma";

describe("Player Integration Test", () => {
  beforeEach(async () => {
    await prisma.playerModel.deleteMany();
  });
  afterEach(async () => {
    await prisma.playerModel.deleteMany();
  });

  it("should create a player", () => {
    const entity = new Player({ name: "John Doe" });
    const repository = new PlayerRepository();
    expect(repository.insert(entity)).resolves.not.toThrow();
  });
});
