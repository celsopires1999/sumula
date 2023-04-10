import { NotFoundError } from "@/backend/src/@seedwork/domain/errors/not-found.error";
import { Player } from "@/backend/src/player/domain/entities/player";
import { PlayerPrisma } from "@/backend/src/player/infra/db/prisma/player-prisma";
import server from "@/backend/src/@seedwork/tests/server";
import request from "supertest";

describe("Delete Player API (e2e)", () => {
  describe("/api/players/id (DELETE)", () => {
    describe("should return a response error when id is invalid or not found", () => {
      const arrange = [
        {
          id: "51683e7d-0842-4913-a768-f7bb0be5bfcc",
          expected: {
            message:
              "Entity not found using ID 51683e7d-0842-4913-a768-f7bb0be5bfcc",
            statusCode: 404,
            error: "Not Found",
          },
        },
        {
          id: "fake id",
          expected: {
            message: "Validation failed (uuid v4 is expected)",
            statusCode: 422,
            error: "Unprocessable Entity",
          },
        },
      ];

      test.each(arrange)("with id is $id", ({ id, expected }) => {
        return request(server)
          .delete(`/api/players/${id}`)
          .expect(expected.statusCode)
          .expect(expected);
      });
    });

    it("should delete a player with response status 204 ", async () => {
      const playerRepo = new PlayerPrisma.PlayerRepository();
      const player = Player.fake().aPlayer().build();
      playerRepo.insert(player);

      await request(server).delete(`/api/players/${player.id}`).expect(204);

      await expect(playerRepo.findById(player.id)).rejects.toThrowError(
        new NotFoundError(`Entity not found using ID ${player.id}`)
      );
    });
  });
});
