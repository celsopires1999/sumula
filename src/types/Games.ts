export type Game = {
  id: string;
  date: Date;
  place: string;
  host: string;
  visitor: string;
};

export type GamePayload = {
  date: string;
  place: string;
  host: string;
  visitor: string;
};

export type Result = Game;

export type Results = Game[];
