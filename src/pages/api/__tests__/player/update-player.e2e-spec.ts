import { Player } from "@/backend/src/player/domain/entities/player";
import PlayerRepository from "@/backend/src/player/domain/repository/player.repository";
import { UpdatePlayerFixture } from "@/backend/src/player/fixtures";
import { PlayerPrisma } from "@/backend/src/player/infra/db/prisma/player-prisma";
import { PlayerPresenter } from "@/backend/src/player/infra/http/presenter/player.presenter";
import server from "@/backend/src/@seedwork/tests/server";
import prisma from "@/backend/src/@seedwork/utils/db";
import { instanceToPlain } from "class-transformer";
import request from "supertest";

describe("Update Player API (e2e)", () => {
  const uuid = "4b1f1c5e-67d8-4142-a286-fae0b1d6032a";
  describe("/api/players/id (PUT)", () => {
    describe("should give a response error with 422 when throw EntityValidationError", () => {
      const arrange = UpdatePlayerFixture.arrangeForEntityValidationError();
      let playerRepo: PlayerRepository.Repository;

      beforeEach(async () => {
        await prisma.playerModel.deleteMany();
        playerRepo = new PlayerPrisma.PlayerRepository();
      });

      test.each(arrange)(
        "body contents: $label",
        async ({ send_data, expected }) => {
          const player = Player.fake().aPlayer().build();
          await playerRepo.insert(player);
          return request(server)
            .put(`/api/players/${player.id}`)
            .send(send_data)
            .expect(422)
            .expect(expected);
        }
      );
    });

    describe("should give a response error with 422/404 when id is invalid or not found", () => {
      const faker = Player.fake().aPlayer();
      const arrange = [
        {
          label: "INVALID",
          id: "fake id",
          send_data: { name: faker.name },
          expected: {
            statusCode: 422,
            error: "Unprocessable Entity",
            message: "Validation failed (uuid v4 is expected)",
          },
        },
        {
          label: "NOT FOUND",
          id: "d0ba5077-fb6d-406f-bd05-8c521ba9425a",
          send_data: { name: faker.name },
          expected: {
            statusCode: 404,
            error: "Not Found",
            message:
              "Entity not found using ID d0ba5077-fb6d-406f-bd05-8c521ba9425a",
          },
        },
      ];
      test.each(arrange)(
        "id contents: $label",
        ({ id, send_data, expected }) => {
          return request(server)
            .put(`/api/players/${id}`)
            .send(send_data)
            .expect(expected.statusCode)
            .expect(expected);
        }
      );
    });

    describe("should update a player", () => {
      const arrange = UpdatePlayerFixture.arrangeForSave();
      let playerRepo: PlayerRepository.Repository;

      beforeEach(async () => {
        await prisma.playerModel.deleteMany();
        playerRepo = new PlayerPrisma.PlayerRepository();
      });

      test.each(arrange)(
        "when body is $send_data",
        async ({ send_data, expected }) => {
          const createdPlayer = Player.fake().aPlayer().build();
          await playerRepo.insert(createdPlayer);
          const res = await request(server)
            .put(`/api/players/${createdPlayer.id}`)
            .send(send_data)
            .expect(200);
          const keysInResponse = UpdatePlayerFixture.keysInResponse();
          expect(Object.keys(res.body)).toStrictEqual(["data"]);
          expect(Object.keys(res.body.data)).toStrictEqual(keysInResponse);
          const id = res.body.data.id;
          const updatedPlayer = await playerRepo.findById(id);

          const presenter = new PlayerPresenter(updatedPlayer.toJSON());
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
