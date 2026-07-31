import "server-only";

import {
  type PageDataEnvironment,
  readPageDataEnvironment,
} from "../../../lib/server/page-data-environment";

export type CityPageEnvironment = PageDataEnvironment;

/**
 * Reads server-only City Page Edge configuration and derives the default Edge
 * endpoint without exposing credentials to client components.
 */
export function readCityPageEnvironment(): CityPageEnvironment {
  return readPageDataEnvironment();
}
