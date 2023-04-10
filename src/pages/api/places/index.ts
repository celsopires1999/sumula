// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Place, PlacePayload, Results } from "@/types/Place";
import { PrismaClient } from "@prisma/client";
import prisma from "../../../backend/src/@seedwork/utils/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Results | Place | { message: string }>
) {
  // const prisma = new PrismaClient();

  switch (req.method) {
    case "POST":
      {
        const place = await create(prisma, req.body);
        res.json(place);
      }
      break;
    case "GET":
      {
        const place = await findMany(prisma);
        res.json(place);
      }
      break;
    default:
      res.status(405).json({ message: "Method not allowed" });
      break;
  }
}

async function findMany(prisma: PrismaClient): Promise<Place[]> {
  const models = await prisma.placeModel.findMany();

  return models.map((place) => ({
    id: place.id,
    name: place.name,
  }));
}

async function create(prisma: PrismaClient, body: any) {
  const placeData: PlacePayload = {
    name: body.name,
  };

  const savedPlace = await prisma.placeModel.create({
    data: placeData,
  });

  const team: Place = {
    id: savedPlace.id,
    name: savedPlace.name,
  };

  return team;
}
