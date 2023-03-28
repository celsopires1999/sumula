import { ListPlayersUseCase } from "./list-player.use-case";
import { Player } from "../../domain/entities/player";
import { PlayerPrisma } from "../../infra/db/prisma/player-prisma";
import { PlayerOutputMapper } from "../dto/player-output";
import prisma from "../../../utils/db";

describe("ListPlayersUseCase Integration Tests", () => {
  let useCase: ListPlayersUseCase.UseCase;
  let repository: PlayerPrisma.PlayerRepository;

  beforeEach(async () => {
    await prisma.playerModel.deleteMany();
    repository = new PlayerPrisma.PlayerRepository();
    useCase = new ListPlayersUseCase.UseCase(repository);
  });

  afterEach(async () => {
    await prisma.playerModel.deleteMany();
  });

  it("should return output sorted by name when input param is empty", async () => {
    const players = Player.fake()
      .thePlayers(2)
      .withName((index) => `John Doe${index.toString().padStart(2, "0")}`)
      .build();

    await repository.bulkInsert(players);
    const output = await useCase.execute({});
    expect(output).toEqual({
      items: [...players].map((i) => i.toJSON()),
      total: 2,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });

  describe("should search applying filter by name, sort and paginate", () => {
    const castMembers = [
      Player.fake().aPlayer().withName("test").build(),
      Player.fake().aPlayer().withName("a").build(),
      Player.fake().aPlayer().withName("TEST").build(),
      Player.fake().aPlayer().withName("e").build(),
      Player.fake().aPlayer().withName("TeSt").build(),
    ];

    let arrange = [
      {
        input: {
          page: 1,
          per_page: 2,
          sort: "name",
          filter: { name: "TEST" },
        },
        output: {
          items: [castMembers[0], castMembers[4]].map(
            PlayerOutputMapper.toOutput
          ),
          total: 3,
          current_page: 1,
          per_page: 2,
          last_page: 2,
        },
      },
      {
        input: {
          page: 2,
          per_page: 2,
          sort: "name",
          filter: { name: "TEST" },
        },
        output: {
          items: [castMembers[2]].map(PlayerOutputMapper.toOutput),
          total: 3,
          current_page: 2,
          per_page: 2,
          last_page: 2,
        },
      },
    ];

    beforeEach(async () => {
      await repository.bulkInsert(castMembers);
    });

    test.each(arrange)(
      "when value is $search_params",
      async ({ input, output: expectedOutput }) => {
        const output = await useCase.execute(input);
        expect(output).toEqual(expectedOutput);
      }
    );
  });
});
