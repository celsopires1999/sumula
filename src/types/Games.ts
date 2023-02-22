import { Place } from "./Places";

export type Game = {
  id: string;
  date: Date;
  place: Place;
  host: string;
  visitor: string;
};

export type GamePayload = {
  date: string;
  place: Place;
  host: string;
  visitor: string;
};

export type Result = Game;

export type Results = Game[];
