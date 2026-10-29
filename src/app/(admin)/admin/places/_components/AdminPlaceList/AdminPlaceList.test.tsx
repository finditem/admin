import { render, screen, within, fireEvent } from "@testing-library/react";
import AdminPlaceList from "./AdminPlaceList";
import { MOCK_ADMIN_PLACE_LIST } from "@/mock/data";

const mockMutate = jest.fn((_, { onSuccess }: { onSuccess: () => void }) => onSuccess());

jest.mock("@/api/fetch/admin", () => ({
  ...jest.requireActual("@/api/fetch/admin"),
  useDeletePlace: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}));

describe("AdminPlaceList", () => {
  beforeEach(() => {
    mockMutate.mockClear();
  });

  it("필터 없이 전체 목록을 렌더링한다", () => {
    render(<AdminPlaceList type="" keyword="" />);

    const region = screen.getByRole("region", { name: "성수 콘텐츠 목록" });
    expect(within(region).getAllByRole("listitem")).toHaveLength(MOCK_ADMIN_PLACE_LIST.length);
  });

  it("타입으로 필터링한다", () => {
    render(<AdminPlaceList type="POPUP" keyword="" />);

    const expected = MOCK_ADMIN_PLACE_LIST.filter((place) => place.type === "POPUP");
    const region = screen.getByRole("region", { name: "성수 콘텐츠 목록" });
    expect(within(region).getAllByRole("listitem")).toHaveLength(expected.length);
    expected.forEach((place) => {
      expect(screen.getByRole("heading", { name: place.name })).toBeInTheDocument();
    });
  });

  it("이름 키워드로 필터링한다", () => {
    const target = MOCK_ADMIN_PLACE_LIST[0];
    render(<AdminPlaceList type="" keyword={target.name.slice(0, 2)} />);

    expect(screen.getByRole("heading", { name: target.name })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });

  it("검색 결과가 없으면 빈 상태를 보여준다", () => {
    render(<AdminPlaceList type="" keyword="존재하지않는장소이름" />);

    expect(screen.getByText("검색 결과가 없어요")).toBeInTheDocument();
  });

  it("삭제가 막혀 있어 삭제 버튼을 눌러도 확인 모달이 열리지 않는다", () => {
    const target = MOCK_ADMIN_PLACE_LIST[0];
    render(<AdminPlaceList type="" keyword="" />);

    const item = screen.getByRole("heading", { name: target.name }).closest("li") as HTMLElement;
    const deleteButton = within(item).getByRole("button", { name: "삭제" });
    expect(deleteButton).toBeDisabled();

    fireEvent.click(deleteButton);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(mockMutate).not.toHaveBeenCalled();
    expect(screen.getAllByRole("listitem")).toHaveLength(MOCK_ADMIN_PLACE_LIST.length);
  });
});
