"use client";

import Link from "next/link";
import { Button, ProfileAvatar } from "@/components";
import { useGetUsersMe } from "@/api/fetch/user";
import { SkeletonAdminProfile } from "../_internal";

const AdminProfile = () => {
  const { data, isLoading } = useGetUsersMe();
  const { email, nickname, profileImg } = data?.result || {};

  return (
    <header className="flex items-center justify-between px-5 py-[30px] pc:flex-col pc:items-stretch pc:gap-5">
      {isLoading ? (
        <SkeletonAdminProfile />
      ) : (
        <div className="flex items-center gap-6 pc:min-w-0 pc:gap-4">
          <ProfileAvatar
            src={profileImg}
            alt={nickname}
            size={60}
            priority
            className="pc:shrink-0"
          />
          <div className="pc:min-w-0">
            <p
              title={nickname}
              className="text-body1-semibold text-layout-header-default pc:truncate"
            >
              {nickname}
            </p>
            <span
              title={email}
              className="text-body2-regular text-layout-body-default pc:block pc:truncate"
            >
              {email}
            </span>
          </div>
        </div>
      )}

      <Button
        as={Link}
        href="/admin/profile"
        aria-label="관리자 프로필 수정"
        variant="outlined"
        size="small"
        className="pc:w-full"
      >
        프로필 수정
      </Button>
    </header>
  );
};

export default AdminProfile;
