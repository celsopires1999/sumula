import server from "@/backend/src/@seedwork/tests/server";
import prisma from "@/backend/src/@seedwork/utils/db";
import { Player } from "@/backend/src/player/domain/entities/player";
import { PlayerFixture } from "@/backend/src/player/fixtures";
import { PlayerPrisma } from "@/backend/src/player/infra/db/prisma/player-prisma";
import { PlayerPresenter } from "@/backend/src/player/infra/http/presenter/player.presenter";
import { instanceToPlain } from "class-transformer";
import request from "supertest";

describe("Get Player API (e2e)", () => {
  describe("/api/players/id (GET)", () => {
    beforeEach(async () => {
      await prisma.playerModel.deleteMany();
    });
    describe("should give a response error with 422/404 when id is invalid or not found", () => {
      const arrange = [
        {
          label: "INVALID",
          id: "fake id",
          expected: {
            statusCode: 422,
            error: "Unprocessable Entity",
            message: "Validation failed (uuid v4 is expected)",
          },
        },
        {
          label: "NOT FOUND",
          id: "d0ba5077-fb6d-406f-bd05-8c521ba9425a",
          expected: {
            statusCode: 404,
            error: "Not Found",
            message:
              "Entity not found using ID d0ba5077-fb6d-406f-bd05-8c521ba9425a",
          },
        },
      ];
      test.each(arrange)("id contents: $label", ({ id, expected }) => {
        return request(server)
          .get(`/api/players/${id}`)
          .expect(expected.statusCode)
          .expect(expected);
      });
    });

    it("should get a player", async () => {
      const playerRepo = new PlayerPrisma.PlayerRepository();
      const createdPlayer = Player.fake().aPlayer().build();
      await playerRepo.insert(createdPlayer);
      const res = await request(server)
        .get(`/api/players/${createdPlayer.id}`)
        .expect(200);
      const keysInResponse = PlayerFixture.keysInResponse();
      expect(Object.keys(res.body)).toStrictEqual(["data"]);
      expect(Object.keys(res.body.data)).toStrictEqual(keysInResponse);
      const presenter = new PlayerPresenter(createdPlayer.toJSON());
      const serialized = instanceToPlain(presenter);
      expect(res.body.data).toStrictEqual(serialized);
    });
  });
});
