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

  it("삭제 확인 모달에서 확인을 누르면 목록에서 해당 장소가 사라진다", () => {
    const target = MOCK_ADMIN_PLACE_LIST[0];
    render(<AdminPlaceList type="" keyword="" />);

    const item = screen.getByRole("heading", { name: target.name }).closest("li") as HTMLElement;
    fireEvent.click(within(item).getByRole("button", { name: "삭제" }));

    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText(`'${target.name}'을 삭제하시겠습니까?`)).toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole("button", { name: "삭제" }));

    expect(mockMutate).toHaveBeenCalled();
    expect(screen.queryByRole("heading", { name: target.name })).not.toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(MOCK_ADMIN_PLACE_LIST.length - 1);
  });
});
