import { useSyncExternalStore } from "react";
import {
  ADMIN_NAV_COLLAPSED_ATTRIBUTE,
  ADMIN_NAV_COLLAPSED_STORAGE_KEY as STORAGE_KEY,
} from "../../_constants/ADMIN_NAV_COLLAPSED";

const EMPTY_SNAPSHOT = "[]";

const listeners = new Set<() => void>();

const syncAttribute = (ids: string[]) => {
  document
    .querySelector(`[${ADMIN_NAV_COLLAPSED_ATTRIBUTE}]`)
    ?.setAttribute(ADMIN_NAV_COLLAPSED_ATTRIBUTE, ids.join(" "));
};

const subscribe = (listener: () => void) => {
  const handleStorage = () => {
    syncAttribute(parseIds(getSnapshot()));
    listener();
  };

  listeners.add(listener);
  window.addEventListener("storage", handleStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
};

const getSnapshot = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? EMPTY_SNAPSHOT;
  } catch {
    return EMPTY_SNAPSHOT;
  }
};

const getServerSnapshot = () => EMPTY_SNAPSHOT;

const parseIds = (snapshot: string): string[] => {
  try {
    const parsed: unknown = JSON.parse(snapshot);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
};

/**
 * 관리자 메뉴에서 접힌 섹션을 localStorage에 기억하는 훅입니다.
 *
 * @remarks
 * - 서버 렌더와 하이드레이션 중에는 모든 섹션을 펼친 상태로 보고, 그 직후 저장된 상태로 바뀝니다. 그 사이 화면은 `AdminNavCollapsedScript`가 미리 접어 둡니다.
 * - 상태를 바꿀 때마다 `AdminNavCollapsedScript`의 CSS가 보는 레이아웃 속성도 함께 갱신합니다.
 * - 다른 탭에서 바꾼 상태도 `storage` 이벤트로 따라갑니다.
 * - localStorage를 쓸 수 없는 환경에서는 저장만 건너뛰고 모두 펼친 상태로 동작합니다.
 *
 * @example
 * ```tsx
 * const { isCollapsed, toggle } = useCollapsedNavSections();
 * ```
 */

const useCollapsedNavSections = () => {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const collapsedIds = parseIds(snapshot);

  const isCollapsed = (id: string) => collapsedIds.includes(id);

  const toggle = (id: string) => {
    const next = isCollapsed(id)
      ? collapsedIds.filter((collapsedId) => collapsedId !== id)
      : [...collapsedIds, id];

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      return;
    }

    syncAttribute(next);
    listeners.forEach((listener) => listener());
  };

  return { isCollapsed, toggle };
};

export default useCollapsedNavSections;
