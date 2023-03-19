import { prismaMock } from "../../../../../utils/singleton";
import { PlayerModel } from "@prisma/client";
import { Player } from "../../../entities/player";
import { PlayerRepository } from "./player-prisma";

describe("Player Unit Test", () => {
  it("should insert a player", () => {
    const entity = new Player({ name: "John Doe" });
    const model: PlayerModel = {
      id: entity.id,
      name: entity.name,
      created_at: new Date(),
      update_at: new Date(),
    };
    prismaMock.playerModel.create.mockResolvedValue(model);

    const repository = new PlayerRepository();
    expect(repository.insert(entity)).resolves.not.toThrow();
  });

  it("should throw an error on inserting a player", () => {
    const entity = new Player({ name: "John Doe" });
    prismaMock.playerModel.create.mockRejectedValue(
      new Error("database error")
    );

    const repository = new PlayerRepository();
    expect(repository.insert(entity)).rejects.toThrow("database error");
  });
});
