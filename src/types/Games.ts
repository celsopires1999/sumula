export type Game = {
  id: string;
  date: Date;
  place: string;
  host: string;
  visitor: string;
};

export type Result = {
  data: Game;
};

export type Results = {
  data: Game[];
};
