import { toCsv } from "./toCsv";

describe("toCsv", () => {
  it("BOM을 붙이고 머리글과 행을 줄바꿈으로 잇는다", () => {
    const csv = toCsv({ columns: ["id", "title"], columnTypes: [], rows: [[1, "공지"]] });

    expect(csv).toBe("﻿id,title\r\n1,공지");
  });

  it("쉼표, 따옴표, 줄바꿈이 있는 값은 따옴표로 감싸고 따옴표를 두 번 쓴다", () => {
    const csv = toCsv({
      columns: ["v"],
      columnTypes: [],
      rows: [["a,b"], ['say "hi"'], ["줄\n바꿈"]],
    });

    expect(csv).toBe('﻿v\r\n"a,b"\r\n"say ""hi"""\r\n"줄\n바꿈"');
  });

  it("null은 빈 칸, 객체는 JSON으로 적는다", () => {
    const csv = toCsv({ columns: ["a", "b"], columnTypes: [], rows: [[null, { x: 1 }]] });

    expect(csv).toBe('﻿a,b\r\n,"{""x"":1}"');
  });
});
