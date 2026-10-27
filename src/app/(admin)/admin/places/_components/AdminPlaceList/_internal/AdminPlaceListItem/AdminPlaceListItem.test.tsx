import { render, screen } from "@testing-library/react";
import AdminPlaceListItem from "./AdminPlaceListItem";
import { MOCK_ADMIN_PLACE_LIST } from "@/mock/data";

const place = MOCK_ADMIN_PLACE_LIST[1]; // RESTAURANT 타입

describe("AdminPlaceListItem", () => {
  it("이름/주소/역 거리/타입 라벨을 렌더링한다", () => {
    render(<AdminPlaceListItem data={place} onDeleteClick={jest.fn()} />);

    expect(screen.getByRole("heading", { name: place.name })).toBeInTheDocument();
    expect(screen.getByText(place.address)).toBeInTheDocument();
    expect(screen.getByText(`역에서 ${place.stationDistanceMeters}m`)).toBeInTheDocument();
    expect(screen.getByText("맛집")).toBeInTheDocument();
  });

  it("수정 링크가 해당 장소의 수정 페이지로 연결된다", () => {
    render(<AdminPlaceListItem data={place} onDeleteClick={jest.fn()} />);

    expect(screen.getByRole("link", { name: "수정" })).toHaveAttribute(
      "href",
      `/admin/places/${place.placeId}/edit`
    );
  });

  it("삭제 버튼 클릭 시 onDeleteClick에 해당 장소 데이터를 넘긴다", () => {
    const onDeleteClick = jest.fn();
    render(<AdminPlaceListItem data={place} onDeleteClick={onDeleteClick} />);

    screen.getByRole("button", { name: "삭제" }).click();

    expect(onDeleteClick).toHaveBeenCalledWith(place);
  });
});
