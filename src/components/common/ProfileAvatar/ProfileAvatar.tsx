"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/utils";
import { FALLBACK_SRC, getAvatarSrc } from "./_utils/getAvatarSrc";

/**
 * 유저 프로필 이미지 컴포넌트입니다.
 *
 * @remarks
 * - `src`가 없거나 깨진 URL이면 기본 프로필 이미지(`/user/default-profile.svg`)로 대체됩니다.
 *
 * @author jikwon
 */

interface ProfileAvatarProps {
  /** 프로필 이미지 URL */
  src?: string | null;
  /** 이미지 대체 텍스트. 유저 닉네임을 권장합니다. (default: '사용자') */
  alt?: string;
  /** 이미지 크기(px) */
  size: number;
  /** 추가 클래스 */
  className?: string;
  /** LCP 대상 여부. 헤더 등 주요 위치에서만 `true`로 설정합니다. (default: false) */
  priority?: boolean;
}

/**
 * @example
 * ```tsx
 * <ProfileAvatar src="https://..." alt="홍길동" size={40} />
 * <ProfileAvatar src={null} size={40} priority />
 * ```
 */

const ProfileAvatar = ({ src, alt, size, className, priority = false }: ProfileAvatarProps) => {
  const [imgSrc, setImgSrc] = useState(getAvatarSrc(src));

  useEffect(() => {
    setImgSrc(getAvatarSrc(src));
  }, [src]);

  return (
    <div
      className={cn("rounded-full", className)}
      style={{ width: size, height: size }}
      onDragStart={(e) => e.preventDefault()}
    >
      <Image
        src={imgSrc}
        alt={`${alt ?? "사용자"} 프로필`}
        width={size}
        height={size}
        sizes={`${size}px`}
        priority={priority}
        draggable={false}
        unoptimized={imgSrc === FALLBACK_SRC ? true : undefined}
        className={cn(
          "pointer-events-none h-full w-full select-none rounded-full object-cover",
          className
        )}
        onError={() => {
          if (imgSrc !== FALLBACK_SRC) setImgSrc(FALLBACK_SRC);
        }}
      />
    </div>
  );
};

export default ProfileAvatar;
