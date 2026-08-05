import "server-only";

import { readPageDataEnvironment } from "../page-data-environment";
import { requestPageData } from "../page-data-transport";
import { readRpcData } from "./page-envelope";
import { createPageQueryRequest, type PageType } from "./page-request";

type LoadPageModelInput<T> = Readonly<{
  pageType: PageType;
  entityKey: string;
  locale: string;
  parse(value: unknown): T;
  fetchImpl?: typeof fetch;
}>;

export async function loadPageModel<T>(input: LoadPageModelInput<T>): Promise<T> {
  const environment = readPageDataEnvironment();
  return requestPageData({
    url: environment.pageQueryUrl,
    anonKey: environment.supabaseAnonKey,
    body: createPageQueryRequest(input.pageType, input.entityKey, input.locale),
    cacheIdentity: `page:${input.pageType}:${input.entityKey}:${input.locale}`,
    timeoutMs: environment.timeoutMs,
    notFoundCodes: ["ERR_PAGE_NOT_FOUND"],
    unavailableCode: "ERR_PAGE_DATA_UNAVAILABLE",
    createError: (code) => new Error(code),
    parse: (value) => input.parse(readRpcData(value)),
    fetchImpl: input.fetchImpl,
  });
}
