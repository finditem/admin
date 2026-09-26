import {
  AnalyticsReport,
  AnalyticsSummaryValues,
  GaReport,
  GaReports,
  TopPageView,
} from "../../_types/AnalyticsReport";
import { isoWeekToMonday } from "../isoWeekToMonday/isoWeekToMonday";

const toNumber = (value?: string | null) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

/** GA의 `YYYYMMDD` 날짜를 `YYYY-MM-DD`로 바꿉니다. */
const toIsoDate = (gaDate: string) =>
  `${gaDate.slice(0, 4)}-${gaDate.slice(4, 6)}-${gaDate.slice(6, 8)}`;

const dimensionIndex = (report: GaReport, name: string) =>
  (report.dimensionHeaders ?? []).findIndex((header) => header.name === name);

const dimension = (row: NonNullable<GaReport["rows"]>[number], index: number) =>
  index < 0 ? "" : (row.dimensionValues?.[index]?.value ?? "");

/** 운영 앱 페이지 제목 끝의 서비스 이름을 떼어 목록에서 짧게 보이게 합니다. */
const trimServiceName = (title: string) => title.replace(/\s*\|\s*찾아줘!.*$/, "").trim();

const IGNORED_VALUES = new Set(["", "(not set)", "(data not available)"]);

/**
 * 기간 비교가 들어간 요약 응답과 이벤트 응답에서 `current`, `previous` 두 기간의 값을 꺼냅니다.
 * 여러 기간을 한 번에 조회하면 GA가 `dateRange` 측정기준을 붙여 기간 이름을 알려줍니다.
 */
const toSummaryValues = (
  summaryReport: GaReport,
  eventReport: GaReport,
  rangeName: string
): AnalyticsSummaryValues => {
  const summaryRangeIndex = dimensionIndex(summaryReport, "dateRange");
  const summaryRow = (summaryReport.rows ?? []).find(
    (row) => dimension(row, summaryRangeIndex) === rangeName
  );
  const metrics = summaryRow?.metricValues ?? [];

  const eventNameIndex = dimensionIndex(eventReport, "eventName");
  const eventRangeIndex = dimensionIndex(eventReport, "dateRange");
  const eventCount = (eventName: string) =>
    toNumber(
      (eventReport.rows ?? []).find(
        (row) =>
          dimension(row, eventNameIndex) === eventName &&
          dimension(row, eventRangeIndex) === rangeName
      )?.metricValues?.[0]?.value
    );

  return {
    activeUsers: toNumber(metrics[0]?.value),
    newUsers: toNumber(metrics[1]?.value),
    sessions: toNumber(metrics[2]?.value),
    pageViews: toNumber(metrics[3]?.value),
    signUps: eventCount("sign_up"),
    postCompletes: eventCount("post_complete"),
  };
};

/** 같은 경로가 제목만 다르게 여러 줄로 오므로 경로 기준으로 합치고, 조회수가 가장 많은 제목을 씁니다. */
const toTopPages = (report: GaReport, limit: number): TopPageView[] => {
  const pathIndex = dimensionIndex(report, "pagePath");
  const titleIndex = dimensionIndex(report, "pageTitle");
  const pages = new Map<string, TopPageView & { titleViews: number }>();

  (report.rows ?? []).forEach((row) => {
    const path = dimension(row, pathIndex);
    if (IGNORED_VALUES.has(path)) return;

    const title = trimServiceName(dimension(row, titleIndex));
    const views = toNumber(row.metricValues?.[0]?.value);
    const page = pages.get(path);

    if (!page) {
      pages.set(path, { path, title, views, titleViews: views });
      return;
    }

    page.views += views;
    if (views > page.titleViews) {
      page.title = title;
      page.titleViews = views;
    }
  });

  return [...pages.values()]
    .sort((a, b) => b.views - a.views)
    .slice(0, limit)
    .map(({ path, title, views }) => ({ path, title, views }));
};

export const RANKING_LIMIT = 10;

/** GA Data API 응답들을 화면에서 쓰는 형태로 바꿉니다. 값이 없는 지표는 0으로 채웁니다. */
export const toAnalyticsReport = (reports: GaReports): AnalyticsReport => {
  const daily = (reports.daily.rows ?? [])
    .map((row) => ({
      date: toIsoDate(row.dimensionValues?.[0]?.value ?? ""),
      activeUsers: toNumber(row.metricValues?.[0]?.value),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const weekly = (reports.weekly.rows ?? [])
    .map((row) => ({
      weekStart: isoWeekToMonday(row.dimensionValues?.[0]?.value ?? ""),
      activeUsers: toNumber(row.metricValues?.[0]?.value),
    }))
    .sort((a, b) => a.weekStart.localeCompare(b.weekStart));

  const searchTerms = (reports.searchTerms.rows ?? [])
    .map((row) => ({
      term: (row.dimensionValues?.[0]?.value ?? "").trim(),
      count: toNumber(row.metricValues?.[0]?.value),
    }))
    .filter((item) => !IGNORED_VALUES.has(item.term))
    .sort((a, b) => b.count - a.count)
    .slice(0, RANKING_LIMIT);

  const sourceIndex = dimensionIndex(reports.trafficSources, "sessionSource");
  const channelIndex = dimensionIndex(reports.trafficSources, "sessionDefaultChannelGroup");
  const trafficSources = (reports.trafficSources.rows ?? [])
    .map((row) => ({
      source: dimension(row, sourceIndex),
      channel: dimension(row, channelIndex),
      users: toNumber(row.metricValues?.[0]?.value),
    }))
    .sort((a, b) => b.users - a.users)
    .slice(0, RANKING_LIMIT);

  return {
    summary: {
      current: toSummaryValues(reports.summary, reports.events, "current"),
      previous: toSummaryValues(reports.summary, reports.events, "previous"),
    },
    daily,
    weekly,
    searchTerms,
    trafficSources,
    topPages: toTopPages(reports.topPages, RANKING_LIMIT),
  };
};
