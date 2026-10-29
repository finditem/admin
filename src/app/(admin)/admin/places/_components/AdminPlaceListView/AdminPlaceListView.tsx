"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ErrorBoundary } from "@/app/ErrorBoundary";
import { PopupLayout, Button, RadioOptionItem } from "@/components";
import { AdminFilter, AdminSearch } from "../../../_components";
import { PLACE_TYPE_OPTIONS, PlaceTypeFilter } from "../../_constants/PLACE_TYPE_OPTIONS";
import AdminPlaceList from "../AdminPlaceList/AdminPlaceList";

const AdminPlaceListView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";

  const typeParam = searchParams.get("type");
  const type: PlaceTypeFilter =
    PLACE_TYPE_OPTIONS.find((option) => option.value === typeParam)?.value ?? "";
  const [pendingType, setPendingType] = useState<PlaceTypeFilter | null>(null);

  const placeFilters = [
    {
      label: PLACE_TYPE_OPTIONS.find((option) => option.value === type)?.label ?? "유형",
      onSelected: !!type,
      onClick: () => setPendingType(type),
    },
  ];

  const updateQuery = (key: "keyword" | "type", value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`?${params.toString()}`);
  };

  const handleApply = () => {
    updateQuery("type", pendingType as PlaceTypeFilter);
    setPendingType(null);
  };

  const handleSearch = (newKeyword: string) => updateQuery("keyword", newKeyword);

  return (
    <>
      <div className="h-base">
        <div className="flex items-center gap-2 pr-5">
          <div className="min-w-0 flex-1">
            <AdminSearch
              placeholder="장소 이름을 입력해 주세요."
              onEnter={handleSearch}
              defaultValue={keyword}
            />
          </div>
          <Button as={Link} href="/admin/places/new" size="small" className="shrink-0">
            장소 등록
          </Button>
        </div>

        <AdminFilter filters={placeFilters} />

        <ErrorBoundary toastMessage="성수 콘텐츠를 불러오지 못했어요">
          <AdminPlaceList type={type} keyword={keyword} />
        </ErrorBoundary>
      </div>

      {pendingType !== null && (
        <PopupLayout
          isOpen={pendingType !== null}
          onClose={() => setPendingType(null)}
          className="w-full gap-8 px-5 py-10 flex-col-center"
        >
          <h2 className="text-h2-medium text-layout-header-default">장소 유형 선택</h2>
          <div className="w-full">
            {PLACE_TYPE_OPTIONS.map((option) => (
              <RadioOptionItem
                key={option.value}
                option={option}
                selected={pendingType}
                onChange={(value) => setPendingType(value as PlaceTypeFilter)}
                inputName="placeType"
              />
            ))}
          </div>
          <Button className="w-full" onClick={handleApply}>
            적용하기
          </Button>
        </PopupLayout>
      )}
    </>
  );
};

export default AdminPlaceListView;
