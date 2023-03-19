import { Player, PlayerId } from "../player";
import {
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
  SearchableRepositoryInterface,
} from "../../../../@seedwork/domain/repository/repository-contracts";

export namespace PlayerRepository {
  export type Filter = string;

  export class SearchParams extends DefaultSearchParams<Filter> {}
  export class SearchResult extends DefaultSearchResult<Player, Filter> {}

  export interface Repository
    extends SearchableRepositoryInterface<
      Player,
      PlayerId,
      Filter,
      SearchParams,
      SearchResult
    > {
    exists(name: string): Promise<boolean>;
  }
}

export default PlayerRepository;
