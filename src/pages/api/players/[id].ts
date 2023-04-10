// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  controller,
  deleteUseCase,
  getUseCase,
  updateUseCase,
} from "@/backend/src/player/infra/http/controller/player-provider";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function playersHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;
  const id = query.id as string;

  switch (req.method) {
    case "PUT":
      await put(req, res, id);
      break;
    case "GET":
      await get(req, res, id);
      break;
    case "DELETE":
      await remove(req, res, id);
      break;
    default:
      res.status(405).json({ message: "Method not allowed" });
      break;
  }
}

async function get(_req: NextApiRequest, res: NextApiResponse, id: string) {
  const response = await controller.findOne(getUseCase, id);
  res.status(response.status).json(response.body);
}

async function put(req: NextApiRequest, res: NextApiResponse, id: string) {
  const response = await controller.update(updateUseCase, req.body, id);
  res.status(response.status).json(response.body);
}

async function remove(_req: NextApiRequest, res: NextApiResponse, id: string) {
  const response = await controller.remove(deleteUseCase, id);
  res.status(response.status).json(response.body);
}
