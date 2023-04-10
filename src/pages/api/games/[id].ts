// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Game } from "@/types/Game";
import { PrismaClient } from "@prisma/client";
import prisma from "../../../backend/src/@seedwork/utils/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Game | { message: string }>
) {
  // const prisma = new PrismaClient();

  const { query } = req;
  const id = query.id as string;

  switch (req.method) {
    case "PUT":
      {
        const game = await update(prisma, id, req.body);
        res.json(game);
      }
      break;
    case "GET":
      {
        const game = await findUnique(prisma, id);
        res.json(game);
      }
      break;
    default:
      res.status(405).json({ message: "Method not allowed" });
      break;
  }
}

async function update(prisma: PrismaClient, id: string, body: any) {
  const updatedGame = await prisma.gameModel.update({
    where: {
      id: id,
    },
    data: {
      date: new Date(body.date),
      place_id: body.place,
      host_id: body.host_id,
      visitor_id: body.visitor_id,
    },
  });

  return findUnique(prisma, updatedGame.id);
}

async function findUnique(prisma: PrismaClient, id: string) {
  const model = await prisma.gameModel.findUnique({
    where: { id },
    include: {
      host: true,
      place: true,
      visitor: true,
    },
  });

  const game: Game = {
    id: model?.id || "",
    date: model?.date as Date,
    place: {
      id: model?.place.id || "",
      name: model?.place.name || "",
    },
    host: {
      id: model?.host.id || "",
      name: model?.host.name || "",
    },
    visitor: {
      id: model?.visitor.id || "",
      name: model?.visitor.name || "",
    },
  };

  return game;
}
