const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * GA `isoYearIsoWeek` 값(`YYYYWW`)을 그 주 월요일 날짜(`YYYY-MM-DD`)로 바꿉니다.
 * ISO 주차는 1월 4일이 들어 있는 주를 1주차로 셉니다.
 */
export const isoWeekToMonday = (isoYearIsoWeek: string) => {
  const year = Number(isoYearIsoWeek.slice(0, 4));
  const week = Number(isoYearIsoWeek.slice(4));

  const jan4 = Date.UTC(year, 0, 4);
  const jan4Weekday = (new Date(jan4).getUTCDay() + 6) % 7;
  const firstMonday = jan4 - jan4Weekday * DAY_MS;

  return new Date(firstMonday + (week - 1) * 7 * DAY_MS).toISOString().slice(0, 10);
};
