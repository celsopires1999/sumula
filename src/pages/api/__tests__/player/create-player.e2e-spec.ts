import server from "@/backend/src/@seedwork/tests/server";
import prisma from "@/backend/src/@seedwork/utils/db";
import { PlayerRepository } from "@/backend/src/player/domain/repository/player.repository";
import { CreatePlayerFixture } from "@/backend/src/player/fixtures";
import { PlayerPrisma } from "@/backend/src/player/infra/db/prisma/player-prisma";
import { PlayerPresenter } from "@/backend/src/player/infra/http/presenter/player.presenter";
import { instanceToPlain } from "class-transformer";
import request from "supertest";

describe("Create Player (e2e)", () => {
  describe("/api/players (POST)", () => {
    beforeEach(async () => {
      await prisma.playerModel.deleteMany();
    });

    describe("should give a response error with 422 when throw EntityValidationError", () => {
      const arrange = CreatePlayerFixture.arrangeForEntityValidationError();

      test.each(arrange)("when body is $label", ({ send_data, expected }) => {
        return request(server)
          .post(`/api/players`)
          .send(send_data)
          .expect(422)
          .expect(expected);
      });
    });

    describe("should create a player", () => {
      const arrange = CreatePlayerFixture.arrangeForSave();
      let playerRepo: PlayerRepository.Repository;

      beforeEach(async () => {
        playerRepo = new PlayerPrisma.PlayerRepository();
      });
      test.each(arrange)(
        "when body is $send_data",
        async ({ send_data, expected }) => {
          const res = await request(server)
            .post(`/api/players`)
            .send(send_data)
            .expect(201);
          const keysInResponse = CreatePlayerFixture.keysInResponse();
          expect(Object.keys(res.body)).toStrictEqual(["data"]);
          expect(Object.keys(res.body.data)).toStrictEqual(keysInResponse);
          const id = res.body.data.id;
          const player = await playerRepo.findById(id);
          const presenter = new PlayerPresenter(player.toJSON());
          const serialized = instanceToPlain(presenter);
          expect(res.body.data).toStrictEqual(serialized);
          expect(res.body.data).toStrictEqual({
            id: serialized.id,
            ...expected,
          });
        }
      );
    });
  });
});
