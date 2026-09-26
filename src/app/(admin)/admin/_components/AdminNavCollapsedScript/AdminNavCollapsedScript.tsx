import {
  ADMIN_NAV_COLLAPSED_ATTRIBUTE,
  ADMIN_NAV_COLLAPSED_STORAGE_KEY,
} from "../../_constants/ADMIN_NAV_COLLAPSED";
import { ADMIN_NAV_SECTIONS } from "../../_constants/ADMIN_NAV_SECTIONS";

const script = `try{var v=JSON.parse(localStorage.getItem(${JSON.stringify(ADMIN_NAV_COLLAPSED_STORAGE_KEY)})||"[]");if(Array.isArray(v))document.currentScript.parentElement.setAttribute(${JSON.stringify(ADMIN_NAV_COLLAPSED_ATTRIBUTE)},v.filter(function(i){return typeof i==="string"}).join(" "))}catch(e){}`;

const style = ADMIN_NAV_SECTIONS.map(({ id }) => {
  const scope = `[${ADMIN_NAV_COLLAPSED_ATTRIBUTE}~="${id}"] [data-nav-section="${id}"]`;
  return `${scope}>ul{display:none}${scope} [data-nav-arrow]{transform:none}`;
}).join("");

/**
 * 새로고침 직후 접힌 메뉴 섹션이 잠깐 펼쳐졌다가 접히지 않도록, 화면을 그리기 전에 접힘 상태를 적용합니다.
 *
 * @remarks
 * - 서버는 localStorage를 읽을 수 없어 모든 섹션을 펼친 상태로 그립니다. 이 스크립트가 본문보다 먼저 실행돼 부모 요소에 접힌 섹션 id를 달고, 함께 넣은 CSS가 그 섹션의 목록을 숨기고 화살표 방향을 바꿉니다.
 * - 부모 요소에는 `suppressHydrationWarning`을 줘야 합니다. 서버가 그린 속성값과 스크립트가 바꾼 값이 달라서입니다.
 * - 이후 상태 변경은 `useCollapsedNavSections`가 같은 속성을 갱신해 CSS와 어긋나지 않게 합니다.
 */

const AdminNavCollapsedScript = () => {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: style }} />
      <script dangerouslySetInnerHTML={{ __html: script }} />
    </>
  );
};

export default AdminNavCollapsedScript;
