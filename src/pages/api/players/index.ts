// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  controller,
  createUseCase,
  listUseCase,
} from "@/backend/src/player/infra/http/controller/player-provider";
import { CreatePlayerDto } from "@/backend/src/player/infra/http/dto/create-player.dto";
import { SearchPlayerDto } from "@/backend/src/player/infra/http/dto/search-player.dto";
import { instanceToPlain } from "class-transformer";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function playersHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      await post(req, res);
      break;
    case "GET":
      await get(req, res);
      break;
    default:
      res.status(405).json({ message: "Method not allowed" });
      break;
  }
}

async function post(req: NextApiRequest, res: NextApiResponse) {
  const createPlayerDto: CreatePlayerDto = {
    name: req.body.name,
  };
  const response = await controller.create(createUseCase, createPlayerDto);
  res.status(response.status).json(response.body);
}

async function get(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req;

  // if (Object.keys(query).length === 0) {
  //   res.status(200).json("quero tudo");
  // } else {
  const searchPlayerDto = new SearchPlayerDto(query);
  const response = await controller.search(listUseCase, searchPlayerDto);
  res.status(response.status).json(instanceToPlain(response.body));
  // }
}
