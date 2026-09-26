"use client";

import { Fragment, ReactNode, useId } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components";
import { ADMIN_NAV_SECTIONS } from "../../_constants/ADMIN_NAV_SECTIONS";
import useCollapsedNavSections from "../../_hooks/useCollapsedNavSections/useCollapsedNavSections";
import { AdminLogoutButton } from "../_internal";

const AdminMenuSection = () => {
  const { isCollapsed, toggle } = useCollapsedNavSections();

  return (
    <nav aria-label="관리자 메뉴" className="flex flex-col gap-[6px]">
      {ADMIN_NAV_SECTIONS.map((section, index) => (
        <Fragment key={section.id}>
          <AdminSectionNavItem
            id={section.id}
            label={section.label}
            items={section.items}
            isCollapsed={isCollapsed(section.id)}
            onToggle={() => toggle(section.id)}
            footer={section.id === "account" && <AdminLogoutButton />}
          />

          {index < ADMIN_NAV_SECTIONS.length - 1 && <hr aria-hidden className="mx-5" />}
        </Fragment>
      ))}
    </nav>
  );
};

export default AdminMenuSection;

interface AdminSectionNavItemType {
  href: string;
  title: string;
  /** 사내 다른 서비스로 가는 링크이면 새 탭으로 엽니다. */
  external?: boolean;
}

interface AdminSectionNavItemProps {
  id: string;
  label: string;
  items: readonly AdminSectionNavItemType[];
  footer?: ReactNode;
  isCollapsed: boolean;
  onToggle: () => void;
}

const AdminSectionNavItem = ({
  id,
  label,
  items,
  footer,
  isCollapsed,
  onToggle,
}: AdminSectionNavItemProps) => {
  const pathname = usePathname();
  const listId = useId();

  const isCurrent = (href: string) =>
    pathname !== null && (pathname === href || pathname.startsWith(`${href}/`));

  return (
    <section
      aria-label={label}
      data-nav-section={id}
      className="flex flex-col gap-[2px] px-5 py-6 pc:py-3"
    >
      <h2>
        <button
          type="button"
          aria-expanded={!isCollapsed}
          aria-controls={listId}
          onClick={onToggle}
          className="flex w-full items-center justify-between text-body2-regular text-layout-body-default"
        >
          {label}
          <span data-nav-arrow className={isCollapsed ? undefined : "rotate-180"}>
            <Icon name="ArrowDown" size={16} />
          </span>
        </button>
      </h2>

      <ul id={listId} hidden={isCollapsed}>
        {items.map(({ href, title, external }) => (
          <li key={href}>
            <Link
              href={href}
              aria-current={isCurrent(href) ? "page" : undefined}
              {...(external && { target: "_blank", rel: "noopener noreferrer" })}
              className="group flex items-center justify-between py-[10px] pc:-mx-3 pc:rounded-[10px] pc:px-3 pc:py-2 pc:transition-colors pc:hover:bg-flatGray-25 pc:aria-[current=page]:bg-fill-brand-subtle-default"
            >
              <span className="text-body1-semibold text-neutral-strong-default pc:group-aria-[current=page]:text-brand-normal-default">
                {title}
                {external && <span className="sr-only"> (새 탭에서 열림)</span>}
              </span>
              <Icon
                name="ArrowRightSmall"
                size={24}
                className="text-neutral-strong-default pc:hidden"
              />
            </Link>
          </li>
        ))}

        {footer && <li>{footer}</li>}
      </ul>
    </section>
  );
};
