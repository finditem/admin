"use client";

import { EmptyState } from "@/components";
import { MOCK_ADMIN_PLACE_LIST } from "@/mock/data";
import { PlaceTypeFilter } from "../../_constants/PLACE_TYPE_OPTIONS";
import AdminPlaceListItem from "./_internal/AdminPlaceListItem/AdminPlaceListItem";

interface AdminPlaceListProps {
  type: PlaceTypeFilter;
  keyword: string;
}

const AdminPlaceList = ({ type, keyword }: AdminPlaceListProps) => {
  // 관리자용 장소 목록 조회 API가 아직 없어 mock으로 대체한다 (백엔드 API 가정 명세서 참고).
  // 실제 API가 생기면 이 필터링은 서버 쿼리 파라미터로 옮긴다.
  const places = MOCK_ADMIN_PLACE_LIST.filter((place) => {
    const matchesType = !type || place.type === type;
    const matchesKeyword = !keyword || place.name.includes(keyword);
    return matchesType && matchesKeyword;
  });

  if (places.length === 0) {
    const emptyContent = keyword
      ? {
          title: "검색 결과가 없어요",
          description: "다른 검색어나 조건으로 다시 찾아보세요.",
        }
      : {
          title: "등록된 장소가 없어요",
          description: "장소를 등록하면 이곳에 표시됩니다.",
        };

    return (
      <EmptyState
        icon={{ iconName: "NoPublicDataSearch", iconSize: 70 }}
        title={emptyContent.title}
        description={emptyContent.description}
      />
    );
  }

  return (
    <section aria-label="성수 콘텐츠 목록">
      <ul>
        {places.map((place) => (
          <AdminPlaceListItem key={place.placeId} data={place} />
        ))}
      </ul>
    </section>
  );
};

export default AdminPlaceList;
