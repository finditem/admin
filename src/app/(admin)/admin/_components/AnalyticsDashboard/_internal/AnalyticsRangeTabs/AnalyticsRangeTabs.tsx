import Link from "next/link";
import { cn } from "@/utils";
import { ANALYTICS_RANGES } from "../../../../_constants/ANALYTICS_RANGES";
import { AnalyticsRange } from "../../../../_types/AnalyticsReport";

interface AnalyticsRangeTabsProps {
  range: AnalyticsRange;
  /** 기간 링크가 가리킬 경로. 관리자 메인과 서비스 통계 화면에서 각자 자기 경로를 넘긴다. */
  basePath: string;
}

/** 조회 기간을 고르는 링크 묶음입니다. 기간은 `?range=` 쿼리로 서버 컴포넌트에 전달됩니다. */
const AnalyticsRangeTabs = ({ range, basePath }: AnalyticsRangeTabsProps) => {
  return (
    <nav aria-label="조회 기간" className="flex flex-wrap gap-2">
      {ANALYTICS_RANGES.map((item) => {
        const isActive = item.value === range;

        return (
          <Link
            key={item.value}
            href={`${basePath}?range=${item.value}`}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "whitespace-nowrap rounded-full px-4 py-[6px] text-body2-medium transition-colors duration-150",
              isActive
                ? "text-white bg-fill-neutralInversed-normal-enteredSelected"
                : "text-neutralInversed-normal-default bg-fill-neutralInversed-normal-default hover:text-black hover:bg-fill-neutralInversed-normal-hover"
            )}
          >
            최근 {item.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default AnalyticsRangeTabs;
