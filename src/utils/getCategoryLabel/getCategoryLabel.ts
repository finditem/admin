import { CATEGORY_OPTIONS } from "@/constants";
import { CategoryType } from "@/types";

/**
 * 분실물 카테고리 값에 해당하는 한국어 라벨을 반환합니다.
 *
 * @remarks
 * - `CATEGORY_OPTIONS`에 없는 값이면 "기타"를 반환합니다.
 *
 * @example
 * ```ts
 * getCategoryLabel("WALLET"); // "지갑"
 * ```
 */

export const getCategoryLabel = (category: CategoryType) =>
  CATEGORY_OPTIONS.find((option) => option.value === category)?.label ?? "기타";
