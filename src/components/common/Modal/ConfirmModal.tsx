import type { ReactNode } from "react";
import { cn } from "@/utils";
import Icon, { Props as IconProps } from "../Icon/Icon";
import { sizeMap, style } from "./CONST_MODAL";
import ModalLayout from "./_internal/ModalLayout";

/**
 * 확인/취소 액션을 제공하는 모달 컴포넌트입니다.
 *
 * @remarks
 * - ESC 키 및 백드롭 클릭 시 `onClose`가 호출됩니다.
 * - `isPending`이면 확인 버튼을 비활성화해 요청이 중복으로 나가지 않게 합니다.
 *
 * @author jikwon
 */

interface ConfirmModalProps {
  /** 모달 제목 */
  title: ReactNode;
  /** 모달 내용 */
  content: ReactNode;
  /** 아이콘 (이름/크기/접근성 라벨만 사용) */
  icon?: Pick<IconProps, "name" | "size" | "title">;
  /** 모달 열림 여부 */
  isOpen: boolean;
  /** 닫기 핸들러 (ESC/백드롭 포함) */
  onClose: () => void;
  /** 확인 버튼 클릭 핸들러 */
  onConfirm: () => void;
  /** 취소 버튼 클릭 핸들러 */
  onCancel: () => void;
  /** 확인 버튼 문구 (default: '확인') */
  confirmLabel?: string;
  /** 확인 요청 진행 중 여부 */
  isPending?: boolean;
  /** 모달 크기 (default: 'medium') */
  size?: "small" | "medium";
}

/**
 * @example
 * ```tsx
 * <ConfirmModal
 *   title="삭제하시겠습니까?"
 *   content="삭제된 데이터는 복구할 수 없습니다."
 *   confirmLabel="삭제"
 *   isOpen={isOpen}
 *   onClose={onClose}
 *   onConfirm={onConfirm}
 *   onCancel={onCancel}
 * />
 * ```
 */

const ConfirmModal = ({
  isOpen,
  onClose,
  title,
  content,
  icon,
  onConfirm,
  onCancel,
  confirmLabel = "확인",
  isPending = false,
  size = "medium",
}: ConfirmModalProps) => {
  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      className={cn("max-w-[calc(100vw-32px)] gap-6 p-6 flex-col-center", sizeMap[size])}
    >
      <div className="gap-4 flex-col-center">
        {icon && (
          <div className="size-12 rounded-full bg-fill-neutralInversed-normal-enteredSelected flex-center">
            <Icon name={icon.name} size={icon.size} title={icon.title} className="text-white" />
          </div>
        )}
        <div className="gap-1 text-center flex-col-center">
          <div id="modal-title" className="text-h3-semibold text-layout-header-default">
            {title}
          </div>
          <div id="modal-desc" className="text-body2-regular text-layout-body-default">
            {content}
          </div>
        </div>
      </div>

      <div className="w-full gap-2 flex-center">
        <button type="button" className={cn(style.baseBtn, style.cancelBtn)} onClick={onCancel}>
          취소
        </button>
        <button
          type="button"
          className={cn(style.baseBtn, style.confirmBtn, "disabled:opacity-50")}
          onClick={onConfirm}
          disabled={isPending}
        >
          {confirmLabel}
        </button>
      </div>
    </ModalLayout>
  );
};

export default ConfirmModal;
