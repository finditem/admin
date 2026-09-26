import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { CategoryType } from "@/types";

export interface AdminUserDetail {
  userId: number;
  nickname: string;
  email: string;
  emailVerified: boolean;
  role: "USER" | "ADMIN";
  profileImg: string | null;
  privacyPolicyAgreed: boolean;
  termsOfServiceAgreed: boolean;
  contentPolicyAgreed: boolean;
  marketingConsent: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  postCount: number;
  commentCount: number;
  reportCount: number;
  subscribedCategories: CategoryType[];
}

export interface GetUserDetailResponse extends ApiBaseResponseType<AdminUserDetail> {}
