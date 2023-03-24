// import server from "nextjs-http-supertest";
import request from "supertest";
import server from "../../../backend/src/tests/server";

describe("Get Player API (e2e)", () => {
  describe("/api/players/id (GET)", () => {
    describe("should give a response error with 422/404 when id is invalid or not found", () => {
      const arrange = [
        // {
        //   label: 'INVALID',
        //   id: 'fake id',
        //   expected: {
        //     statusCode: 422,
        //     error: 'Unprocessable Entity',
        //     message: 'Validation failed (uuid v4 is expected)',
        //   },
        // },
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
  });
});
