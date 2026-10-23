import { DbQueryResult } from "../../_types/DbQueryType";

// 엑셀은 이 문자로 시작하는 칸을 수식으로 실행하므로, 사용자가 쓴 문자열이 수식이 되지 않게 막는다.
const FORMULA_PREFIX = /^[=+\-@\t\r]/;

const escapeCsvCell = (value: unknown) => {
  if (value === null || value === undefined) return "";
  const raw = typeof value === "object" ? JSON.stringify(value) : String(value);
  // 숫자는 음수도 그대로 숫자로 읽혀야 하므로 문자열 값에만 작은따옴표를 붙인다.
  const text = typeof value === "string" && FORMULA_PREFIX.test(raw) ? `'${raw}` : raw;
  // 쉼표, 따옴표, 줄바꿈이 있으면 따옴표로 감싸고 안의 따옴표는 두 번 쓴다.
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

/**
 * 조회 결과를 CSV 문자열로 바꿉니다.
 *
 * @remarks
 * - 엑셀에서 한글이 깨지지 않도록 앞에 BOM을 붙입니다.
 * - `null`은 빈 칸으로 적습니다.
 * - `=`, `+`, `-`, `@`, 탭, CR로 시작하는 문자열은 엑셀이 수식으로 실행하지 않도록 앞에 `'`를 붙입니다.
 */
export const toCsv = ({ columns, rows }: DbQueryResult) =>
  "﻿" + [columns, ...rows].map((row) => row.map(escapeCsvCell).join(",")).join("\r\n");
