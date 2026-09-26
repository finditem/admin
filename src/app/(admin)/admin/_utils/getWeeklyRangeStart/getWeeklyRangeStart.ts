const DAY_MS = 24 * 60 * 60 * 1000;
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

/**
 * 한국 시간 기준으로 이번 주를 포함한 최근 `weeks`주의 첫 월요일(`YYYY-MM-DD`)을 구합니다.
 * 주간 차트의 첫 주가 중간에 잘리지 않도록 GA 조회 시작일을 월요일에 맞추는 데 씁니다.
 */
export const getWeeklyRangeStart = (now: Date, weeks: number) => {
  const kstNow = new Date(now.getTime() + KST_OFFSET_MS);
  const weekday = (kstNow.getUTCDay() + 6) % 7;
  const start = kstNow.getTime() - (weekday + (weeks - 1) * 7) * DAY_MS;

  return new Date(start).toISOString().slice(0, 10);
};
