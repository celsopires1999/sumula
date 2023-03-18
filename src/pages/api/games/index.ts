// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { GamePayload, Game } from "@/types/Game";
// import { PrismaClient } from "@prisma/client";
import { prisma } from "@/backend/src/utils/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Game | { message: string }>
) {
  // const prisma = new PrismaClient();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const gameData: GamePayload = {
    date: new Date(req.body.date),
    place_id: req.body.place_id,
    host_id: req.body.host_id,
    visitor_id: req.body.visitor_id,
  };

  const savedGame = await prisma.gameModel.create({
    data: gameData,
  });

  const model = await prisma.gameModel.findUnique({
    where: { id: savedGame.id },
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

  res.json(game);
}
