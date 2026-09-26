import { AdminGuestInquiryItem, AdminInquiriesItem, AdminReportItem } from "@/api/fetch/admin";
import { AdminReportsItemData } from "../../_types";
import {
  ProcessStatusBadgeConfig,
  ReplyStatusBadgeConfig,
} from "../AdminStatusBadgeConfig/AdminStatusBadgeConfig";
import { REPORT_TYPE_TITLE } from "../../_constants/REPORT_TYPE_TITLE";

export const toReportItemVM = (item: AdminReportItem): AdminReportsItemData => {
  return {
    // 상세 응답에는 신고자 ID가 없어서, 유저 정보로 이어지도록 목록의 ID를 쿼리로 넘긴다.
    href: `/admin/reports/report/${item.reportId}${item.reporterId ? `?userId=${item.reporterId}` : ""}`,
    title: REPORT_TYPE_TITLE[item.reportType],
    content: item.reason,
    nickname: item.reporterNickname,
    createdAt: item.createdAt,

    processStatus: ProcessStatusBadgeConfig[item.status],
    answerStatus: ReplyStatusBadgeConfig(item.answered),
  };
};

export const toInquiryItemVM = (item: AdminInquiriesItem): AdminReportsItemData => {
  return {
    // 상세 응답에는 문의자 ID가 없어서, 유저 정보로 이어지도록 목록의 ID를 쿼리로 넘긴다.
    href: `/admin/reports/inquiry/${item.inquiryId}${item.userId ? `?userId=${item.userId}` : ""}`,
    title: item.title,
    content: item.content,
    nickname: item.nickname,
    createdAt: item.createdAt,

    processStatus: ProcessStatusBadgeConfig[item.status],
    answerStatus: ReplyStatusBadgeConfig(item.answered),
  };
};

export const toGuestInquiryItemVM = (item: AdminGuestInquiryItem): AdminReportsItemData => {
  return {
    href: `/admin/guest-inquiries/${item.inquiryId}`,
    title: item.title,
    content: item.content,
    nickname: item.email,
    createdAt: item.createdAt,

    processStatus: ProcessStatusBadgeConfig[item.status],
    answerStatus: ReplyStatusBadgeConfig(item.answered),
  };
};
