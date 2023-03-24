// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Results, Team, TeamPayload } from "@/types/Team";
import { PrismaClient } from "@prisma/client";
import prisma from "../../../backend/src/utils/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Results | Team | { message: string }>
) {
  // const prisma = new PrismaClient();

  switch (req.method) {
    case "POST":
      {
        const team = await create(prisma, req.body);
        res.json(team);
      }
      break;
    case "GET":
      {
        const teams = await findMany(prisma);
        res.json(teams);
      }
      break;
    default:
      res.status(405).json({ message: "Method not allowed" });
      break;
  }
}

async function findMany(prisma: PrismaClient): Promise<Team[]> {
  const models = await prisma.teamModel.findMany();

  return models.map((team) => ({
    id: team.id,
    name: team.name,
  }));
}

async function create(prisma: PrismaClient, body: any) {
  const teamData: TeamPayload = {
    name: body.name,
  };

  const savedTeam = await prisma.teamModel.create({
    data: teamData,
  });

  const team: Team = {
    id: savedTeam.id,
    name: savedTeam.name,
  };

  return team;
}
