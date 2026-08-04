# Advertising Variant Design

## Goal

Create two advertising variants for Homepage, City Hub, and Airport Hub without modifying the existing ad-free screens. The variants must demonstrate monetization inventory without distracting from route discovery or reducing trust.

## Variant sets

Create desktop and mobile screens for every page in both sets:

- `Display Ads`: standard programmatic advertising placeholders only
- `Hybrid Ads`: a mix of standard display advertising and clearly labelled native travel sponsorships

Keep all existing screens unchanged as the `Without Ads` reference set.

## Density rules

- Desktop: two to three advertising placements per page
- Mobile: one to two placements per page
- Never place advertising above the primary search or route-discovery action
- Never interrupt a form, map interaction, table row group, FAQ item, or another active task
- Place advertising only between complete content sections
- Do not use sticky ads, popups, interstitials, autoplay, fake system UI, or disguised organic content
- Reserve stable space for every placement to avoid layout shift
- Use clear `Advertisement` or `Sponsored` labels

## Homepage placements

### Display Ads

- One display unit after the interactive map
- One display unit before the directory or footer on desktop
- Mobile keeps only the post-map unit unless spacing permits a second unit near the footer

### Hybrid Ads

- One display unit after the interactive map
- One native `Sponsored travel partners` module after featured routes
- Native content may show contextual flight, hotel, eSIM, or insurance partners without imitating organic route cards

## City Hub placements

### Display Ads

- One display unit after the route map
- One display unit after the complete direct-flight table
- One display unit before FAQ on desktop
- Mobile keeps the post-map and post-route-table placements

### Hybrid Ads

- One display unit after the route map
- One native flight-comparison module after the direct-flight table
- One native hotel or airport-transfer module after the airports-serving-the-city section
- Mobile keeps no more than two total placements

## Airport Hub placements

### Display Ads

- One display unit after the route map
- One display unit after airport facilities
- One display unit before FAQ on desktop
- Mobile keeps the post-map and post-facilities placements

### Hybrid Ads

- One display unit after the route map
- One native airport-hotel or ground-transfer module after access and transport
- One native lounge, parking, or car-rental module after facilities
- Mobile keeps no more than two total placements

## Visual treatment

- Preserve the TripWays warm ivory, navy, blue, editorial typography, spacing, header, and footer
- Display ads use a neutral reserved rectangle with a subtle border and `Advertisement` label
- Native modules use a distinct sponsored treatment and must not copy the visual hierarchy of organic route cards
- Sponsored CTAs must be explicit, such as `View sponsored offer`, `Compare partner options`, or `Check availability`

## Acceptance criteria

- Twelve new screens exist: six Display Ads and six Hybrid Ads
- The original six ad-free screens remain unchanged
- Screen names clearly identify page, breakpoint, and advertising variant
- Advertising never appears above the primary action
- Homepage, City Hub, and Airport Hub retain their complete existing information architecture
- Mobile has no horizontal overflow and no more than two advertising placements per page
