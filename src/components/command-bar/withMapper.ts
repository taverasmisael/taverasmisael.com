import { wrapFetcher, type RequestContext } from "@solid-primitives/fetch";

export function withMapper<Result>(maper: (a: unknown) => Result): (context: RequestContext<NotRelevant, NotRelevant[]>) => void;
export function withMapper<Original, Result>(
  maper: (a: Original) => Result
): (context: RequestContext<NotRelevant, NotRelevant[]>) => void;
export function withMapper<Result, FetcherArgs extends NotRelevant[], T>(
  maper: (a: T) => Result
): (context: RequestContext<T, FetcherArgs>) => void;

export function withMapper<Original, Result>(transformer: (result: Original) => Result) {
  return (context: RequestContext<NotRelevant, NotRelevant[]>) => {
    wrapFetcher(
      context,
      originalFetcher => (requestData, info) =>
        originalFetcher(requestData, info).then((r?: Original) => {
          if (!r) return r;
          try {
            return transformer(r);
          } catch (e) {
            throw new Error("Error while transforming data");
          }
        })
    );
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NotRelevant = any;