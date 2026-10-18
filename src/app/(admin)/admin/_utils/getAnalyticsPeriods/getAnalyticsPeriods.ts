import { StatisticsPeriod } from "@/api/fetch/admin";
import { ANALYTICS_RANGES } from "../../_constants/ANALYTICS_RANGES";
import { AnalyticsRange } from "../../_types/AnalyticsReport";

const DAY_MS = 24 * 60 * 60 * 1000;
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

const toYmd = (time: number) => new Date(time).toISOString().slice(0, 10);

const toPeriod = (start: number, end: number): StatisticsPeriod => ({
  startDate: toYmd(start),
  endDate: toYmd(end),
});

/**
 * 한국 시간 기준으로 선택한 기간과 증감 비교에 쓰는 기간을 `YYYY-MM-DD`로 구합니다. 양끝 날짜를 모두 포함합니다.
 *
 * @remarks
 * - 최근 N일은 오늘을 포함한 N일이고, 비교 기간은 바로 앞 N일입니다.
 * - 이번 주(월요일부터)와 이번 달은 지난주, 지난달의 같은 날까지와 비교합니다. 지난달에 같은 날이 없으면 말일까지입니다.
 * - 저번 달은 그 앞 달 전체와 비교합니다.
 */
export const getAnalyticsPeriods = (
  now: Date,
  range: AnalyticsRange
): { current: StatisticsPeriod; previous: StatisticsPeriod } => {
  const kstNow = new Date(now.getTime() + KST_OFFSET_MS);
  const year = kstNow.getUTCFullYear();
  const month = kstNow.getUTCMonth();
  const date = kstNow.getUTCDate();
  const today = Date.UTC(year, month, date);

  const item = ANALYTICS_RANGES.find((option) => option.value === range) ?? ANALYTICS_RANGES[0];

  if ("days" in item) {
    const start = today - (item.days - 1) * DAY_MS;
    return {
      current: toPeriod(start, today),
      previous: toPeriod(start - item.days * DAY_MS, start - DAY_MS),
    };
  }

  switch (item.value) {
    case "thisWeek": {
      const weekday = (kstNow.getUTCDay() + 6) % 7;
      const start = today - weekday * DAY_MS;
      return {
        current: toPeriod(start, today),
        previous: toPeriod(start - 7 * DAY_MS, today - 7 * DAY_MS),
      };
    }
    case "thisMonth":
      return {
        current: toPeriod(Date.UTC(year, month, 1), today),
        // Date.UTC(year, month, 0)은 지난달 말일이다.
        previous: toPeriod(
          Date.UTC(year, month - 1, 1),
          Math.min(Date.UTC(year, month - 1, date), Date.UTC(year, month, 0))
        ),
      };
    case "lastMonth":
      return {
        current: toPeriod(Date.UTC(year, month - 1, 1), Date.UTC(year, month, 0)),
        previous: toPeriod(Date.UTC(year, month - 2, 1), Date.UTC(year, month - 1, 0)),
      };
  }
};
