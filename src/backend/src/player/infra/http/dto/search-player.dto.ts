type Query = Partial<{
  [key: string]: string | string[];
}>;

export class SearchPlayerDto {
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: string;
  filter?: {
    name?: string;
  };

  constructor(query: Query) {
    (this.page = query["page"] ? +query["page"] : undefined),
      (this.per_page = query["per_page"] ? +query["per_page"] : undefined),
      (this.sort = query["sort"] ? (query["per_page"] as string) : undefined),
      (this.filter = query["filter[name]"]
        ? { name: query["filter[name]"] as string }
        : undefined);
  }
}
