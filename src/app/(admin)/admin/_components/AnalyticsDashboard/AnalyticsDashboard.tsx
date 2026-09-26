import { ANALYTICS_RANGES, DEFAULT_ANALYTICS_RANGE } from "../../_constants/ANALYTICS_RANGES";
import { AnalyticsRange, AnalyticsReport } from "../../_types/AnalyticsReport";
import {
  fetchAnalyticsReport,
  hasAnalyticsConfig,
} from "../../_utils/fetchAnalyticsReport/fetchAnalyticsReport";
import { getServiceUrl } from "@/utils";
import {
  AnalyticsNotice,
  AnalyticsRangeTabs,
  AnalyticsRankList,
  AnalyticsSummaryCards,
  VisitorsBarChart,
} from "./_internal";

interface AnalyticsDashboardProps {
  /** `?range=` 쿼리 값. 목록에 없는 값이면 기본 기간을 쓴다. */
  rangeParam?: string;
  /** 기간 링크가 가리킬 경로 */
  basePath: string;
}

const toRange = (value?: string): AnalyticsRange =>
  ANALYTICS_RANGES.find((item) => item.value === value)?.value ?? DEFAULT_ANALYTICS_RANGE;

const toShortDate = (isoDate: string) => isoDate.slice(5).replace("-", ".");

const addDays = (isoDate: string, days: number) => {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};

/** GA 기본 채널 그룹 이름을 한국어로 바꿉니다. 목록에 없는 값은 그대로 보여줍니다. */
const CHANNEL_LABELS: Record<string, string> = {
  Direct: "직접 방문",
  "Organic Search": "검색",
  "Organic Social": "소셜",
  Referral: "외부 링크",
  "Paid Search": "검색 광고",
  Email: "이메일",
  Unassigned: "미분류",
  "Cross-network": "광고 네트워크",
  "AI Assistant": "AI 서비스",
};

const SOURCE_LABELS: Record<string, string> = {
  "(direct)": "직접 입력 또는 즐겨찾기",
  "(not set)": "알 수 없음",
  "(data not available)": "알 수 없음",
};

const AnalyticsCharts = ({
  report,
  previousLabel,
}: {
  report: AnalyticsReport;
  previousLabel: string;
}) => {
  const dailyItems = report.daily.map(({ date, activeUsers }) => ({
    key: date,
    axisLabel: toShortDate(date),
    tooltipLabel: toShortDate(date),
    value: activeUsers,
  }));

  const weeklyItems = report.weekly.map(({ weekStart, activeUsers }) => ({
    key: weekStart,
    axisLabel: toShortDate(weekStart),
    tooltipLabel: `${toShortDate(weekStart)} ~ ${toShortDate(addDays(weekStart, 6))}`,
    value: activeUsers,
  }));

  return (
    <>
      <AnalyticsSummaryCards summary={report.summary} previousLabel={previousLabel} />

      <div className="grid grid-cols-1 gap-10 pc:grid-cols-2 pc:gap-8">
        <VisitorsBarChart
          title="일별 방문자"
          items={dailyItems}
          emptyText="이 기간에 수집된 방문 기록이 없어요."
        />
        <VisitorsBarChart
          title="주간 방문자 (최근 12주)"
          items={weeklyItems}
          emptyText="최근 12주 동안 수집된 방문 기록이 없어요."
        />
      </div>

      <div className="grid grid-cols-1 gap-10 pc:grid-cols-3 pc:gap-8">
        <AnalyticsRankList
          title="인기 검색어"
          unit="회"
          emptyText="이 기간에 수집된 검색이 없어요."
          items={report.searchTerms.map(({ term, count }) => ({
            key: term,
            label: term,
            value: count,
          }))}
        />
        <AnalyticsRankList
          title="유입 경로"
          unit="명"
          emptyText="이 기간에 수집된 방문이 없어요."
          items={report.trafficSources.map(({ source, channel, users }) => ({
            key: `${source}-${channel}`,
            label: SOURCE_LABELS[source] ?? source,
            sublabel: CHANNEL_LABELS[channel] ?? channel,
            value: users,
          }))}
        />
        <AnalyticsRankList
          title="많이 본 페이지"
          unit="회"
          emptyText="이 기간에 수집된 페이지 조회가 없어요."
          items={report.topPages.map(({ path, title, views }) => ({
            key: path,
            label: title || path,
            sublabel: path,
            value: views,
            href: getServiceUrl(path),
          }))}
        />
      </div>
    </>
  );
};

/** 운영 앱 GA 데이터를 보여주는 서비스 통계 대시보드입니다. 관리자 메인(PC)과 서비스 통계 화면에서 함께 씁니다. */
const AnalyticsDashboard = async ({ rangeParam, basePath }: AnalyticsDashboardProps) => {
  const range = toRange(rangeParam);
  const rangeLabel = ANALYTICS_RANGES.find((item) => item.value === range)?.label ?? "";
  const previousLabel = `이전 ${rangeLabel}`;

  let content;
  if (!hasAnalyticsConfig()) {
    content = (
      <AnalyticsNotice
        title="GA 연결 설정이 필요해요"
        description="서버 환경 변수 GA_PROPERTY_ID, GA_CLIENT_EMAIL, GA_PRIVATE_KEY를 등록하면 통계가 표시돼요."
      />
    );
  } else {
    try {
      content = (
        <AnalyticsCharts report={await fetchAnalyticsReport(range)} previousLabel={previousLabel} />
      );
    } catch (error) {
      console.error("[analytics] GA 조회 실패", error);
      content = (
        <AnalyticsNotice
          title="통계를 불러오지 못했어요"
          description="GA 서비스 계정 권한과 환경 변수를 확인해 주세요."
        />
      );
    }
  }

  return (
    <div className="flex flex-col gap-8 px-5 pb-12 pt-6">
      <div className="flex flex-col gap-3">
        <AnalyticsRangeTabs range={range} basePath={basePath} />
        <p className="text-caption1-regular text-layout-body-default">
          운영 앱의 Google Analytics 기준이며 10분마다 갱신돼요. 증감은 {previousLabel}과 비교한 값이에요.
        </p>
      </div>
      {content}
    </div>
  );
};

export default AnalyticsDashboard;
