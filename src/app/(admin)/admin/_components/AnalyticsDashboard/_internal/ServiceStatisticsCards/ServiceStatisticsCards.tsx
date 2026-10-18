"use client";

import { AxiosError } from "axios";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { StatisticsPeriod, useGetPostStatistics, useGetUserStatistics } from "@/api/fetch/admin";
import AdminNotice from "../../../AdminNotice/AdminNotice";
import AnalyticsSummaryCards from "../AnalyticsSummaryCards/AnalyticsSummaryCards";

interface ServiceStatisticsCardsProps {
  /** 조회 기간 */
  current: StatisticsPeriod;
  /** 증감 비교에 쓰는 기간 */
  previous: StatisticsPeriod;
  /** 비교 기간 라벨. 예: "이전 7일" */
  previousLabel: string;
}

/** 조회 기간에 서버의 통계 도입일 이전 날짜가 들어 있으면 서버가 돌려주는 오류 코드 */
const BEFORE_AVAILABLE_DATE_CODE = "ADMIN_STATISTICS400-BEFORE_AVAILABLE_DATE";

const isBeforeAvailableDate = (error: unknown) =>
  (error as AxiosError<ApiBaseResponseType<null>>)?.response?.data?.code ===
  BEFORE_AVAILABLE_DATE_CODE;

/**
 * 백엔드가 집계한 회원과 게시글 통계를 GA 요약과 같은 카드로 보여줍니다.
 *
 * @remarks
 * - 관리자 토큰이 필요한 API라 토큰 재발급을 처리하는 클라이언트 요청으로 조회합니다.
 * - 비교 기간을 받지 못하면(도입일 이전 등) 숫자만 보여주고 증감 자리에 비교할 값이 없다고 표시합니다.
 */
const ServiceStatisticsCards = ({
  current,
  previous,
  previousLabel,
}: ServiceStatisticsCardsProps) => {
  const currentUsers = useGetUserStatistics(current);
  const previousUsers = useGetUserStatistics(previous);
  const currentPosts = useGetPostStatistics(current);
  const previousPosts = useGetPostStatistics(previous);

  const currentError = currentUsers.error ?? currentPosts.error;
  // 비교 기간은 실패하면 null로 두고 비교 없이 보여준다.
  const isReady =
    !currentError &&
    Boolean(currentUsers.data && currentPosts.data) &&
    !previousUsers.isPending &&
    !previousPosts.isPending;
  const users = isReady ? currentUsers.data?.result : undefined;
  const posts = isReady ? currentPosts.data?.result : undefined;
  const prevUsers = previousUsers.data?.result;
  const prevPosts = previousPosts.data?.result;
  const isStale = [currentUsers, previousUsers, currentPosts, previousPosts].some(
    (query) => query.isPlaceholderData
  );

  const cards = (
    <AnalyticsSummaryCards
      sectionLabel="회원과 게시글 요약"
      previousLabel={previousLabel}
      isStale={isStale}
      cards={[
        {
          key: "totalUserCount",
          label: "전체 회원",
          help: "기간 마지막 날 기준 회원 수",
          current: users?.totalUserCount ?? null,
          previous: prevUsers?.totalUserCount ?? null,
        },
        {
          key: "signupCount",
          label: "가입",
          help: "기간 중 가입한 회원 수",
          current: users?.signupCount ?? null,
          previous: prevUsers?.signupCount ?? null,
        },
        {
          key: "withdrawalCount",
          label: "탈퇴",
          help: "기간 중 탈퇴한 회원 수",
          current: users?.withdrawalCount ?? null,
          previous: prevUsers?.withdrawalCount ?? null,
        },
        {
          key: "totalPostCount",
          label: "전체 게시글",
          help: "기간 마지막 날 기준 게시글 수",
          current: posts?.totalPostCount ?? null,
          previous: prevPosts?.totalPostCount ?? null,
        },
        {
          key: "lostPostCount",
          label: "분실 게시글",
          help: "기간 중 새로 공개된 분실 게시글 수",
          current: posts?.lostPostCount ?? null,
          previous: prevPosts?.lostPostCount ?? null,
        },
        {
          key: "foundPostCount",
          label: "발견 게시글",
          help: "기간 중 새로 공개된 발견 게시글 수",
          current: posts?.foundPostCount ?? null,
          previous: prevPosts?.foundPostCount ?? null,
        },
      ]}
    />
  );

  if (!currentError) return cards;

  // 안내로 바꿔도 높이가 그대로이도록 보이지 않는 카드 위에 안내를 겹친다.
  return (
    <div className="relative">
      <div className="invisible" aria-hidden>
        {cards}
      </div>
      <div className="absolute inset-0">
        {isBeforeAvailableDate(currentError) ? (
          <AdminNotice
            className="h-full"
            title="통계 도입일 이전 기간이 포함돼 조회할 수 없어요"
            description="회원과 게시글 통계는 서버에 도입된 날부터 집계돼요. 더 짧은 기간을 골라 주세요."
          />
        ) : (
          <AdminNotice
            className="h-full"
            title="회원과 게시글 통계를 불러오지 못했어요"
            description="잠시 후 다시 시도해 주세요."
          />
        )}
      </div>
    </div>
  );
};

export default ServiceStatisticsCards;
