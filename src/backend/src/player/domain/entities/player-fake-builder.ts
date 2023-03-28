import { Player, PlayerId } from "./player";
import { Chance } from "chance";

type PropOrFactory<T> = T | ((index: number) => T);
const EntityProps = {
  entity_id: "_entity_id",
  name: "_name",
} as const;
type ObjectValues<T> = T[keyof T];
type ObjectKeys<T> = keyof T;
type _EntityProps = ObjectValues<typeof EntityProps>;
type EntityProps = ObjectKeys<typeof EntityProps>;

export class PlayerFakeBuilder<TBuild = any> {
  // auto generated in entity
  private _entity_id = undefined;
  private _name: PropOrFactory<string> = (_index) => this.chance.word();
  private countObjs: number;

  static aPlayer() {
    return new PlayerFakeBuilder<Player>();
  }

  static thePlayers(countObjs: number) {
    return new PlayerFakeBuilder<Player[]>(countObjs);
  }

  private chance: Chance.Chance;

  private constructor(countObjs: number = 1) {
    this.countObjs = countObjs;
    this.chance = Chance();
  }

  withEntityId(valueOrFactory: PropOrFactory<PlayerId>) {
    this._entity_id = valueOrFactory as any;
    return this;
  }

  withName(valueOrFactory: PropOrFactory<string>) {
    this._name = valueOrFactory;
    return this;
  }

  withInvalidNameEmpty(value: "" | null | undefined) {
    this._name = value as any;
    return this;
  }

  withInvalidNameNotAString(value?: any) {
    this._name = value ?? 5;
    return this;
  }

  withInvalidNameTooLong(value?: string) {
    this._name = value ?? this.chance.word({ length: 256 });
    return this;
  }

  build(): TBuild {
    const players = new Array(this.countObjs).fill(undefined).map(
      (_, index) =>
        new Player(
          {
            name: this.callFactory(this._name, index),
          },
          !this._entity_id
            ? undefined
            : this.callFactory(this._entity_id, index)
        )
    );
    return this.countObjs === 1 ? (players[0] as any) : players;
  }

  get entity_id(): PlayerId {
    return this.getValue("entity_id");
  }

  get name(): string {
    return this.getValue("name");
  }

  private getValue(prop: EntityProps) {
    const optional = ["entity_id"];
    const privateProp: _EntityProps = `_${prop}`;
    if (!this[privateProp] && optional.includes(prop)) {
      throw new Error(
        `Property ${prop} does not have a factory, use "with" method instead`
      );
    }
    return this.callFactory(this[privateProp], 0);
  }

  private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
    return typeof factoryOrValue === "function"
      ? factoryOrValue(index)
      : factoryOrValue;
  }
}
