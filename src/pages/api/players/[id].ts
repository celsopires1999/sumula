// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import GetPlayerUseCase from "../../../backend/src/player/application/use-cases/get-player.use-case";
import { PlayerPrisma } from "../../../backend/src/player/infra/db/prisma/player-prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { PlayerPresenter } from "../../../backend/src/player/infra/http/presenter/player.presenter";
import NotFoundError from "../../../backend/src/@seedwork/domain/errors/not-found.error";

export default async function playersHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;
  const id = query.id as string;

  switch (req.method) {
    case "PUT":
      {
        console.log("PUT");
      }
      break;
    case "GET":
      {
        const repository = new PlayerPrisma.PlayerRepository();
        const getUseCase = new GetPlayerUseCase.UseCase(repository);

        try {
          const output = await getUseCase.execute({ id });
          res.status(200).json(new PlayerPresenter(output));
        } catch (e) {
          if (e instanceof NotFoundError) {
            res.status(404).json({
              message: e.message,
              statusCode: 404,
              error: "Not Found",
            });
          } else {
            res.status(500).json(JSON.stringify(e));
          }
        }
      }
      break;
    default:
      res.status(405).json({ message: "Method not allowed" });
      break;
  }
}
