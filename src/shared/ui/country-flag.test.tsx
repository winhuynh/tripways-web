import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CountryFlag, getCountryFlagEmoji, getCountryIso2 } from "./country-flag";

describe("CountryFlag & Country Utilities", () => {
  it("resolves ISO-2 codes for known countries and aliases", () => {
    expect(getCountryIso2("Vietnam")).toBe("vn");
    expect(getCountryIso2("Japan")).toBe("jp");
    expect(getCountryIso2("United States")).toBe("us");
    expect(getCountryIso2("USA")).toBe("us");
    expect(getCountryIso2("United Kingdom")).toBe("gb");
    expect(getCountryIso2("UK")).toBe("gb");
    expect(getCountryIso2("South Korea")).toBe("kr");
    expect(getCountryIso2("Korea")).toBe("kr");
    expect(getCountryIso2("Maldives")).toBe("mv");
    expect(getCountryIso2("Qatar")).toBe("qa");
    expect(getCountryIso2(undefined, "TH")).toBe("th");
  });

  it("generates authentic Unicode flag emojis from ISO-2 codes", () => {
    expect(getCountryFlagEmoji("VN")).toBe("🇻🇳");
    expect(getCountryFlagEmoji("JP")).toBe("🇯🇵");
    expect(getCountryFlagEmoji("US")).toBe("🇺🇸");
    expect(getCountryFlagEmoji("GB")).toBe("🇬🇧");
    expect(getCountryFlagEmoji("TH")).toBe("🇹🇭");
    expect(getCountryFlagEmoji("")).toBe("🌐");
  });

  it("renders local self-hosted SVG img tag for identified countries", () => {
    const html = renderToStaticMarkup(<CountryFlag countryName="Japan" />);
    expect(html).toContain('src="/flags/jp.svg"');
    expect(html).toContain('alt="Japan flag"');
    expect(html).toContain('class="country-flag__img"');
  });

  it("renders local SVG flag when explicit countryCode is provided", () => {
    const html = renderToStaticMarkup(<CountryFlag countryCode="VN" countryName="Vietnam" />);
    expect(html).toContain('src="/flags/vn.svg"');
    expect(html).toContain('alt="Vietnam flag"');
  });

  it("renders fallback globe for completely unknown countries", () => {
    const html = renderToStaticMarkup(<CountryFlag countryName="AtlantisFantasyWorld" />);
    expect(html).toContain("🌐");
    expect(html).not.toContain("/flags/");
  });
});
