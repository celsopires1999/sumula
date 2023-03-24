// import server from "nextjs-http-supertest";
import server from "../../../backend/src/tests/server";
import request from "supertest";
import { CreatePlayerFixture } from "../../../backend/src/player/infra/http/fixtures";

describe("Create Player (e2e)", () => {
  describe("/api/players (POST)", () => {
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
