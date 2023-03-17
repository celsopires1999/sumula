import ClassValidatorFields from "../../../@seedwork/domain/validators/class-validator-fields";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { PlayerProps } from "../entities/player";

export class PlayerRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  //@ts-expect-error
  name: string;

  constructor({ name }: PlayerProps) {
    Object.assign(this, { name });
  }
}

export class PlayerValidator extends ClassValidatorFields<PlayerRules> {
  validate(data: PlayerProps): boolean {
    return super.validate(new PlayerRules(data ?? ({} as any)));
  }
}

export class PlayerValidatorFactory {
  static create() {
    return new PlayerValidator();
  }
}

export default PlayerValidatorFactory;
