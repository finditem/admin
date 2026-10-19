import { cn } from "@/utils";
import { getChangeRate } from "../../../../_utils/getChangeRate/getChangeRate";

export interface SummaryCard {
  key: string;
  label: string;
  help: string;
  /** 아직 값을 받지 못했으면 `null`이고, 같은 높이의 스켈레톤으로 자리를 잡는다. */
  current: number | null;
  /** 비교할 값을 받지 못했으면 `null`이고, 증감 자리에 비교할 값이 없다고 표시한다. */
  previous: number | null;
}

interface AnalyticsSummaryCardsProps {
  /** 섹션의 접근 가능한 이름 */
  sectionLabel: string;
  cards: SummaryCard[];
  /** 비교 기간 라벨. 예: "이전 7일" */
  previousLabel: string;
  /** 새 기간 값을 받는 동안 이전 값을 흐리게 보여준다. */
  isStale?: boolean;
}

const formatCount = (value: number) => value.toLocaleString("ko-KR");

const ChangeBadge = ({ current, previous }: { current: number; previous: number | null }) => {
  const rate = previous === null ? null : getChangeRate(current, previous);

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
const AnalyticsSummaryCards = ({
  sectionLabel,
  cards,
  previousLabel,
  isStale = false,
}: AnalyticsSummaryCardsProps) => {
  const isLoading = cards.some((card) => card.current === null);

  return (
    <section aria-label={sectionLabel} aria-busy={isLoading || isStale}>
      <dl
        className={cn(
          "grid grid-cols-2 gap-3 transition-opacity duration-150 pc:grid-cols-3",
          isStale && "opacity-50"
        )}
      >
        {cards.map(({ key, label, help, current, previous }) => {
          return (
            <div
              key={key}
              className="flex flex-col-reverse gap-1 rounded-[14px] border border-divider-default px-4 py-4"
            >
              <dt className="flex flex-col">
                <span className="text-body2-medium text-layout-header-default">{label}</span>
                <span className="text-caption1-regular text-layout-body-default">{help}</span>
              </dt>
              {current === null ? (
                // 값이 들어왔을 때와 높이가 같도록 보이지 않는 글자로 줄 높이를 잡고 그 위에 막대를 그린다.
                <dd className="flex flex-col" aria-hidden>
                  <span className="relative block">
                    <span className="invisible block text-h2-bold">0</span>
                    <span className="skeleton-animation absolute inset-y-1 left-0 w-16 rounded-md" />
                  </span>
                  <span className="relative block">
                    <span className="invisible block text-caption1-regular">0</span>
                    <span className="skeleton-animation absolute inset-y-0.5 left-0 w-28 rounded-md" />
                  </span>
                </dd>
              ) : (
                <dd className="flex flex-col">
                  <span className="text-h2-bold text-layout-header-default">
                    {formatCount(current)}
                  </span>
                  <span className="flex items-center gap-1">
                    <ChangeBadge current={current} previous={previous} />
                    {previous !== null && (
                      <span className="text-caption1-regular text-layout-body-default">
                        {previousLabel} {formatCount(previous)}
                      </span>
                    )}
                  </span>
                </dd>
              )}
            </div>
          );
        })}
      </dl>
    </section>
  );
};

export default AnalyticsSummaryCards;
