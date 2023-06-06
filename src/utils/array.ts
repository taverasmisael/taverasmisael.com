import { sort, pipe, map } from "rambda";

export const shuffle: <T>(arr: T[]) => T[] = pipe(
  map(v => ({ order: Math.random(), v })),
  sort((a, b) => a.order - b.order),
  map(v => v.v)
);
