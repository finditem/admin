/**
 * 이전 값 대비 증감률(%)을 정수로 구합니다. 이전 값이 0이면 비율을 낼 수 없으므로 `null`을 돌려줍니다.
 */
export const getChangeRate = (current: number, previous: number): number | null => {
  if (previous === 0) return null;
  return Math.round(((current - previous) / previous) * 100);
};
