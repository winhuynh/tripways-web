import type { HomePageReadModel } from "../domain/home-page-model";

const homePageReadModel: HomePageReadModel = {
  issueLabel: "A global mobility journal — Issue 01",
  hero: {
    headingLead: "Discover",
    headingEmphasis: "where",
    headingTail: "the world connects.",
    description:
      "Tripways maps the unseen corridors of human mobility. From bustling hubs to silent nodes, we visualize the precision of global logistics.",
    ctaLabel: "Search routes",
    ctaHref: "/flights-from/bangkok#route-search",
  },
  directories: [
    {
      key: "airport",
      inventoryLabel: "Inventory 01",
      title: "Explore by Airport",
      href: "/airports/suvarnabhumi-bkk",
      icon: "airport",
    },
    {
      key: "city",
      inventoryLabel: "Inventory 02",
      title: "Explore by City",
      href: "/flights-from/bangkok",
      icon: "city",
    },
    {
      key: "country",
      inventoryLabel: "Inventory 03",
      title: "Explore by Country",
      href: "/flights-from/bangkok#destinations",
      icon: "country",
    },
    {
      key: "region",
      inventoryLabel: "Inventory 04",
      title: "Explore by Region",
      href: "/flights-from/singapore",
      icon: "region",
    },
    {
      key: "airline",
      inventoryLabel: "Inventory 05",
      title: "Explore Airlines",
      href: "/flights-from/bangkok#airlines",
      icon: "airline",
    },
  ],
  corridors: [
    {
      key: "bangkok-singapore",
      origin: "Bangkok",
      destination: "Singapore",
      href: "/flights-from/bangkok#destinations",
    },
    {
      key: "singapore-bangkok",
      origin: "Singapore",
      destination: "Bangkok",
      href: "/flights-from/singapore#destinations",
    },
  ],
  valuePropositions: [
    {
      key: "discover",
      title: "Discover destinations.",
      description:
        "Navigate the world's most intricate connections with our curated city guides and direct-route data.",
      tone: "primary",
    },
    {
      key: "visualize",
      title: "Visualize connections.",
      description:
        "Route pathing and node mapping provide a clear look at how cities bridge geographical divides through air.",
      tone: "accent",
    },
    {
      key: "understand",
      title: "Understand mobility.",
      description:
        "Mobility is more than movement; it is the pulse of the global economy. We organize the data that makes it visible.",
      tone: "neutral",
    },
  ],
  corridorStory: {
    eyebrow: "Network spotlight",
    title: "The routes that shape global mobility.",
    imagePath: "/figma/home/corridor-flight.jpg",
    imageAlt: "Passenger aircraft flying above a layer of clouds",
  },
};

/**
 * Returns the reviewed editorial read model used to render the homepage.
 * Keeping this projection outside JSX makes future data-source replacement
 * local to the application layer.
 */
export function getHomePageReadModel(): HomePageReadModel {
  return homePageReadModel;
}
