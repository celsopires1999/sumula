import { PlayerCollectionPresenter, PlayerPresenter } from "./player.presenter";
import { instanceToPlain } from "class-transformer";
import { PaginationPresenter } from "../../../../@seedwork/infra/http/presenters/pagination.presenter";

describe("PlayerPresenter Unit Tests", () => {
  describe("constructor", () => {
    it("should set values", () => {
      const presenter = new PlayerPresenter({
        id: "61cd7b66-c215-4b84-bead-9aef0911aba7",
        name: "test",
      });

      expect(presenter.id).toBe("61cd7b66-c215-4b84-bead-9aef0911aba7");
      expect(presenter.name).toBe("test");
    });
  });

  it("should presenter data", () => {
    let presenter = new PlayerPresenter({
      id: "61cd7b66-c215-4b84-bead-9aef0911aba7",
      name: "John Doe",
    });

    let data = instanceToPlain(presenter);
    expect(data).toStrictEqual({
      id: "61cd7b66-c215-4b84-bead-9aef0911aba7",
      name: "John Doe",
    });

    presenter = new PlayerPresenter({
      id: "61cd7b66-c215-4b84-bead-9aef0911aba7",
      name: "Mary Doe",
    });

    data = instanceToPlain(presenter);
    expect(data).toStrictEqual({
      id: "61cd7b66-c215-4b84-bead-9aef0911aba7",
      name: "Mary Doe",
    });
  });
});

describe("PlayerCollectionPresenter Unit Tests", () => {
  describe("constructor", () => {
    it("should set values", () => {
      let player = {
        id: "61cd7b66-c215-4b84-bead-9aef0911aba7",
        name: "Mary Doe",
      };
      let presenter = new PlayerCollectionPresenter({
        items: [player],
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      });

      expect(presenter.meta).toBeInstanceOf(PaginationPresenter);
      expect(presenter.meta).toEqual(
        new PaginationPresenter({
          current_page: 1,
          per_page: 2,
          last_page: 3,
          total: 4,
        })
      );
      expect(presenter.data).toStrictEqual([new PlayerPresenter(player)]);

      player = {
        id: "61cd7b66-c215-4b84-bead-9aef0911aba7",
        name: "John Doe",
      };
      presenter = new PlayerCollectionPresenter({
        items: [player],
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      });

      expect(presenter.meta).toBeInstanceOf(PaginationPresenter);
      expect(presenter.meta).toEqual(
        new PaginationPresenter({
          current_page: 1,
          per_page: 2,
          last_page: 3,
          total: 4,
        })
      );
      expect(presenter.data).toStrictEqual([new PlayerPresenter(player)]);
    });
  });

  it("should presenter data", () => {
    let presenter = new PlayerCollectionPresenter({
      items: [
        {
          id: "61cd7b66-c215-4b84-bead-9aef0911aba7",
          name: "Mary Doe",
        },
      ],
      current_page: 1,
      per_page: 2,
      last_page: 3,
      total: 4,
    });

    expect(instanceToPlain(presenter)).toStrictEqual({
      meta: {
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      },
      data: [
        {
          id: "61cd7b66-c215-4b84-bead-9aef0911aba7",
          name: "Mary Doe",
        },
      ],
    });

    presenter = new PlayerCollectionPresenter({
      items: [
        {
          id: "61cd7b66-c215-4b84-bead-9aef0911aba7",
          name: "John Doe",
        },
      ],
      current_page: "1" as any,
      per_page: "2" as any,
      last_page: "3" as any,
      total: "4" as any,
    });

    expect(instanceToPlain(presenter)).toStrictEqual({
      meta: {
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      },
      data: [
        {
          id: "61cd7b66-c215-4b84-bead-9aef0911aba7",
          name: "John Doe",
        },
      ],
    });
  });
});
