import { getServiceUrl } from "@/utils";

export const ADMIN_NAV_SECTIONS = [
  {
    id: "analytics",
    label: "통계",
    items: [
      { href: "/admin/analytics", title: "서비스 통계" },
      { href: "/admin/db", title: "DB 조회" },
    ],
  },
  {
    id: "notice",
    label: "공지사항",
    items: [{ href: "/admin/notice", title: "공지사항" }],
  },
  {
    id: "support",
    label: "신고/문의",
    items: [
      { href: "/admin/reports", title: "신고/문의 내역" },
      { href: "/admin/guest-inquiries", title: "비회원 문의 내역" },
    ],
  },
  {
    id: "user",
    label: "유저 관리",
    items: [{ href: "/admin/withdrawal-reasons", title: "유저 탈퇴 사유" }],
  },
  {
    id: "content",
    label: "게시글 관리",
    items: [{ href: "/admin/content-agree", title: "콘텐츠 활용 동의 게시글" }],
  },
  {
    id: "shortcut",
    label: "바로가기",
    items: [
      { href: getServiceUrl("/"), title: "찾아줘! 서비스", external: true },
      { href: "https://github.com/finditem", title: "GitHub", external: true },
      { href: "https://flow.finditem.kr/", title: "일정관리", external: true },
      { href: "https://status.finditem.kr/", title: "외부 API 모니터링", external: true },
    ],
  },
  {
    id: "account",
    label: "계정 설정",
    items: [{ href: getServiceUrl("/change-password"), title: "비밀번호 변경" }],
  },
] as const;
