import { DbTable } from "../../_types/DbQueryType";
import { buildFieldFilter, buildTableQuery, DB_PAGE_SIZE } from "./buildTableQuery";

const TABLE: DbTable = {
  id: 23,
  name: "notice",
  fields: [
    { id: 1, name: "id", baseType: "type/BigInteger", isPrimaryKey: true },
    { id: 2, name: "title", baseType: "type/Text", isPrimaryKey: false },
    { id: 3, name: "created_at", baseType: "type/DateTime", isPrimaryKey: false },
  ],
};

describe("buildFieldFilter", () => {
  it("문자 컬럼은 대소문자를 가리지 않는 부분 일치로 찾는다", () => {
    expect(buildFieldFilter(TABLE.fields[1], "공지")).toEqual([
      "contains",
      ["field", 2, null],
      "공지",
      { "case-sensitive": false },
    ]);
  });

  it("숫자 컬럼은 숫자로 바꿔 값 일치로 찾는다", () => {
    expect(buildFieldFilter(TABLE.fields[0], "15")).toEqual(["=", ["field", 1, null], 15]);
  });

  it("숫자 컬럼에 숫자가 아닌 값을 넣으면 에러를 던진다", () => {
    expect(() => buildFieldFilter(TABLE.fields[0], "abc")).toThrow("id 컬럼은 숫자로 찾아야 해요.");
  });

  it("그 밖의 컬럼은 입력한 문자열 그대로 값 일치로 찾는다", () => {
    expect(buildFieldFilter(TABLE.fields[2], "2026-09-27")).toEqual([
      "=",
      ["field", 3, null],
      "2026-09-27",
    ]);
  });
});

describe("buildTableQuery", () => {
  it("기본 키 내림차순으로 요청한 페이지를 조회하고, 건수 쿼리에는 정렬과 페이지를 넣지 않는다", () => {
    const { rowsQuery, countQuery } = buildTableQuery(TABLE, { page: 3 });

    expect(rowsQuery).toEqual({
      "source-table": 23,
      "order-by": [["desc", ["field", 1, null]]],
      page: { page: 3, items: DB_PAGE_SIZE },
    });
    expect(countQuery).toEqual({ "source-table": 23, aggregation: [["count"]] });
  });

  it("필터를 조회 쿼리와 건수 쿼리 양쪽에 건다", () => {
    const { rowsQuery, countQuery } = buildTableQuery(TABLE, {
      page: 1,
      filter: { fieldId: 2, keyword: "공지" },
    });
    const expectedFilter = ["contains", ["field", 2, null], "공지", { "case-sensitive": false }];

    expect(rowsQuery).toHaveProperty("filter", expectedFilter);
    expect(countQuery).toHaveProperty("filter", expectedFilter);
  });

  it("테이블에 없는 컬럼으로 필터하면 필터 없이 조회한다", () => {
    const { rowsQuery } = buildTableQuery(TABLE, {
      page: 1,
      filter: { fieldId: 99, keyword: "x" },
    });

    expect(rowsQuery).not.toHaveProperty("filter");
  });

  it("기본 키가 없으면 정렬하지 않는다", () => {
    const { rowsQuery } = buildTableQuery(
      { ...TABLE, fields: TABLE.fields.map((field) => ({ ...field, isPrimaryKey: false })) },
      { page: 1 }
    );

    expect(rowsQuery).not.toHaveProperty("order-by");
  });
});
