export interface AnalyticsRankItem {
  key: string;
  label: string;
  sublabel?: string;
  value: number;
  /** 있으면 새 탭으로 여는 링크가 된다. */
  href?: string;
}

interface AnalyticsRankListProps {
  title: string;
  items: AnalyticsRankItem[];
  /** 값 뒤에 붙는 단위. 예: "회" */
  unit: string;
  emptyText: string;
}

/** 검색어, 유입 경로, 많이 본 페이지처럼 순위가 있는 값을 보여주는 목록입니다. */
const AnalyticsRankList = ({ title, items, unit, emptyText }: AnalyticsRankListProps) => {
  const titleId = `analytics-rank-${title}`;
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <section aria-labelledby={titleId} className="min-w-0">
      <h2 id={titleId} className="mb-3 text-h3-semibold text-layout-header-default">
        {title}
      </h2>

      {items.length === 0 ? (
        <p className="text-body2-regular text-layout-body-default">{emptyText}</p>
      ) : (
        <ol className="flex flex-col gap-3">
          {items.map((item, index) => {
            const label = (
              <span className="block truncate text-body2-medium text-layout-header-default">
                {item.label}
              </span>
            );

            return (
              <li key={item.key} className="flex items-start gap-3">
                <span className="w-5 shrink-0 pt-[1px] text-right text-body2-medium text-layout-body-default">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      {item.href ? (
                        <a href={item.href} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {label}
                        </a>
                      ) : (
                        label
                      )}
                      {item.sublabel && (
                        <span className="block truncate text-caption1-regular text-layout-body-default">
                          {item.sublabel}
                        </span>
                      )}
                    </div>
                    <span className="shrink-0 text-body2-medium text-layout-header-default">
                      {item.value.toLocaleString("ko-KR")}
                      {unit}
                    </span>
                  </div>
                  <div aria-hidden className="mt-1 h-1 rounded-full bg-fill-neutral-subtle-default">
                    <div
                      className="h-full rounded-full bg-fill-brand-normal-default"
                      style={{ width: `${(item.value / max) * 100}%` }}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
};

export default AnalyticsRankList;
