import AdminMenuSection from "../AdminMenuSection/AdminMenuSection";
import AdminProfile from "../AdminProfile/AdminProfile";

/**
 * PC 화면에서 모든 관리자 화면 왼쪽에 고정되는 사이드바입니다.
 *
 * @remarks
 * - PC 미만에서는 렌더만 하고 숨기며, 그 크기에서는 `/admin` 메인이 같은 프로필과 메뉴를 보여줍니다.
 * - 본문을 스크롤해도 화면에 고정됩니다. 메뉴가 화면 높이보다 길면 메뉴 영역만 안에서 스크롤됩니다.
 * - macOS의 오버레이 스크롤바는 스크롤하기 전까지 보이지 않아 메뉴가 잘린 것처럼 보이므로, 웹킷 스크롤바를 직접 그려 항상 보이게 합니다.
 */

const AdminSidebar = () => {
  return (
    <aside
      aria-label="관리자 사이드바"
      className="hidden pc:sticky pc:top-0 pc:flex pc:h-dvh pc:w-[320px] pc:shrink-0 pc:flex-col pc:border-r pc:border-divider-default"
    >
      <div className="pc:shrink-0 pc:border-b pc:border-divider-default">
        <AdminProfile />
      </div>
      <div className="pc:min-h-0 pc:flex-1 pc:overflow-y-auto [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#d4d4d4] [&::-webkit-scrollbar]:w-[6px]">
        <AdminMenuSection />
      </div>
    </aside>
  );
};

export default AdminSidebar;
