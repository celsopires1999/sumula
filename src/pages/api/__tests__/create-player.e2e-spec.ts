import request from "supertest";
import { CreatePlayerFixture } from "../../../backend/src/player/fixtures";
import server from "../../../backend/src/tests/server";
import prisma from "../../../backend/src/utils/db";

describe("Create Player (e2e)", () => {
  describe("/api/players (POST)", () => {
    beforeEach(async () => {
      await prisma.playerModel.deleteMany();
    });

    afterEach(async () => {
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
  });
});
