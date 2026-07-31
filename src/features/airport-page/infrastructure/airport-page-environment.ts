import "server-only";

import {
  type PageDataEnvironment,
  readPageDataEnvironment,
} from "../../../lib/server/page-data-environment";

export type AirportPageEnvironment = PageDataEnvironment;

export function readAirportPageEnvironment(): AirportPageEnvironment {
  return readPageDataEnvironment();
}
