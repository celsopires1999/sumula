// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { EntityValidationError } from "../../../backend/src/@seedwork/domain/errors/validation-error";
import type { NextApiRequest, NextApiResponse } from "next";
import CreatePlayerUseCase from "../../../backend/src/player/application/use-cases/create-player.use-case";
import { PlayerPrisma } from "../../../backend/src/player/infra/db/prisma/player-prisma";
import { CreatePlayerDto } from "../../../backend/src/player/infra/http/dto/create-player.dto";
import { PlayerPresenter } from "../../../backend/src/player/infra/http/presenter/player.presenter";

export default async function playersHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const createPlayerDto: CreatePlayerDto = {
    name: req.body.name,
  };

  const repository = new PlayerPrisma.PlayerRepository();
  const createUseCase = new CreatePlayerUseCase.UseCase(repository);
  try {
    const output = await createUseCase.execute(createPlayerDto);
    res.status(201).json(new PlayerPresenter(output));
  } catch (e) {
    if (e instanceof EntityValidationError) {
      res.status(422).json({
        message: Object.values(e.error).flat(),
        statusCode: 422,
        error: "Unprocessable Entity",
      });
    } else {
      res.status(500).json(JSON.stringify(e));
    }
  }
}
