"use client";

import { ConfirmModal } from "@/components";
import { useDeletePlace } from "@/api/fetch/admin";
import { PlaceSummaryForAdmin } from "@/api/fetch/admin";

interface DeletePlaceConfirmModalProps {
  place: PlaceSummaryForAdmin | null;
  onClose: () => void;
  /** 삭제 API 성공 시 호출. 목록에서 해당 항목을 빼는 등 화면 반영은 호출하는 쪽 책임이다. */
  onDeleted: () => void;
}

const DeletePlaceConfirmModal = ({ place, onClose, onDeleted }: DeletePlaceConfirmModalProps) => {
  const { mutate: deletePlace, isPending } = useDeletePlace(place?.placeId ?? 0);

  const handleConfirm = () => {
    if (!place) return;
    deletePlace(undefined, { onSuccess: onDeleted });
  };

  return (
    <ConfirmModal
      isOpen={Boolean(place)}
      onClose={onClose}
      onCancel={onClose}
      onConfirm={handleConfirm}
      title={`'${place?.name ?? ""}' 장소를 삭제하시겠습니까?`}
      content="삭제된 장소는 목록에서 사라집니다."
      confirmLabel="삭제"
      isPending={isPending}
    />
  );
};

export default DeletePlaceConfirmModal;
