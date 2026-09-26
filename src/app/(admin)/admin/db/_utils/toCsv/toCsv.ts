import { DbQueryResult } from "../../_types/DbQueryType";

const escapeCsvCell = (value: unknown) => {
  if (value === null || value === undefined) return "";
  const text = typeof value === "object" ? JSON.stringify(value) : String(value);
  // 쉼표, 따옴표, 줄바꿈이 있으면 따옴표로 감싸고 안의 따옴표는 두 번 쓴다.
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

/**
 * 조회 결과를 CSV 문자열로 바꿉니다.
 *
 * @remarks
 * - 엑셀에서 한글이 깨지지 않도록 앞에 BOM을 붙입니다.
 * - `null`은 빈 칸으로 적습니다.
 */
export const toCsv = ({ columns, rows }: DbQueryResult) =>
  "﻿" + [columns, ...rows].map((row) => row.map(escapeCsvCell).join(",")).join("\r\n");
