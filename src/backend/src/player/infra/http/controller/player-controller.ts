import { instanceToPlain } from "class-transformer";
import { validate as uuidValidate } from "uuid";
import NotFoundError from "../../../../@seedwork/domain/errors/not-found.error";
import { EntityValidationError } from "../../../../@seedwork/domain/errors/validation.error";
import { PlayerOutput } from "../../../application/dto/player-output";
import CreatePlayerUseCase from "../../../application/use-cases/create-player.use-case";
import DeletePlayerUseCase from "../../../application/use-cases/delete-player.use-case";
import GetPlayerUseCase from "../../../application/use-cases/get-player.use-case";
import ListPlayerUseCase from "../../../application/use-cases/list-player.use-case";
import UpdatePlayerUseCase from "../../../application/use-cases/update-player.use-case";
import { CreatePlayerDto } from "../dto/create-player.dto";
import { SearchPlayerDto } from "../dto/search-player.dto";
import { UpdatePlayerDto } from "../dto/update-player.dto";
import {
  PlayerCollectionPresenter,
  PlayerPresenter,
} from "../presenter/player.presenter";

export type Response = {
  status: number;
  body: any;
};

export class PlayerController {
  async create(
    createUseCase: CreatePlayerUseCase.UseCase,
    createPlayerDto: CreatePlayerDto
  ) {
    let response: Response;
    try {
      const output = await createUseCase.execute(createPlayerDto);
      response = {
        status: 201,
        body: PlayerController.playerToResponse(output),
      };
    } catch (e) {
      response = this.errorHandling(e);
    }
    return response;
  }

  async update(
    updateUseCase: UpdatePlayerUseCase.UseCase,
    updatePlayerDto: UpdatePlayerDto,
    id: string
  ) {
    let response: Response;

    if (!uuidValidate(id)) {
      return this.invalidUuidError();
    }

    try {
      const output = await updateUseCase.execute({
        id,
        ...updatePlayerDto,
      });
      response = {
        status: 200,
        body: PlayerController.playerToResponse(output),
      };
    } catch (e) {
      response = this.errorHandling(e);
    }
    return response;
  }

  async remove(deleteUseCase: DeletePlayerUseCase.UseCase, id: string) {
    let response: Response;

    if (!uuidValidate(id)) {
      return this.invalidUuidError();
    }

    try {
      await deleteUseCase.execute({ id });
      response = { status: 204, body: null };
    } catch (e) {
      response = this.errorHandling(e);
    }
    return response;
  }

  async findOne(getUseCase: GetPlayerUseCase.UseCase, id: string) {
    let response: Response;

    if (!uuidValidate(id)) {
      return this.invalidUuidError();
    }

    try {
      const output = await getUseCase.execute({ id });
      response = {
        status: 200,
        body: PlayerController.playerToResponse(output),
      };
    } catch (e) {
      response = this.errorHandling(e);
    }
    return response;
  }

  async search(
    listUseCase: ListPlayerUseCase.UseCase,
    searchParams: SearchPlayerDto
  ) {
    try {
      const output = await listUseCase.execute(searchParams);
      return {
        status: 200,
        body: instanceToPlain(new PlayerCollectionPresenter(output)),
      };
    } catch (e) {
      return this.internalServerError(e);
    }
  }

  private invalidUuidError() {
    return {
      status: 422,
      body: {
        statusCode: 422,
        error: "Unprocessable Entity",
        message: "Validation failed (uuid v4 is expected)",
      },
    };
  }

  private errorHandling(e: unknown) {
    let response: Response;

    if (e instanceof NotFoundError) {
      response = this.notFoundError(e);
    } else if (e instanceof EntityValidationError) {
      response = this.entityValidationError(e);
    } else {
      response = this.internalServerError(e);
    }

    return response;
  }

  private notFoundError(e: NotFoundError) {
    return {
      status: 404,
      body: {
        message: e.message,
        statusCode: 404,
        error: "Not Found",
      },
    };
  }

  private entityValidationError(e: EntityValidationError) {
    return {
      status: 422,
      body: {
        message: Object.values(e.error).flat(),
        statusCode: 422,
        error: "Unprocessable Entity",
      },
    };
  }

  private internalServerError(e: unknown) {
    return {
      status: 500,
      body: JSON.stringify(e),
    };
  }

  static playerToResponse(output: PlayerOutput) {
    return { data: instanceToPlain(new PlayerPresenter(output)) };
  }
}
