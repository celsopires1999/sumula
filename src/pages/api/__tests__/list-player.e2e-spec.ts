import { instanceToPlain } from "class-transformer";
import { PlayerRepository } from "../../../backend/src/player/domain/repository/player.repository";
import server from "../../../backend/src/tests/server";
import qs from "qs";
import request from "supertest";
import { PlayerPrisma } from "../../../backend/src/player/infra/db/prisma/player-prisma";
import { ListPlayerFixture } from "../../../backend/src/player/fixtures";
import { PlayerCollectionPresenter } from "../../../backend/src/player/infra/http/presenter/player.presenter";
import prisma from "../../../backend/src/utils/db";

describe("List Player (e2e)", () => {
  describe("/api/players (GET)", () => {
    describe("should return players ordered by name when query is empty", () => {
      let playerRepo: PlayerRepository.Repository;
      const { arrange, entitiesMap } = ListPlayerFixture.arrange();
      const entities = Object.values(entitiesMap);

      beforeEach(async () => {
        await prisma.playerModel.deleteMany();
        playerRepo = new PlayerPrisma.PlayerRepository();
        await playerRepo.bulkInsert(entities);
      });

      afterEach(async () => {
        await prisma.playerModel.deleteMany();
      });

      test.each(arrange)(
        "when query_params is {page: $send_data.page, per_page: $send_data.per_page}",
        async ({ send_data, expected }) => {
          const queryParams = new URLSearchParams(send_data as any).toString();
          const res = await request(server)
            .get(`/api/players?${queryParams}`)
            .expect(200);
          expect(Object.keys(res.body)).toStrictEqual(["data", "meta"]);
          const presenter = new PlayerCollectionPresenter(expected);
          const serialized = instanceToPlain(presenter);
          expect(res.body).toEqual(serialized);
        }
      );
    });

    describe("should return players using paginate, sort and filter", () => {
      let playerRepo: PlayerRepository.Repository;
      const { arrange, entitiesMap } = ListPlayerFixture.arrangeUnsorted();
      const entities = Object.values(entitiesMap);

      beforeEach(async () => {
        await prisma.playerModel.deleteMany();
        playerRepo = new PlayerPrisma.PlayerRepository();
        await playerRepo.bulkInsert(entities);
      });

      afterEach(async () => {
        await prisma.playerModel.deleteMany();
      });

      test.each(arrange)(
        "when query_params is {filter: $send_data.filter, sort: $send_data.sort, page: $send_data.page, per_page: $send_data.per_page}",
        async ({ send_data, expected }) => {
          const queryParams = qs.stringify(send_data);
          const res = await request(server)
            .get(`/api/players?${queryParams}`)
            .expect(200);
          expect(Object.keys(res.body)).toStrictEqual(["data", "meta"]);
          const presenter = new PlayerCollectionPresenter(expected);
          const serialized = instanceToPlain(presenter);
          expect(res.body).toEqual(serialized);
        }
      );
    });
  });
});
