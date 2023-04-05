import { validate as uuidValidate } from "uuid";
import NotFoundError from "../../../../@seedwork/domain/errors/not-found.error";
import { EntityValidationError } from "../../../../@seedwork/domain/errors/validation.error";
import CreatePlayerUseCase from "../../../application/use-cases/create-player.use-case";
import GetPlayerUseCase from "../../../application/use-cases/get-player.use-case";
import ListPlayerUseCase from "../../../application/use-cases/list-player.use-case";
import { CreatePlayerDto } from "../dto/create-player.dto";
import { SearchPlayerDto } from "../dto/search-player.dto";
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
        body: new PlayerPresenter(output),
      };
    } catch (e) {
      if (e instanceof EntityValidationError) {
        response = {
          status: 422,
          body: {
            message: Object.values(e.error).flat(),
            statusCode: 422,
            error: "Unprocessable Entity",
          },
        };
      } else {
        response = {
          status: 500,
          body: JSON.stringify(e),
        };
      }
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
        body: new PlayerPresenter(output),
      };
    } catch (e) {
      if (e instanceof NotFoundError) {
        response = this.notFoundError(e);
      } else {
        response = {
          status: 500,
          body: JSON.stringify(e),
        };
      }
    }
    return response;
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

  async search(
    listUseCase: ListPlayerUseCase.UseCase,
    searchParams: SearchPlayerDto
  ) {
    try {
      const output = await listUseCase.execute(searchParams);
      return {
        status: 200,
        body: new PlayerCollectionPresenter(output),
      };
    } catch (e) {
      return {
        status: 500,
        body: JSON.stringify(e),
      };
    }
  }
}
