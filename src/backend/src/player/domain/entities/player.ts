import AggregateRoot from "../../../@seedwork/domain/entities/aggregate-root";
import { EntityValidationError } from "../../../@seedwork/domain/errors/validation.error";
import UniqueEntityId from "../../../@seedwork/domain/value-objects/unique-entity-id.vo";
import PlayerValidatorFactory from "../validators/player.validator";
import { PlayerFakeBuilder } from "./player-fake-builder";

export type PlayerProps = {
  name: string;
};

export type PlayerPropsJson = Required<{ id: string } & PlayerProps>;

export class PlayerId extends UniqueEntityId {}

export class Player extends AggregateRoot<
  PlayerId,
  PlayerProps,
  PlayerPropsJson
> {
  constructor(public readonly props: PlayerProps, entityId?: PlayerId) {
    Player.validate(props);
    super(props, entityId ?? new PlayerId());
  }

  get name(): string {
    return this.props.name;
  }

  private set name(value: string) {
    this.props.name = value;
  }

  update(name: string) {
    Player.validate({ name });
    this.name = name;
  }

  static validate(props: PlayerProps) {
    const validator = PlayerValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }

  static fake() {
    return PlayerFakeBuilder;
  }

  toJSON(): PlayerPropsJson {
    return {
      id: this.id.toString(),
      ...this.props,
    } as PlayerPropsJson;
  }
}
