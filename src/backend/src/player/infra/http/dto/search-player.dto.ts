import { SortDirection } from "@/backend/src/@seedwork/domain/repository/repository-contracts";

type Query = Partial<{
  [key: string]: string | string[];
}>;

export class SearchPlayerDto {
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: SortDirection;
  filter?: {
    name?: string;
  };

  constructor(query: Query) {
    (this.page = query["page"] ? +query["page"] : undefined),
      (this.per_page = query["per_page"] ? +query["per_page"] : undefined),
      (this.sort = query["sort"] ? (query["sort"] as string) : undefined),
      (this.sort_dir = query["sort_dir"]
        ? (query["sort_dir"] as SortDirection)
        : undefined),
      (this.filter = query["filter[name]"]
        ? { name: query["filter[name]"] as string }
        : undefined);
  }
}
