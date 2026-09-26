"use client";

import { ReactNode } from "react";
import { LoadingState, ProfileAvatar } from "@/components";
import { formatKoreanDate, getCategoryLabel } from "@/utils";
import { useGetUserDetail } from "@/api/fetch/admin";

interface UserDetailViewProps {
  userId: number;
}

const agreementLabel = (agreed: boolean) => (agreed ? "동의" : "미동의");

const InfoRow = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex items-start justify-between gap-4 py-2">
    <dt className="shrink-0 text-body2-regular text-layout-body-default">{label}</dt>
    <dd className="min-w-0 break-all text-right text-body2-medium text-layout-header-default">
      {children}
    </dd>
  </div>
);

/** 관리자용 유저 상세 화면입니다. 기본 정보, 활동 통계, 약관 동의 여부, 구독 카테고리를 보여줍니다. */
const UserDetailView = ({ userId }: UserDetailViewProps) => {
  const { data, isLoading, isError } = useGetUserDetail({ userId });

  if (isLoading) return <LoadingState />;

  const user = data?.result;
  if (isError || !user) {
    return (
      <p className="px-5 py-10 text-center text-body1-regular text-layout-body-default">
        유저 정보를 불러오지 못했어요.
      </p>
    );
  }

  const stats = [
    { label: "게시글", value: user.postCount },
    { label: "댓글", value: user.commentCount },
    { label: "신고", value: user.reportCount },
  ];

  return (
    <div className="flex flex-col">
      <section
        aria-label="기본 정보"
        className="flex items-center gap-4 border-b border-flatGray-50 px-5 py-[30px]"
      >
        <ProfileAvatar src={user.profileImg} alt={user.nickname} size={64} />
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-h2-bold text-layout-header-default">{user.nickname}</h2>
            {user.role === "ADMIN" && (
              <span className="shrink-0 rounded-full px-2 py-[2px] text-caption1-semibold text-neutral-normal-default bg-fill-neutral-subtle-default">
                관리자
              </span>
            )}
            {user.deletedAt && (
              <span className="shrink-0 rounded-full px-2 py-[2px] text-caption1-semibold text-system-warning bg-fill-neutral-subtle-default">
                탈퇴
              </span>
            )}
          </div>
          <p className="truncate text-body2-regular text-layout-body-default">{user.email}</p>
        </div>
      </section>

      <section aria-label="활동 통계" className="border-b border-flatGray-50 px-5 py-6">
        <dl className="grid grid-cols-3 text-center">
          {stats.map(({ label, value }) => (
            <div key={label} className="flex flex-col-reverse gap-1">
              <dt className="text-body2-regular text-layout-body-default">{label}</dt>
              <dd className="text-h2-bold text-layout-header-default">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section
        aria-labelledby="user-account-title"
        className="border-b border-flatGray-50 px-5 py-6"
      >
        <h3 id="user-account-title" className="mb-2 text-h3-semibold text-layout-header-default">
          계정
        </h3>
        <dl>
          <InfoRow label="유저 ID">{user.userId}</InfoRow>
          <InfoRow label="이메일 인증">{user.emailVerified ? "완료" : "미완료"}</InfoRow>
          <InfoRow label="가입일">{formatKoreanDate(user.createdAt)}</InfoRow>
          {user.deletedAt && <InfoRow label="탈퇴일">{formatKoreanDate(user.deletedAt)}</InfoRow>}
        </dl>
      </section>

      <section
        aria-labelledby="user-agreement-title"
        className="border-b border-flatGray-50 px-5 py-6"
      >
        <h3 id="user-agreement-title" className="mb-2 text-h3-semibold text-layout-header-default">
          약관 동의
        </h3>
        <dl>
          <InfoRow label="이용약관">{agreementLabel(user.termsOfServiceAgreed)}</InfoRow>
          <InfoRow label="개인정보 처리방침">{agreementLabel(user.privacyPolicyAgreed)}</InfoRow>
          <InfoRow label="콘텐츠 활용">{agreementLabel(user.contentPolicyAgreed)}</InfoRow>
          <InfoRow label="마케팅 수신">{agreementLabel(user.marketingConsent)}</InfoRow>
        </dl>
      </section>

      <section aria-labelledby="user-category-title" className="px-5 py-6">
        <h3 id="user-category-title" className="mb-3 text-h3-semibold text-layout-header-default">
          구독 카테고리
        </h3>
        {user.subscribedCategories?.length ? (
          <ul className="flex flex-wrap gap-2">
            {user.subscribedCategories.map((category) => (
              <li
                key={category}
                className="rounded-full border border-neutral-normal-default px-3 py-1 text-body2-medium text-neutral-normal-default"
              >
                {getCategoryLabel(category)}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-body2-regular text-layout-body-default">구독한 카테고리가 없어요.</p>
        )}
      </section>
    </div>
  );
};

export default UserDetailView;
