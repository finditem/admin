import AdminMenuSection from "../AdminMenuSection/AdminMenuSection";
import AdminProfile from "../AdminProfile/AdminProfile";

/**
 * PC 화면에서 모든 관리자 화면 왼쪽에 고정되는 사이드바입니다.
 *
 * @remarks
 * - PC 미만에서는 렌더만 하고 숨기며, 그 크기에서는 `/admin` 메인이 같은 프로필과 메뉴를 보여줍니다.
 */

const AdminSidebar = () => {
  return (
    <aside
      aria-label="관리자 사이드바"
      className="hidden pc:sticky pc:top-0 pc:flex pc:h-dvh pc:w-[320px] pc:shrink-0 pc:flex-col pc:overflow-y-auto pc:border-r pc:border-divider-default"
    >
      <AdminProfile />
      <AdminMenuSection />
    </aside>
  );
};

export default AdminSidebar;
