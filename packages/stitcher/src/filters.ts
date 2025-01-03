import type { MasterPlaylist } from "./parser";

export interface Filter {
  resolution?: string;
  audioLanguage?: string;
}

function parseRange(input: string): [number, number] | null {
  const match = input.match(/^(\d+)-(\d+)$/);

  if (match?.[1] && match[2]) {
    const min = parseInt(match[1]);
    const max = parseInt(match[2]);
    return [min, max];
  }

  return null;
}

function parseOperatorToRange(input: string): [number, number] | null {
  const match = input.match(/(<=?|>=?)\s*(\d+)/);
  if (match?.[2] === undefined) {
    return null;
  }

  const operator = match[1];
  const number = parseInt(match[2]);

  if (operator === "<=") {
    return [0, number];
  } else if (operator === "<") {
    return [0, number - 1];
  } else if (operator === ">=") {
    return [number, Infinity];
  } else if (operator === ">") {
    return [number + 1, Infinity];
  }

  return null;
}

function parseFilterToRange(input: string): [number, number] {
  let range = parseRange(input);
  if (range) {
    return range;
  }

  range = parseOperatorToRange(input);
  if (range) {
    return range;
  }

  throw new Error(`Failed to parse to range "${input}"`);
}

function parseFilterToList(input: string) {
  return input.split(",").map((value) => value.trim());
}

export function filterMasterPlaylist(master: MasterPlaylist, filter: Filter) {
  if (filter.resolution !== undefined) {
    const [min, max] = parseFilterToRange(filter.resolution);
    master.variants = master.variants.filter(
      (variant) =>
        // If we have no height, we'll make it pass.
        !variant.resolution?.height ||
        // If the variant height is within our range.
        (variant.resolution.height >= min && variant.resolution.height <= max),
    );
  }
  if (filter.audioLanguage !== undefined) {
    const list = parseFilterToList(filter.audioLanguage);
    master.variants.filter((variant) => {
      variant.audio = variant.audio.filter(
        (audio) => !audio.language || list.includes(audio.language),
      );
    });
  }
}

export function getFilterFromQuery(query: Record<string, string>) {
  const filter: Filter = {};
  if ("filter.resolution" in query) {
    filter.resolution = query["filter.resolution"];
  }
  if ("filter.audioLanguage" in query) {
    filter.audioLanguage = query["filter.audioLanguage"];
  }
  return filter;
}

export function getQueryParamsFromFilter(filter: Filter) {
  const queryParams: Record<string, string> = {};

  Object.entries(filter).forEach(([key, value]) => {
    queryParams[`filter.${key}`] = value;
  });

  return queryParams;
}
