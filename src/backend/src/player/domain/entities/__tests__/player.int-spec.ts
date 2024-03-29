import { Player } from "./../player";

describe("Player Integration Tests", () => {
  describe("create method", () => {
    it("should throw an error when name is invalid ", () => {
      expect(() => new Player({ name: null } as any)).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });
      expect(() => new Player({ name: "" } as any)).containsErrorMessages({
        name: ["name should not be empty"],
      });

      expect(() => new Player({ name: 5 as any } as any)).containsErrorMessages(
        {
          name: [
            "name must be a string",
            "name must be shorter than or equal to 255 characters",
          ],
        }
      );

      expect(
        () => new Player({ name: "t".repeat(256) } as any)
      ).containsErrorMessages({
        name: ["name must be shorter than or equal to 255 characters"],
      });
    });
  });

  describe("update method", () => {
    it("should throw an error when name is invalid", () => {
      const player = new Player({
        name: "John Doe",
      });
      expect(() => player.update(null as any)).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(() => player.update("")).containsErrorMessages({
        name: ["name should not be empty"],
      });

      expect(() => player.update(5 as any)).containsErrorMessages({
        name: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(() => player.update("t".repeat(256))).containsErrorMessages({
        name: ["name must be shorter than or equal to 255 characters"],
      });
    });

    it("should update a player with valid properties", () => {
      expect.assertions(0);
      const player = new Player({
        name: "John Doe",
      });
      player.update("Mary Doe");
    });
  });
});
