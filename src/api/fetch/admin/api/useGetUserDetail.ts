import useAppQuery from "@/api/_base/query/useAppQuery";
import { GetUserDetailResponse } from "../types/UserDetailType";

export const useGetUserDetail = ({ userId }: { userId: number }) => {
  return useAppQuery<GetUserDetailResponse>(
    "auth",
    ["admin-user-detail", userId],
    `/admin/users/${userId}`
  );
};
