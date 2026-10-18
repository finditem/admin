import { keepPreviousData } from "@tanstack/react-query";
import useAppQuery from "@/api/_base/query/useAppQuery";
import { GetPostStatisticsResponse, StatisticsPeriod } from "../types/StatisticsType";

export const useGetPostStatistics = ({ startDate, endDate }: StatisticsPeriod) => {
  const params = new URLSearchParams({ startDate, endDate });

  return useAppQuery<GetPostStatisticsResponse>(
    "auth",
    ["admin-post-statistics", startDate, endDate],
    `/admin/posts/statistics?${params.toString()}`,
    // 기간을 바꾸는 동안 이전 값을 유지해 카드가 비었다 채워지며 높이가 바뀌지 않게 한다.
    { placeholderData: keepPreviousData }
  );
};
