import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import GuestInquiryReplyForm from "./GuestInquiryReplyForm";
import { usePostGuestInquiryReply } from "@/api/fetch/admin";

jest.mock("@/components", () => ({
  Button: ({ children, loading, ...rest }: any) => <button {...rest}>{children}</button>,
}));

jest.mock("@/api/fetch/admin", () => ({
  usePostGuestInquiryReply: jest.fn(),
}));

const mutateMock = jest.fn();
const mockedUsePostGuestInquiryReply = usePostGuestInquiryReply as jest.Mock;

describe("GuestInquiryReplyForm", () => {
  beforeEach(() => {
    mutateMock.mockReset();
    mockedUsePostGuestInquiryReply.mockReturnValue({ mutate: mutateMock, isPending: false });
  });

  it("답변 내용이 비어 있으면 보내기 버튼이 비활성화됨", () => {
    render(<GuestInquiryReplyForm inquiryId={3} email="guest@test.com" />);

    expect(screen.getByRole("button", { name: "답변 보내기" })).toBeDisabled();
    expect(screen.getByText(/guest@test.com/)).toBeInTheDocument();
  });

  it("공백만 입력하면 보내기 버튼이 비활성화됨", () => {
    render(<GuestInquiryReplyForm inquiryId={3} email="guest@test.com" />);

    fireEvent.change(screen.getByLabelText("답변 내용"), { target: { value: "   " } });

    expect(screen.getByRole("button", { name: "답변 보내기" })).toBeDisabled();
  });

  it("답변을 입력해 보내면 앞뒤 공백을 지운 내용으로 요청하고, 성공 시 입력을 비움", () => {
    mutateMock.mockImplementation((_body, options) => options?.onSuccess?.());
    render(<GuestInquiryReplyForm inquiryId={3} email="guest@test.com" />);

    const textarea = screen.getByLabelText("답변 내용") as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: "  확인했습니다.  " } });
    fireEvent.click(screen.getByRole("button", { name: "답변 보내기" }));

    expect(mockedUsePostGuestInquiryReply).toHaveBeenCalledWith(3);
    expect(mutateMock).toHaveBeenCalledWith({ content: "확인했습니다." }, expect.any(Object));
    expect(textarea.value).toBe("");
  });

  it("발송 중에는 입력창과 버튼이 비활성화됨", () => {
    mockedUsePostGuestInquiryReply.mockReturnValue({ mutate: mutateMock, isPending: true });
    render(<GuestInquiryReplyForm inquiryId={3} email="guest@test.com" />);

    expect(screen.getByLabelText("답변 내용")).toBeDisabled();
    expect(screen.getByRole("button", { name: "답변 보내기" })).toBeDisabled();
  });
});
