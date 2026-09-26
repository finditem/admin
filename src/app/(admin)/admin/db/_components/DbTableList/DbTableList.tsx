"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components";
import { cn } from "@/utils";

interface DbTableListProps {
  tables: { id: number; name: string }[];
  currentTableId?: number;
}

// PC에서 스크롤해도 헤더(56px)와 탭 줄(60px) 아래에 붙어 있게 하고, 목록이 길면 목록 안에서만 스크롤한다.
const STICKY_STYLE =
  "hide-scrollbar pc:sticky pc:top-[calc(116px+var(--safe-area-top))] pc:max-h-[calc(100dvh-140px-var(--safe-area-top))] pc:self-start pc:overflow-y-auto";

/**
 * 조회할 테이블을 고르는 목록입니다.
 *
 * @remarks
 * - 테이블이 많아 이름으로 바로 좁혀 볼 수 있게 합니다.
 * - 데이터를 넓게 보고 싶을 때 목록을 접을 수 있습니다.
 */
const DbTableList = ({ tables, currentTableId }: DbTableListProps) => {
  const [keyword, setKeyword] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const visibleTables = tables.filter((table) =>
    table.name.toLowerCase().includes(keyword.trim().toLowerCase())
  );

  return (
    <nav
      aria-labelledby="db-table-list-title"
      className={cn("flex shrink-0 flex-col gap-3", STICKY_STYLE, isOpen && "pc:w-[240px]")}
    >
      {/* 목록이 길어 안에서 스크롤할 때도 개수와 접기 버튼은 위에 남긴다. */}
      <div className="sticky top-0 z-10 flex items-center justify-between gap-2 bg-white">
        <h2
          id="db-table-list-title"
          className={cn("text-body2-regular text-layout-body-default", !isOpen && "sr-only")}
        >
          테이블 {tables.length}개
        </h2>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-controls="db-table-list-body"
          aria-label={isOpen ? "테이블 목록 접기" : "테이블 목록 펼치기"}
          className="size-8 rounded-[8px] text-neutral-strong-default flex-center hover:bg-flatGray-25"
        >
          <Icon name={isOpen ? "ArrowLeftSmall" : "ArrowRightSmall"} size={24} />
        </button>
      </div>

      <div id="db-table-list-body" className={cn("flex-col gap-3", isOpen ? "flex" : "hidden")}>
        <input
          type="search"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="테이블 이름 검색"
          aria-label="테이블 이름 검색"
          className="h-10 rounded-[10px] border border-divider-default px-3 text-body2-regular outline-none bg-fill-neutral-subtle-default placeholder:text-neutral-normal-placeholder"
        />

        <ul className="flex flex-col">
          {visibleTables.map((table) => (
            <li key={table.id}>
              <Link
                href={`/admin/db?table=${table.id}`}
                aria-current={table.id === currentTableId ? "page" : undefined}
                className="block truncate rounded-[8px] px-3 py-2 text-body2-regular text-neutral-strong-default hover:bg-flatGray-25 aria-[current=page]:text-brand-normal-default aria-[current=page]:bg-fill-brand-subtle-default"
              >
                {table.name}
              </Link>
            </li>
          ))}
        </ul>

        {visibleTables.length === 0 && (
          <p className="px-3 text-body2-regular text-layout-body-default">
            일치하는 테이블이 없어요.
          </p>
        )}
      </div>
    </nav>
  );
};

export default DbTableList;
