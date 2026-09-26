"use client";

import { useState } from "react";
import { ModalLayout } from "@/components";
import { DbQueryResult } from "../../_types/DbQueryType";
import { formatDbCell } from "../../_utils/formatDbCell/formatDbCell";
import { toCsv } from "../../_utils/toCsv/toCsv";

interface DbResultTableProps {
  result: DbQueryResult;
  /** 표의 접근 가능한 이름. 어떤 조회 결과인지 적는다. */
  caption: string;
  /** CSV로 내려받을 때 파일 이름(확장자 제외) */
  fileName: string;
}

interface SelectedCell {
  column: string;
  value: unknown;
}

/** `type/BigInteger`처럼 온 타입 이름에서 앞부분을 떼어 머리글에 짧게 보여준다. */
const toTypeLabel = (type?: string) => type?.replace(/^type\//, "") ?? "";

/** 값 전체를 볼 때 JSON이면 읽기 좋게 줄을 나눠 보여준다. */
const toFullText = (value: unknown) => {
  if (value !== null && typeof value === "object") return JSON.stringify(value, null, 2);
  return formatDbCell(value);
};

const downloadCsv = (result: DbQueryResult, fileName: string) => {
  const url = URL.createObjectURL(new Blob([toCsv(result)], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

/**
 * 테이블 데이터와 SQL 결과를 같은 모양의 표로 보여줍니다.
 *
 * @remarks
 * - 컬럼이 많으면 표만 가로로 스크롤하고, 긴 값은 한 줄로 자릅니다. 값을 누르면 전체를 모달로 봅니다.
 * - 머리글에 컬럼 타입을 함께 적고, 지금 보이는 결과를 CSV로 내려받을 수 있습니다.
 */
const DbResultTable = ({ result, caption, fileName }: DbResultTableProps) => {
  const [selectedCell, setSelectedCell] = useState<SelectedCell | null>(null);

  if (result.rows.length === 0) {
    return (
      <p role="status" className="py-10 text-center text-body2-regular text-layout-body-default">
        조회된 행이 없어요.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => downloadCsv(result, fileName)}
          className="rounded-[8px] border border-divider-default px-3 py-[6px] text-body2-regular text-neutral-strong-default hover:bg-flatGray-25"
        >
          CSV 다운로드
        </button>
      </div>

      <div className="max-h-[70dvh] overflow-auto rounded-[10px] border border-divider-default">
        <table className="w-max min-w-full border-collapse text-left text-body2-regular">
          <caption className="sr-only">{caption}</caption>
          <thead className="sticky top-0 bg-fill-neutral-subtle-default">
            <tr>
              {result.columns.map((column, index) => (
                <th
                  key={`${column}-${index}`}
                  scope="col"
                  className="whitespace-nowrap border-b border-divider-default px-3 py-2 align-bottom"
                >
                  <span className="block text-neutral-strong-default">{column}</span>
                  <span className="block text-caption1-regular text-layout-body-default">
                    {toTypeLabel(result.columnTypes[index])}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-divider-default last:border-b-0">
                {row.map((value, columnIndex) => (
                  <td key={columnIndex} className="max-w-[320px] p-0">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedCell({ column: result.columns[columnIndex], value })
                      }
                      className={
                        value === null
                          ? "block w-full truncate px-3 py-2 text-left text-layout-body-default hover:bg-flatGray-25"
                          : "block w-full truncate px-3 py-2 text-left text-neutral-strong-default hover:bg-flatGray-25"
                      }
                    >
                      {formatDbCell(value)}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModalLayout
        isOpen={selectedCell !== null}
        onClose={() => setSelectedCell(null)}
        className="w-[min(640px,calc(100vw-40px))] gap-4 p-6"
      >
        <h2 id="modal-title" className="text-body1-semibold text-layout-header-default">
          {selectedCell?.column}
        </h2>
        <pre
          id="modal-desc"
          className="max-h-[60dvh] overflow-auto whitespace-pre-wrap break-all rounded-[10px] p-3 font-mono text-body2-regular text-neutral-strong-default bg-fill-neutral-subtle-default"
        >
          {selectedCell && toFullText(selectedCell.value)}
        </pre>
        <button
          type="button"
          onClick={() => setSelectedCell(null)}
          className="h-10 self-end rounded-[10px] px-4 text-body2-medium text-white bg-fill-neutralInversed-normal-enteredSelected"
        >
          닫기
        </button>
      </ModalLayout>
    </div>
  );
};

export default DbResultTable;
