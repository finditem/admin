"use client";

/**
 * URL 쿼리 파라미터를 읽어 필터 상태 객체로 변환하는 커스텀 훅입니다.
 *
 * @remarks
 * - `useSearchParams`로 URL 쿼리를 읽고 zod enum으로 검증 및 정규화합니다.
 * - 잘못된 쿼리 값은 undefined로 반환됩니다.
 * - 필터 UI 초기값 설정 및 API 요청 파라미터 생성에 사용됩니다.
 *
 * @returns URL 쿼리 기반 필터 상태 객체
 * - `category`: 카테고리 필터
 * - `sort`: 정렬 필터
 * - `findStatus`: 아이템 찾음 상태 필터
 * - `startDate`: 시작일 필터
 * - `endDate`: 종료일 필터
 *
 * @author jikwon
 * @author suhyeon
 */

/**
 * @example
 * ```ts
 * const { category, sort, findStatus, startDate, endDate } = useFilterParams();
 * ```
 */

import { useSearchParams } from "next/navigation";
import { z } from "zod";
import {
  CategoryFilterValue,
  FindStatusFilterValue,
  SortFilterValue,
} from "@/components/domain/FilterSectionBottomSheet/_types/types";

const optionalEnumParam = <T extends [string, ...string[]]>(values: T, value: string | null) => {
  if (!value) return undefined;
  return z.enum(values).safeParse(value.toUpperCase()).data;
};

export const useFilterParams = () => {
  const searchParams = useSearchParams();

  return {
    category: optionalEnumParam(
      ["ELECTRONICS", "WALLET", "ID_CARD", "JEWELRY", "BAG", "CARD", "ETC"],
      searchParams.get("category")
    ) as CategoryFilterValue,
    sort: optionalEnumParam(
      ["LATEST", "OLDEST", "MOST_FAVORITED", "MOST_VIEWED"],
      searchParams.get("sort")
    ) as SortFilterValue,
    findStatus: optionalEnumParam(
      ["SEARCHING", "FOUND"],
      searchParams.get("find-status")
    ) as FindStatusFilterValue,
    startDate: searchParams.get("startDate"),
    endDate: searchParams.get("endDate"),
  };
};
