import { toAnalyticsReport } from "./toAnalyticsReport";

const EMPTY = { rows: [] };

const row = (dimensions: string[], metrics: string[]) => ({
  dimensionValues: dimensions.map((value) => ({ value })),
  metricValues: metrics.map((value) => ({ value })),
});

const headers = (...names: string[]) => names.map((name) => ({ name }));

describe("toAnalyticsReport", () => {
  it("현재 기간과 이전 기간 요약을 dateRange 이름으로 나눔", () => {
    const result = toAnalyticsReport({
      summary: {
        dimensionHeaders: headers("dateRange"),
        rows: [row(["previous"], ["24", "22", "40", "70"]), row(["current"], ["30", "24", "55", "81"])],
      },
      events: {
        dimensionHeaders: headers("eventName", "dateRange"),
        rows: [
          row(["post_complete", "current"], ["1"]),
          row(["post_complete", "previous"], ["3"]),
          row(["sign_up", "current"], ["2"]),
        ],
      },
      daily: EMPTY,
      weekly: EMPTY,
      searchTerms: EMPTY,
      trafficSources: EMPTY,
      topPages: EMPTY,
    });

    expect(result.summary.current).toEqual({
      activeUsers: 30,
      newUsers: 24,
      sessions: 55,
      pageViews: 81,
      signUps: 2,
      postCompletes: 1,
    });
    expect(result.summary.previous).toEqual({
      activeUsers: 24,
      newUsers: 22,
      sessions: 40,
      pageViews: 70,
      signUps: 0,
      postCompletes: 3,
    });
  });

  it("일별, 주별 값을 날짜 순으로 정렬함", () => {
    const result = toAnalyticsReport({
      summary: EMPTY,
      events: EMPTY,
      daily: { rows: [row(["20260926"], ["40"]), row(["20260924"], ["30"])] },
      weekly: { rows: [row(["202639"], ["90"]), row(["202638"], ["80"])] },
      searchTerms: EMPTY,
      trafficSources: EMPTY,
      topPages: EMPTY,
    });

    expect(result.daily).toEqual([
      { date: "2026-09-24", activeUsers: 30 },
      { date: "2026-09-26", activeUsers: 40 },
    ]);
    expect(result.weekly).toEqual([
      { weekStart: "2026-09-14", activeUsers: 80 },
      { weekStart: "2026-09-21", activeUsers: 90 },
    ]);
  });

  it("검색어와 유입 경로에서 빈 값을 빼고 많은 순으로 정렬함", () => {
    const result = toAnalyticsReport({
      summary: EMPTY,
      events: EMPTY,
      daily: EMPTY,
      weekly: EMPTY,
      searchTerms: {
        rows: [row(["에어팟"], ["2"]), row(["(not set)"], ["9"]), row(["지갑 "], ["5"])],
      },
      trafficSources: {
        dimensionHeaders: headers("sessionSource", "sessionDefaultChannelGroup"),
        rows: [row(["google", "Organic Search"], ["52"]), row(["(direct)", "Direct"], ["67"])],
      },
      topPages: EMPTY,
    });

    expect(result.searchTerms).toEqual([
      { term: "지갑", count: 5 },
      { term: "에어팟", count: 2 },
    ]);
    expect(result.trafficSources).toEqual([
      { source: "(direct)", channel: "Direct", users: 67 },
      { source: "google", channel: "Organic Search", users: 52 },
    ]);
  });

  it("같은 경로의 페이지는 합치고 조회수가 많은 제목을 쓰며 서비스 이름을 뗌", () => {
    const result = toAnalyticsReport({
      summary: EMPTY,
      events: EMPTY,
      daily: EMPTY,
      weekly: EMPTY,
      searchTerms: EMPTY,
      trafficSources: EMPTY,
      topPages: {
        dimensionHeaders: headers("pagePath", "pageTitle"),
        rows: [
          row(["/", "우리 동네 분실물 찾기 | 찾아줘!"], ["149"]),
          row(["/list/7", "수내동 검정 숄더백 분실 | 수내동 | 찾아줘! 분실"], ["26"]),
          row(["/", "성수동 검색결과 | 찾아줘!"], ["5"]),
        ],
      },
    });

    expect(result.topPages).toEqual([
      { path: "/", title: "우리 동네 분실물 찾기", views: 154 },
      { path: "/list/7", title: "수내동 검정 숄더백 분실 | 수내동", views: 26 },
    ]);
  });

  it("응답이 비어 있으면 0과 빈 목록으로 채움", () => {
    const result = toAnalyticsReport({
      summary: {},
      events: {},
      daily: { rows: null },
      weekly: {},
      searchTerms: {},
      trafficSources: {},
      topPages: {},
    });

    expect(result.summary.current.activeUsers).toBe(0);
    expect(result.summary.previous.signUps).toBe(0);
    expect(result.daily).toEqual([]);
    expect(result.searchTerms).toEqual([]);
    expect(result.topPages).toEqual([]);
  });
});
