import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";

/** 통계 조회 기간. 한국 시간 기준 `YYYY-MM-DD`이며 시작일과 종료일을 모두 포함한다. */
export interface StatisticsPeriod {
  startDate: string;
  endDate: string;
}

export interface UserStatistics {
  /** 종료일 기준 전체 회원 수 */
  totalUserCount: number;
  /** 기간 중 가입 수 */
  signupCount: number;
  /** 기간 중 탈퇴 수 */
  withdrawalCount: number;
}

export interface PostStatistics {
  /** 종료일 기준 전체 게시글 수 */
  totalPostCount: number;
  /** 기간 중 분실 게시글 최초 공개 수 */
  lostPostCount: number;
  /** 기간 중 발견 게시글 최초 공개 수 */
  foundPostCount: number;
}

export interface GetUserStatisticsResponse extends ApiBaseResponseType<UserStatistics> {}

export interface GetPostStatisticsResponse extends ApiBaseResponseType<PostStatistics> {}
