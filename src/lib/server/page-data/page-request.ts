export type PageType = "city" | "airport" | "route";

export type PageQueryRequest = Readonly<{
  action: "get_page";
  input: Readonly<{
    page_type: PageType;
    entity_key: string;
    locale: string;
  }>;
}>;

export function createPageQueryRequest(
  pageType: PageType,
  entityKey: string,
  locale: string,
): PageQueryRequest {
  return {
    action: "get_page",
    input: {
      page_type: pageType,
      entity_key: entityKey,
      locale,
    },
  };
}
