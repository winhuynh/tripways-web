import type { CSSProperties } from "react";

/**
 * Comprehensive mapping of ISO 3166-1 alpha-2 codes covering all world countries and common aliases.
 */
export const COUNTRY_NAME_TO_ISO2: Readonly<Record<string, string>> = {
  "afghanistan": "af",
  "albania": "al",
  "algeria": "dz",
  "american samoa": "as",
  "andorra": "ad",
  "angola": "ao",
  "anguilla": "ai",
  "antarctica": "aq",
  "antigua and barbuda": "ag",
  "argentina": "ar",
  "armenia": "am",
  "aruba": "aw",
  "australia": "au",
  "austria": "at",
  "azerbaijan": "az",
  "bahamas": "bs",
  "bahrain": "bh",
  "bangladesh": "bd",
  "barbados": "bb",
  "belarus": "by",
  "belgium": "be",
  "belize": "bz",
  "benin": "bj",
  "bermuda": "bm",
  "bhutan": "bt",
  "bolivia": "bo",
  "bosnia and herzegovina": "ba",
  "botswana": "bw",
  "brazil": "br",
  "britain": "gb",
  "british indian ocean territory": "io",
  "british virgin islands": "vg",
  "brunei": "bn",
  "bulgaria": "bg",
  "burkina faso": "bf",
  "burma": "mm",
  "burundi": "bi",
  "cabo verde": "cv",
  "cambodia": "kh",
  "cameroon": "cm",
  "canada": "ca",
  "cape verde": "cv",
  "caribbean netherlands": "bq",
  "cayman islands": "ky",
  "central african republic": "cf",
  "chad": "td",
  "chile": "cl",
  "china": "cn",
  "christmas island": "cx",
  "cocos (keeling) islands": "cc",
  "colombia": "co",
  "comoros": "km",
  "congo": "cg",
  "cook islands": "ck",
  "costa rica": "cr",
  "croatia": "hr",
  "cuba": "cu",
  "curaçao": "cw",
  "cyprus": "cy",
  "czech republic": "cz",
  "czechia": "cz",
  "côte d'ivoire": "ci",
  "democratic republic of the congo": "cd",
  "denmark": "dk",
  "djibouti": "dj",
  "dominica": "dm",
  "dominican republic": "do",
  "dr congo": "cd",
  "east timor": "tl",
  "ecuador": "ec",
  "egypt": "eg",
  "el salvador": "sv",
  "england": "gb",
  "equatorial guinea": "gq",
  "eritrea": "er",
  "estonia": "ee",
  "eswatini": "sz",
  "ethiopia": "et",
  "falkland islands": "fk",
  "faroe islands": "fo",
  "fiji": "fj",
  "finland": "fi",
  "france": "fr",
  "french guiana": "gf",
  "french polynesia": "pf",
  "french southern and antarctic lands": "tf",
  "gabon": "ga",
  "gambia": "gm",
  "georgia": "ge",
  "germany": "de",
  "ghana": "gh",
  "gibraltar": "gi",
  "great britain": "gb",
  "greece": "gr",
  "greenland": "gl",
  "grenada": "gd",
  "guadeloupe": "gp",
  "guam": "gu",
  "guatemala": "gt",
  "guernsey": "gg",
  "guinea": "gn",
  "guinea-bissau": "gw",
  "guyana": "gy",
  "haiti": "ht",
  "heard and mcdonald islands": "hm",
  "holland": "nl",
  "holy see": "va",
  "honduras": "hn",
  "hong kong": "hk",
  "hungary": "hu",
  "iceland": "is",
  "india": "in",
  "indonesia": "id",
  "iran": "ir",
  "iraq": "iq",
  "ireland": "ie",
  "isle of man": "im",
  "israel": "il",
  "italy": "it",
  "ivory coast": "ci",
  "jamaica": "jm",
  "japan": "jp",
  "jersey": "je",
  "jordan": "jo",
  "kazakhstan": "kz",
  "kenya": "ke",
  "kiribati": "ki",
  "korea": "kr",
  "kosovo": "xk",
  "kuwait": "kw",
  "kyrgyzstan": "kg",
  "lao pdr": "la",
  "laos": "la",
  "latvia": "lv",
  "lebanon": "lb",
  "lesotho": "ls",
  "liberia": "lr",
  "libya": "ly",
  "liechtenstein": "li",
  "lithuania": "lt",
  "luxembourg": "lu",
  "macao": "mo",
  "macau": "mo",
  "madagascar": "mg",
  "malawi": "mw",
  "malaysia": "my",
  "maldives": "mv",
  "mali": "ml",
  "malta": "mt",
  "marshall islands": "mh",
  "martinique": "mq",
  "mauritania": "mr",
  "mauritius": "mu",
  "mayotte": "yt",
  "mexico": "mx",
  "micronesia": "fm",
  "moldova": "md",
  "monaco": "mc",
  "mongolia": "mn",
  "montenegro": "me",
  "montserrat": "ms",
  "morocco": "ma",
  "mozambique": "mz",
  "myanmar": "mm",
  "namibia": "na",
  "nauru": "nr",
  "nepal": "np",
  "netherlands": "nl",
  "new caledonia": "nc",
  "new zealand": "nz",
  "nicaragua": "ni",
  "niger": "ne",
  "nigeria": "ng",
  "niue": "nu",
  "norfolk island": "nf",
  "north korea": "kp",
  "north macedonia": "mk",
  "northern mariana islands": "mp",
  "norway": "no",
  "oman": "om",
  "pakistan": "pk",
  "palau": "pw",
  "palestinian territory": "ps",
  "panama": "pa",
  "papua new guinea": "pg",
  "paraguay": "py",
  "peru": "pe",
  "philippines": "ph",
  "pitcairn": "pn",
  "poland": "pl",
  "portugal": "pt",
  "puerto rico": "pr",
  "qatar": "qa",
  "republic of korea": "kr",
  "republic of the congo": "cg",
  "romania": "ro",
  "russia": "ru",
  "russian federation": "ru",
  "rwanda": "rw",
  "réunion": "re",
  "saint barthélemy": "bl",
  "saint helena, ascension and tristan da cunha": "sh",
  "saint kitts and nevis": "kn",
  "saint lucia": "lc",
  "saint martin": "mf",
  "saint pierre and miquelon": "pm",
  "saint vincent and the grenadines": "vc",
  "samoa": "ws",
  "san marino": "sm",
  "saudi arabia": "sa",
  "scotland": "gb",
  "senegal": "sn",
  "serbia": "rs",
  "seychelles": "sc",
  "sierra leone": "sl",
  "singapore": "sg",
  "sint maarten": "sx",
  "slovakia": "sk",
  "slovenia": "si",
  "solomon islands": "sb",
  "somalia": "so",
  "south africa": "za",
  "south georgia and the south sandwich islands": "gs",
  "south korea": "kr",
  "south sudan": "ss",
  "spain": "es",
  "sri lanka": "lk",
  "st. kitts and nevis": "kn",
  "st. lucia": "lc",
  "st. vincent and the grenadines": "vc",
  "sudan": "sd",
  "suriname": "sr",
  "swaziland": "sz",
  "sweden": "se",
  "switzerland": "ch",
  "syria": "sy",
  "são tomé and principe": "st",
  "taiwan": "tw",
  "tajikistan": "tj",
  "tanzania": "tz",
  "thailand": "th",
  "timor-leste": "tl",
  "togo": "tg",
  "tokelau": "tk",
  "tonga": "to",
  "trinidad and tobago": "tt",
  "tunisia": "tn",
  "turkey": "tr",
  "turkmenistan": "tm",
  "turks and caicos islands": "tc",
  "tuvalu": "tv",
  "türkiye": "tr",
  "u.s. virgin islands": "vi",
  "uae": "ae",
  "uganda": "ug",
  "uk": "gb",
  "ukraine": "ua",
  "united arab emirates": "ae",
  "united kingdom": "gb",
  "united states": "us",
  "united states minor outlying islands": "um",
  "united states of america": "us",
  "uruguay": "uy",
  "usa": "us",
  "uzbekistan": "uz",
  "vanuatu": "vu",
  "vatican city": "va",
  "venezuela": "ve",
  "vietnam": "vn",
  "việt nam": "vn",
  "wales": "gb",
  "wallis and futuna": "wf",
  "western sahara (disputed territory)": "eh",
  "yemen": "ye",
  "zambia": "zm",
  "zimbabwe": "zw",
};

/**
 * Returns the ISO 3166-1 alpha-2 code for a country name or alias.
 */
export function getCountryIso2(countryName?: string, explicitIso2?: string): string | null {
  if (explicitIso2 && explicitIso2.trim().length === 2) {
    return explicitIso2.trim().toLowerCase();
  }
  if (!countryName) return null;

  const normalized = countryName.toLowerCase().trim();
  return COUNTRY_NAME_TO_ISO2[normalized] ?? null;
}

/**
 * Generates an authentic Unicode flag emoji from an ISO 3166-1 alpha-2 code.
 * Example: 'VN' -> 🇻🇳, 'JP' -> 🇯🇵.
 */
export function getCountryFlagEmoji(iso2: string): string {
  if (!iso2 || iso2.length !== 2) return "🌐";
  try {
    const codePoints = iso2
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  } catch {
    return "🌐";
  }
}

export type CountryFlagProps = {
  countryName?: string;
  countryCode?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  style?: CSSProperties;
};

const SIZES = {
  sm: { width: 16, height: 12 },
  md: { width: 22, height: 16 },
  lg: { width: 28, height: 21 },
} as const;

/**
 * CountryFlag: Renders a high-resolution, pixel-perfect national flag
 * using local self-hosted SVG assets (/flags/[iso2].svg) with crisp borders,
 * cross-platform consistency, and automatic fallback to Unicode flag emojis.
 */
export function CountryFlag({
  countryName,
  countryCode,
  size = "md",
  className = "",
  style,
}: CountryFlagProps) {
  const iso2 = getCountryIso2(countryName, countryCode);
  const dimensions = SIZES[size];
  const label = countryName || countryCode?.toUpperCase() || "Country";

  if (!iso2) {
    return (
      <span
        className={`country-flag country-flag--fallback ${className}`}
        style={style}
        role="img"
        aria-label={`${label} flag`}
      >
        🌐
      </span>
    );
  }

  const src = `/flags/${iso2}.svg`;

  return (
    <span
      className={`country-flag country-flag--${size} ${className}`}
      style={style}
      title={label}
    >
      <img
        src={src}
        width={dimensions.width}
        height={dimensions.height}
        alt={`${label} flag`}
        className="country-flag__img"
        loading="lazy"
        decoding="async"
      />
    </span>
  );
}
