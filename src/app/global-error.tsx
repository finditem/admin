"use client";

import { ErrorView } from "@/components";
import "@/app/globals.css";

export default function GlobalError() {
  return (
    <html lang="ko">
      <body className="mx-auto max-w-[768px] border-x-2 flex-col-center">
        <ErrorView
          iconName="ServerError"
          code="500"
          title="서버에 문제가 발생했습니다"
          description={
            <>
              현재 서버에 일시적인 문제가 발생했습니다. <br />
              잠시 후 다시 시도해주세요.
            </>
          }
        />
      </body>
    </html>
  );
}
