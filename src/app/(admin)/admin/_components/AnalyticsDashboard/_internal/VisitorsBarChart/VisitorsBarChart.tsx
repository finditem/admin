"use client";

import { useState } from "react";
import { cn } from "@/utils";

export interface VisitorsBarChartItem {
  key: string;
  /** 가로축 양 끝에 쓰는 짧은 라벨 */
  axisLabel: string;
  /** 마우스를 올렸을 때 보여주는 기간 라벨 */
  tooltipLabel: string;
  value: number;
}

interface VisitorsBarChartProps {
  title: string;
  items: VisitorsBarChartItem[];
  emptyText: string;
}

const formatCount = (value: number) => `${value.toLocaleString("ko-KR")}명`;

/**
 * 방문자 수 막대 차트입니다. 막대에 마우스를 올리면 그 기간의 방문자 수를 보여줍니다.
 * 스크린 리더에는 같은 값을 표로 제공합니다.
 */
const VisitorsBarChart = ({ title, items, emptyText }: VisitorsBarChartProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const titleId = `visitors-chart-${title}`;

  if (items.length === 0) {
    return (
      <section aria-labelledby={titleId} className="min-w-0">
        <h2 id={titleId} className="mb-4 text-h3-semibold text-layout-header-default">
          {title}
        </h2>
        <p className="text-body2-regular text-layout-body-default">{emptyText}</p>
      </section>
    );
  }

  const max = Math.max(...items.map((item) => item.value), 1);
  const hovered = hoveredIndex === null ? null : items[hoveredIndex];

  return (
    <section aria-labelledby={titleId} className="min-w-0">
      <h2 id={titleId} className="mb-4 text-h3-semibold text-layout-header-default">
        {title}
      </h2>

      <div aria-hidden className="relative pt-9">
        {hovered && hoveredIndex !== null && (
          <div
            className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 whitespace-nowrap rounded-[8px] bg-fill-neutralInversed-normal-enteredSelected px-2 py-1 text-caption1-semibold text-white"
            style={{
              left: `${((hoveredIndex + 0.5) / items.length) * 100}%`,
            }}
          >
            {hovered.tooltipLabel} · {formatCount(hovered.value)}
          </div>
        )}

        <div
          className="flex h-40 items-end gap-[2px] border-b border-divider-default"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {items.map((item, index) => (
            <div
              key={item.key}
              className="flex h-full flex-1 items-end"
              onMouseEnter={() => setHoveredIndex(index)}
            >
              <div
                className={cn(
                  "min-h-[2px] w-full rounded-t-[2px] bg-fill-brand-normal-default transition-opacity",
                  hoveredIndex !== null && hoveredIndex !== index && "opacity-40"
                )}
                style={{ height: `${(item.value / max) * 100}%` }}
              />
            </div>
          ))}
        </div>

        <div className="mt-2 flex justify-between text-caption1-regular text-layout-body-default">
          <span>{items[0].axisLabel}</span>
          <span>최대 {formatCount(max)}</span>
          <span>{items[items.length - 1].axisLabel}</span>
        </div>
      </div>

      {/* 표에 sr-only를 바로 주면 표 높이가 1px 제한을 무시하고 레이아웃을 늘리므로 div로 감싼다. */}
      <div className="sr-only">
        <table>
          <caption>{title}</caption>
          <thead>
            <tr>
              <th scope="col">기간</th>
              <th scope="col">방문자</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.key}>
                <td>{item.tooltipLabel}</td>
                <td>{formatCount(item.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default VisitorsBarChart;
