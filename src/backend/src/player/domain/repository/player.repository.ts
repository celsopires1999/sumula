import { Player, PlayerId } from "../entities/player";
import {
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
  SearchableRepositoryInterface,
  SearchProps,
} from "../../../@seedwork/domain/repository/repository-contracts";

export namespace PlayerRepository {
  export type Filter = {
    name?: string;
  };

  export class SearchParams extends DefaultSearchParams<Filter> {
    private constructor(props: SearchProps<Filter> = {}) {
      super(props);
    }

    get filter(): Filter | null {
      return this._filter;
    }

    protected set filter(value: Filter | null) {
      const _value =
        !value || (value as unknown) === "" || typeof value !== "object"
          ? null
          : value;

      const filter = {
        ...(_value?.name && { name: `${_value?.name}` }),
      };

      this._filter = Object.keys(filter).length === 0 ? null : filter;
    }

    static create(
      props: Omit<SearchProps<Filter>, "filter"> & {
        filter?: {
          name?: string | null;
        } | null;
      } = {}
    ) {
      return new SearchParams({
        ...props,
        filter: {
          name: props.filter?.name || undefined,
        },
      });
    }
  }
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
