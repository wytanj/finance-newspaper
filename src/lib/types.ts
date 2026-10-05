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

/** What a robotics card proves: a real build, not a take. */
export type ProofTag = "BOM" | "repo" | "CAD" | "price" | "capacity" | "photo";

export type RoboticsBandId = "markets" | "supply" | "builders";

export type SourceLink = {
  label: string;
  url: string;
};

export type Headline = {
  id: string;
  title: string;
  dek: string;
  theme: string;
  voices: VoiceCite[];
  /** Robotics cards: visible proof badges (BOM | repo | CAD | price | capacity | photo). */
  proof?: ProofTag[];
  /** Robotics cards: which band the card belongs to. */
  band?: RoboticsBandId;
  /** Non-X primary sources (filings, product pages, repos). */
  sources?: SourceLink[];
  /** Engagement signal, e.g. "395 bookmarks · 350 likes". */
  signal?: string;
};

export type WireItem = {
  id: string;
  title: string;
  url: string;
  source: string;
  summary: string;
};

export type ActionableKind = "watch" | "move" | "decision";

export type Actionable = {
  kind: ActionableKind;
  title: string;
  detail: string;
  related?: string;
};

export type RoboticsBand = {
  id: RoboticsBandId;
  title: string;
  subtitle?: string;
  cards: Headline[];
};

export type RoboticsCostItem = {
  name: string;
  /** Display range, e.g. "13,500" or "13,500–14,700". */
  range: string;
  currency: string;
  note?: string;
  sourceUrl?: string;
  sourceLabel?: string;
};

export type RoboticsBlock = {
  masthead?: string;
  tagline?: string;
  markets?: MarketRow[];
  /** Three-band layout (markets · supply · builders). Preferred for new editions. */
  bands?: RoboticsBand[];
  /** "Cost to try" strip with verified prices. */
  costToTry?: RoboticsCostItem[];
  /** Footnote under the cost strip (verification date, caveats). */
  costNote?: string;
  /** Short editorial filter rule shown under the masthead. */
  filterNote?: string;
  /** Legacy (pre-bands) editions. */
  headlines?: Headline[];
  themes?: WeeklyTheme[];
  wire?: WireItem[];
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
  robotics: RoboticsBlock;
  actionables?: Actionable[];
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
  robotics: RoboticsBlock;
  actionables?: Actionable[];
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
  /** Section tags: "macro" | "robotics" (and future beats). */
  tags?: string[];
};

export type ArchiveDailyEntry = {
  date: string;
  masthead: string;
  tagline: string;
  lead: string;
  status: string;
  path: string;
};

export type ArchiveWeeklyEntry = {
  id: string;
  weekOf: string;
  weekEnd: string;
  masthead: string;
  tagline: string;
  lead: string;
  status: string;
  path: string;
};

export type ArchiveIndex = {
  updatedAt: string;
  daily: ArchiveDailyEntry[];
  weekly: ArchiveWeeklyEntry[];
};
