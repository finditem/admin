/**
 * 서비스 통계 조회 기간입니다. `days`가 있으면 오늘을 포함한 최근 N일이고, 없으면 달력 기준 기간입니다.
 * `previousLabel`은 증감 비교에 쓰는 기간의 이름입니다.
 */
export const ANALYTICS_RANGES = [
  { value: "1d", label: "최근 1일", previousLabel: "이전 1일", days: 1 },
  { value: "3d", label: "최근 3일", previousLabel: "이전 3일", days: 3 },
  { value: "7d", label: "최근 7일", previousLabel: "이전 7일", days: 7 },
  { value: "30d", label: "최근 30일", previousLabel: "이전 30일", days: 30 },
  { value: "90d", label: "최근 90일", previousLabel: "이전 90일", days: 90 },
  { value: "thisWeek", label: "이번 주", previousLabel: "지난주 같은 기간" },
  { value: "thisMonth", label: "이번 달", previousLabel: "지난달 같은 기간" },
  { value: "lastMonth", label: "저번 달", previousLabel: "전전달" },
] as const;

export const DEFAULT_ANALYTICS_RANGE = "7d";

/** 주간 방문자 차트가 보여주는 주 수. 기간 선택과 관계없이 최근 12주를 보여준다. */
export const ANALYTICS_WEEKLY_COUNT = 12;
