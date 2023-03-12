import { Place } from "./Place";
import { Team } from "./Team";

export type Game = {
  id: string;
  date: Date;
  place: Place;
  host: Team;
  visitor: Team;
};

export type GamePayload = {
  date: Date;
  place_id: string;
  host_id: string;
  visitor_id: string;
};

export type Result = Game;

export type Results = Game[];
