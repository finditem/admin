import { cn } from "@/utils";
import { AnalyticsSummary, AnalyticsSummaryValues } from "../../../../_types/AnalyticsReport";
import { getChangeRate } from "../../../../_utils/getChangeRate/getChangeRate";

interface AnalyticsSummaryCardsProps {
  summary: AnalyticsSummary;
  /** 비교 기간 라벨. 예: "이전 7일" */
  previousLabel: string;
}

const CARDS: { key: keyof AnalyticsSummaryValues; label: string; help: string }[] = [
  { key: "activeUsers", label: "방문자", help: "기간 중 한 번 이상 방문한 사용자" },
  { key: "newUsers", label: "신규 방문자", help: "처음 방문한 사용자" },
  { key: "sessions", label: "방문 횟수", help: "세션 수" },
  { key: "pageViews", label: "페이지뷰", help: "조회한 화면 수" },
  { key: "signUps", label: "가입", help: "GA 가입 완료 이벤트 수" },
  { key: "postCompletes", label: "게시글 작성", help: "GA 게시글 작성 완료 이벤트 수" },
];

const formatCount = (value: number) => value.toLocaleString("ko-KR");

const ChangeBadge = ({ current, previous }: { current: number; previous: number }) => {
  const rate = getChangeRate(current, previous);

  if (rate === null) {
    return <span className="text-caption1-regular text-layout-body-default">비교할 값 없음</span>;
  }

  return (
    <span
      className={cn(
        "text-caption1-semibold",
        rate > 0 && "text-system-success",
        rate < 0 && "text-system-warning",
        rate === 0 && "text-layout-body-default"
      )}
    >
      {rate > 0 ? `+${rate}%` : `${rate}%`}
    </span>
  );
};

/** 기간 합계 지표를 카드로 보여주고, 바로 앞 같은 길이 기간과 비교한 증감률을 함께 표시합니다. */
const AnalyticsSummaryCards = ({ summary, previousLabel }: AnalyticsSummaryCardsProps) => {
  return (
    <section aria-label="기간 요약">
      <dl className="grid grid-cols-2 gap-3 pc:grid-cols-3">
        {CARDS.map(({ key, label, help }) => {
          const current = summary.current[key];
          const previous = summary.previous[key];

          return (
            <div
              key={key}
              className="flex flex-col-reverse gap-1 rounded-[14px] border border-divider-default px-4 py-4"
            >
              <dt className="flex flex-col">
                <span className="text-body2-medium text-layout-header-default">{label}</span>
                <span className="text-caption1-regular text-layout-body-default">{help}</span>
              </dt>
              <dd className="flex flex-col">
                <span className="text-h2-bold text-layout-header-default">{formatCount(current)}</span>
                <span className="flex items-center gap-1">
                  <ChangeBadge current={current} previous={previous} />
                  <span className="text-caption1-regular text-layout-body-default">
                    {previousLabel} {formatCount(previous)}
                  </span>
                </span>
              </dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
};

export default AnalyticsSummaryCards;
