export const ANALYTICS_RANGES = [
  { value: "7d", label: "7일", days: 7 },
  { value: "30d", label: "30일", days: 30 },
  { value: "90d", label: "90일", days: 90 },
] as const;

export const DEFAULT_ANALYTICS_RANGE = "7d";

/** 주간 방문자 차트가 보여주는 주 수. 기간 선택과 관계없이 최근 12주를 보여준다. */
export const ANALYTICS_WEEKLY_COUNT = 12;
