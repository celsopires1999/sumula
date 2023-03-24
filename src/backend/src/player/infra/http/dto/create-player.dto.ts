import { CreatePlayerUseCase } from "../../../application/use-cases/create-player.use-case";
import { IsNotEmpty, IsString } from "class-validator";
export class CreatePlayerDto implements CreatePlayerUseCase.Input {
  @IsString()
  @IsNotEmpty()
  name!: string;
}
