import "server-only";
import { unstable_cache } from "next/cache";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { AnalyticsReport, AnalyticsRange } from "../../_types/AnalyticsReport";
import { ANALYTICS_RANGES, ANALYTICS_WEEKLY_COUNT } from "../../_constants/ANALYTICS_RANGES";
import { RANKING_LIMIT, toAnalyticsReport } from "../toAnalyticsReport/toAnalyticsReport";
import { getWeeklyRangeStart } from "../getWeeklyRangeStart/getWeeklyRangeStart";

/** GA 조회에 필요한 서버 env가 모두 있는지 확인합니다. 키는 브라우저로 내려가지 않도록 `NEXT_PUBLIC_`을 붙이지 않습니다. */
export const hasAnalyticsConfig = () =>
  Boolean(process.env.GA_PROPERTY_ID && process.env.GA_CLIENT_EMAIL && process.env.GA_PRIVATE_KEY);

const createClient = () =>
  new BetaAnalyticsDataClient({
    credentials: {
      client_email: process.env.GA_CLIENT_EMAIL,
      // env에는 줄바꿈이 `\n` 문자열로 들어오므로 실제 줄바꿈으로 되돌린다.
      private_key: process.env.GA_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
  });

const requestAnalyticsReport = async (range: AnalyticsRange): Promise<AnalyticsReport> => {
  const { days } = ANALYTICS_RANGES.find((item) => item.value === range) ?? ANALYTICS_RANGES[0];
  const property = `properties/${process.env.GA_PROPERTY_ID}`;
  const dateRanges = [{ startDate: `${days - 1}daysAgo`, endDate: "today" }];
  // 이름을 붙이면 GA가 응답에 dateRange 측정기준으로 어느 기간의 값인지 알려준다.
  const comparedDateRanges = [
    { ...dateRanges[0], name: "current" },
    { startDate: `${days * 2 - 1}daysAgo`, endDate: `${days}daysAgo`, name: "previous" },
  ];

  const client = createClient();

  // batchRunReports는 한 번에 보고서 5개까지만 받으므로 두 번으로 나눠 동시에 요청한다.
  const [[trendResponse], [rankingResponse]] = await Promise.all([
    client.batchRunReports({
      property,
      requests: [
        {
          dateRanges: comparedDateRanges,
          metrics: [
            { name: "activeUsers" },
            { name: "newUsers" },
            { name: "sessions" },
            { name: "screenPageViews" },
          ],
        },
        {
          dateRanges: comparedDateRanges,
          dimensions: [{ name: "eventName" }],
          metrics: [{ name: "eventCount" }],
          dimensionFilter: {
            filter: {
              fieldName: "eventName",
              inListFilter: { values: ["sign_up", "post_complete"] },
            },
          },
        },
        {
          dateRanges,
          dimensions: [{ name: "date" }],
          metrics: [{ name: "activeUsers" }],
        },
        {
          // 주간 방문자는 주 단위로 중복을 뺀 값이라 일별 값을 더한 것과 다르다.
          dateRanges: [
            {
              startDate: getWeeklyRangeStart(new Date(), ANALYTICS_WEEKLY_COUNT),
              endDate: "today",
            },
          ],
          dimensions: [{ name: "isoYearIsoWeek" }],
          metrics: [{ name: "activeUsers" }],
        },
      ],
    }),
    client.batchRunReports({
      property,
      requests: [
        {
          // 운영 앱의 search 이벤트가 보내는 search_term이 searchTerm 측정기준에 담긴다.
          dateRanges,
          dimensions: [{ name: "searchTerm" }],
          metrics: [{ name: "eventCount" }],
          dimensionFilter: { filter: { fieldName: "eventName", stringFilter: { value: "search" } } },
          orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
          limit: RANKING_LIMIT + 5,
        },
        {
          dateRanges,
          // 같은 사람이 여러 번 들어와도 한 번만 세도록 방문 횟수 대신 방문자 수를 쓴다.
          dimensions: [{ name: "sessionSource" }, { name: "sessionDefaultChannelGroup" }],
          metrics: [{ name: "activeUsers" }],
          orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
          limit: RANKING_LIMIT,
        },
        {
          // 같은 경로가 제목별로 나뉘어 오므로 넉넉히 받아 경로 기준으로 합친다.
          dateRanges,
          dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
          metrics: [{ name: "screenPageViews" }],
          orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
          limit: 100,
        },
      ],
    }),
  ]);

  const [summary = {}, events = {}, daily = {}, weekly = {}] = trendResponse.reports ?? [];
  const [searchTerms = {}, trafficSources = {}, topPages = {}] = rankingResponse.reports ?? [];

  return toAnalyticsReport({
    summary,
    events,
    daily,
    weekly,
    searchTerms,
    trafficSources,
    topPages,
  });
};

/** GA 할당량을 아끼기 위해 기간별로 10분 동안 결과를 캐시합니다. */
export const fetchAnalyticsReport = unstable_cache(
  requestAnalyticsReport,
  ["admin-analytics-report-v3"],
  { revalidate: 600 }
);
