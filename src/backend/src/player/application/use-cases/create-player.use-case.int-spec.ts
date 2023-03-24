import { PlayerPrisma } from "../../infra/db/prisma/player-prisma";
import { CreatePlayerUseCase } from "./create-player.use-case";
import prisma from "../../../utils/db";

const { PlayerRepository } = PlayerPrisma;

describe("CreatePlayerUseCase Integration Tests", () => {
  let repository: PlayerPrisma.PlayerRepository;
  let useCase: CreatePlayerUseCase.UseCase;

  beforeEach(async () => {
    await prisma.playerModel.deleteMany();
  });

  afterEach(async () => {
    await prisma.playerModel.deleteMany();
  });

  beforeEach(() => {
    repository = new PlayerRepository();
    useCase = new CreatePlayerUseCase.UseCase(repository);
  });

  it("should create a player", async () => {
    const output = await useCase.execute({ name: "John Doe" });
    const foundPlayer = await repository.findById(output.id);
    expect(output.name).toBe(foundPlayer.name);
  });
});
