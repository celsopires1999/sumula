import { Player, PlayerId, PlayerProps } from "../player";

describe("Player Unit Test", () => {
  beforeEach(() => {
    Player.validate = jest.fn();
  });
  test("constructor of Player", () => {
    let player = new Player({
      name: "John Doe",
    });
    let props = player.props;
    expect(Player.validate).toHaveBeenCalled();
    expect(props).toStrictEqual({
      name: "John Doe",
    });
  });

  describe("id prop", () => {
    type PlayerData = {
      props: PlayerProps;
      id?: PlayerId;
    };
    const arrange: PlayerData[] = [
      { props: { name: "John Doe" } },
      { props: { name: "John Doe" }, id: null as any },
      { props: { name: "John Doe" }, id: undefined },
      { props: { name: "John Doe" }, id: new PlayerId() },
    ];
    test.each(arrange)("%#) when props are %j", (item) => {
      const player = new Player(item.props, item.id as any);
      expect(player.id).not.toBeNull();
      expect(player.entityId).toBeInstanceOf(PlayerId);
    });
  });

  test("getter and setter of name prop", () => {
    const player = new Player({ name: "John Doe" });
    expect(player.name).toBe("John Doe");

    player["name"] = "Mary Doe";
    expect(player.name).toBe("Mary Doe");
  });

  it("should update a player", () => {
    const player = new Player({
      name: "John Doe",
    });

    player.update("Mary Doe");
    expect(Player.validate).toHaveBeenCalledTimes(2);
    expect(player.name).toBe("Mary Doe");
    expect(player.props).toStrictEqual({
      name: "Mary Doe",
    });
  });

  it("should converte to JSON", () => {
    const player = new Player({
      name: "John Doe",
    });

    expect(player.toJSON()).toEqual({
      id: player.id,
      name: player.name,
    });
  });
});
