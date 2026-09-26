import React from "react";
import { render, screen } from "@testing-library/react";
import UserDetailView from "./UserDetailView";
import { useGetUserDetail } from "@/api/fetch/admin";

jest.mock("@/components", () => ({
  LoadingState: () => <div data-testid="loading" />,
  ProfileAvatar: ({ alt }: any) => <img alt={alt} />,
}));

jest.mock("@/api/fetch/admin", () => ({
  useGetUserDetail: jest.fn(),
}));

const mockedUseGetUserDetail = useGetUserDetail as jest.Mock;

const USER = {
  userId: 42,
  nickname: "짱구",
  email: "user@test.com",
  emailVerified: true,
  role: "USER",
  profileImg: null,
  privacyPolicyAgreed: true,
  termsOfServiceAgreed: true,
  contentPolicyAgreed: false,
  marketingConsent: false,
  createdAt: "2026-01-02T10:00:00",
  updatedAt: "2026-01-02T10:00:00",
  deletedAt: null,
  postCount: 3,
  commentCount: 5,
  reportCount: 1,
  subscribedCategories: ["WALLET"],
};

describe("UserDetailView", () => {
  it("유저 기본 정보, 활동 통계, 구독 카테고리를 보여줌", () => {
    mockedUseGetUserDetail.mockReturnValue({
      data: { result: USER },
      isLoading: false,
      isError: false,
    });

    render(<UserDetailView userId={42} />);

    expect(mockedUseGetUserDetail).toHaveBeenCalledWith({ userId: 42 });
    expect(screen.getByRole("heading", { name: "짱구" })).toBeInTheDocument();
    expect(screen.getByText("user@test.com")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("지갑")).toBeInTheDocument();
    expect(screen.queryByText("탈퇴")).not.toBeInTheDocument();
  });

  it("탈퇴한 유저는 탈퇴 표시와 탈퇴일을 보여줌", () => {
    mockedUseGetUserDetail.mockReturnValue({
      data: { result: { ...USER, deletedAt: "2026-03-01T10:00:00" } },
      isLoading: false,
      isError: false,
    });

    render(<UserDetailView userId={42} />);

    expect(screen.getByText("탈퇴")).toBeInTheDocument();
    expect(screen.getByText("탈퇴일")).toBeInTheDocument();
  });

  it("조회에 실패하면 안내 문구를 보여줌", () => {
    mockedUseGetUserDetail.mockReturnValue({ data: undefined, isLoading: false, isError: true });

    render(<UserDetailView userId={42} />);

    expect(screen.getByText("유저 정보를 불러오지 못했어요.")).toBeInTheDocument();
  });
});
