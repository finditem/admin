import { DbField, DbTable, DbTableFilter } from "../../_types/DbQueryType";

export const DB_PAGE_SIZE = 50;

const NUMBER_TYPES = [
  "type/Integer",
  "type/BigInteger",
  "type/Float",
  "type/Decimal",
  "type/Number",
];

/**
 * 컬럼 필터를 Metabase 쿼리(MBQL) 조건으로 바꿉니다.
 *
 * @remarks
 * - 문자 컬럼은 대소문자를 가리지 않는 부분 일치, 나머지는 값 일치로 찾습니다.
 * - 숫자 컬럼에 숫자가 아닌 값을 넣으면 조회하지 않도록 에러를 던집니다.
 */
export const buildFieldFilter = (field: DbField, keyword: string) => {
  const ref = ["field", field.id, null];

  if (field.baseType === "type/Text") {
    return ["contains", ref, keyword, { "case-sensitive": false }];
  }

  if (NUMBER_TYPES.includes(field.baseType)) {
    const value = Number(keyword);
    if (keyword.trim() === "" || Number.isNaN(value)) {
      throw new Error(`${field.name} 컬럼은 숫자로 찾아야 해요.`);
    }
    return ["=", ref, value];
  }

  return ["=", ref, keyword];
};

interface BuildTableQueryOptions {
  page: number;
  filter?: DbTableFilter;
}

/**
 * 테이블 한 페이지 조회용 쿼리와 전체 건수 쿼리를 만듭니다.
 *
 * @remarks
 * - 기본 키가 있으면 최신 행이 먼저 보이도록 기본 키 내림차순으로 정렬합니다.
 * - 필터 컬럼이 테이블에 없으면 필터 없이 조회합니다.
 */
export const buildTableQuery = (table: DbTable, { page, filter }: BuildTableQueryOptions) => {
  const filterField = filter && table.fields.find((field) => field.id === filter.fieldId);
  const primaryKey = table.fields.find((field) => field.isPrimaryKey);

  const baseQuery = {
    "source-table": table.id,
    ...(filterField && filter.keyword && { filter: buildFieldFilter(filterField, filter.keyword) }),
  };

  return {
    rowsQuery: {
      ...baseQuery,
      ...(primaryKey && { "order-by": [["desc", ["field", primaryKey.id, null]]] }),
      page: { page, items: DB_PAGE_SIZE },
    },
    countQuery: { ...baseQuery, aggregation: [["count"]] },
  };
};
