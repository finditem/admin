import "@testing-library/jest-dom";
import React from "react";

// IntersectionObserver 모킹
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

// swiper는 ESM 전용이라 jest에서 그대로 불러올 수 없으므로 렌더링만 흉내 내는 대역으로 바꾼다.
jest.mock("swiper/react", () => ({
  Swiper: ({ children }: any) => React.createElement("div", { "data-testid": "swiper" }, children),

  SwiperSlide: ({ children }: any) =>
    React.createElement("div", { "data-testid": "swiper-slide" }, children),
}));

jest.mock("swiper/modules", () => ({
  Pagination: {},
}));

jest.mock("swiper/css", () => ({}));
jest.mock("swiper/css/pagination", () => ({}));
