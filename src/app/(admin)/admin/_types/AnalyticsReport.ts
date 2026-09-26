import { ANALYTICS_RANGES } from "../_constants/ANALYTICS_RANGES";

export type AnalyticsRange = (typeof ANALYTICS_RANGES)[number]["value"];

export interface AnalyticsSummaryValues {
  activeUsers: number;
  newUsers: number;
  sessions: number;
  pageViews: number;
  /** GA `sign_up` 이벤트 수 */
  signUps: number;
  /** GA `post_complete` 이벤트 수 */
  postCompletes: number;
}

export interface AnalyticsSummary {
  current: AnalyticsSummaryValues;
  /** 선택한 기간 바로 앞의 같은 길이 기간 */
  previous: AnalyticsSummaryValues;
}

export interface DailyActiveUsers {
  /** `YYYY-MM-DD` */
  date: string;
  activeUsers: number;
}

export interface WeeklyActiveUsers {
  /** 그 주 월요일, `YYYY-MM-DD` */
  weekStart: string;
  activeUsers: number;
}

export interface SearchTermCount {
  term: string;
  count: number;
}

export interface TrafficSourceCount {
  source: string;
  /** GA 기본 채널 그룹 (Direct, Organic Search 등) */
  channel: string;
  /** 기간 중 이 경로로 들어온 방문자 수. 같은 사람이 여러 번 들어와도 1명으로 센다. */
  users: number;
}

export interface TopPageView {
  path: string;
  title: string;
  views: number;
}

export interface AnalyticsReport {
  summary: AnalyticsSummary;
  daily: DailyActiveUsers[];
  weekly: WeeklyActiveUsers[];
  searchTerms: SearchTermCount[];
  trafficSources: TrafficSourceCount[];
  topPages: TopPageView[];
}

/** GA Data API 응답에서 쓰는 부분만 좁힌 타입입니다. */
export interface GaReportRow {
  dimensionValues?: { value?: string | null }[] | null;
  metricValues?: { value?: string | null }[] | null;
}

export interface GaReport {
  dimensionHeaders?: { name?: string | null }[] | null;
  rows?: GaReportRow[] | null;
}

export interface GaReports {
  summary: GaReport;
  events: GaReport;
  daily: GaReport;
  weekly: GaReport;
  searchTerms: GaReport;
  trafficSources: GaReport;
  topPages: GaReport;
}
