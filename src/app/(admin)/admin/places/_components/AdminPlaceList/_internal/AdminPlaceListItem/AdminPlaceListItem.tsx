import Link from "next/link";
import { ListItemImage } from "@/components";
import { PlaceSummaryForAdmin } from "@/api/fetch/admin";

const PLACE_TYPE_LABEL: Record<PlaceSummaryForAdmin["type"], string> = {
  CAFE: "카페",
  RESTAURANT: "맛집",
  POPUP: "팝업",
};

interface AdminPlaceListItemProps {
  data: PlaceSummaryForAdmin;
  onDeleteClick: (data: PlaceSummaryForAdmin) => void;
}

const AdminPlaceListItem = ({ data, onDeleteClick }: AdminPlaceListItemProps) => {
  const { placeId, name, type, address, thumbnailUrl, stationDistanceMeters } = data;

  return (
    <li className="flex w-full items-center gap-[14px] border-b border-b-flatGray-50 px-5 py-[30px]">
      <ListItemImage src={thumbnailUrl} alt={`${name} 썸네일`} size={72} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <span className="text-caption1-medium text-brand-normal-default">
            {PLACE_TYPE_LABEL[type]}
          </span>
        </div>
        <h2 className="text-h3-semibold text-layout-header-default u-ellipsis">{name}</h2>
        <p className="mt-1 text-body2-regular text-layout-body-default u-ellipsis">{address}</p>
        <p className="text-caption1-regular text-neutral-strong-placeholder">
          역에서 {stationDistanceMeters}m
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <Link
          href={`/admin/places/${placeId}/edit`}
          className="text-body2-regular text-brand-normal-default"
        >
          수정
        </Link>
        <button
          type="button"
          onClick={() => onDeleteClick(data)}
          className="text-body2-regular text-system-warning"
        >
          삭제
        </button>
      </div>
    </li>
  );
};

export default AdminPlaceListItem;
