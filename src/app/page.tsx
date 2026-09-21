import { redirect } from "next/navigation";

// 미들웨어가 계정 권한에 맞는 영역으로 먼저 보내므로, 이 화면은 미들웨어를 거치지 않은 경우의 대비책이다.
const RootPage = () => {
  redirect("/login");
};

export default RootPage;
