export type MarketRow = {
  key: string;
  label: string;
  symbol: string;
  price: number | null;
  changePct: number | null;
  spark: number[];
  currency?: string;
  asOf?: string;
  source: string;
};

export type VoiceCite = {
  handle: string;
  name: string;
  postId: string;
  url: string;
  snippet: string;
};

export type Headline = {
  id: string;
  title: string;
  dek: string;
  theme: string;
  voices: VoiceCite[];
};

export type WireItem = {
  id: string;
  title: string;
  url: string;
  source: string;
  summary: string;
};

export type DailyEdition = {
  edition: "daily";
  date: string;
  timezone: string;
  publishedAt: string;
  generatedAt: string;
  status: string;
  masthead: string;
  tagline: string;
  lead: string;
  markets: MarketRow[];
  headlines: Headline[];
  wire: WireItem[];
  sourcesNote: string;
};

export type WeeklyTheme = {
  title: string;
  body: string;
  handles: string[];
};

export type WeeklyEdition = {
  edition: "weekly";
  weekOf: string;
  weekEnd: string;
  timezone: string;
  publishedAt: string;
  generatedAt: string;
  status: string;
  masthead: string;
  tagline: string;
  lead: string;
  themes: WeeklyTheme[];
  marketsSnapshot: MarketRow[];
  wire: WireItem[];
  sourcesNote: string;
};

export type Voice = {
  handle: string;
  name: string;
  role: string;
  seed: boolean;
  id: string;
  note?: string;
  active?: boolean;
};
