import { Table, tableFromArrays, tableFromIPC, tableToIPC } from 'apache-arrow';

type Plain = Record<string, unknown>;
type ArrowResult<T = Plain> = { result: T[]; table: Table };

class Arrow {
  static readonly #ARRAY_PREFIX = '\x00ARR:';

  createArrowBuffer(data: Plain[]): Uint8Array {
    const len = data.length;
    if (len === 0) return new Uint8Array(0);

    const columns = new Map<string, unknown[]>();

    for (let i = 0; i < len; i++) {
      this.#flattenIntoColumns(data[i] as Plain, '', i, columns, len);
    }

    return tableToIPC(tableFromArrays(Object.fromEntries(columns)), 'file');
  }

  fromArrowBuffer<T = Plain>(buffer: Uint8Array): ArrowResult<T> {
    const table = tableFromIPC(buffer);
    return { result: this.#deserializeTable(table) as T[], table };
  }

  selectFromBuffer<T = Plain>(buffer: Uint8Array, columns: string[]): ArrowResult<T> {
    const table = tableFromIPC(buffer);
    const selected = table.select(this.#resolveColumns(table, columns));
    return { result: this.#deserializeTable(selected) as T[], table };
  }

  sliceFromBuffer<T = Plain>(buffer: Uint8Array, start: number, end: number): ArrowResult<T> {
    const table = tableFromIPC(buffer);
    const sliced = table.slice(start, end);
    return { result: this.#deserializeTable(sliced) as T[], table };
  }

  schema(buffer: Uint8Array) {
    const table = tableFromIPC(buffer);

    return {
      fields: table.schema.fields.map(f => ({
        name: f.name,
        type: f.type.toString(),
      })),
    };
  }

  #resolveColumns(table: Table, columns: string[]): string[] {
    const cols = table.schema.fields.map((f: { name: string }) => f.name);
    const resolved: string[] = [];

    for (const col of columns) {
      if (!col.endsWith('.*')) {
        resolved.push(col);
        continue;
      }

      const prefix = col.slice(0, -1);
      for (const name of cols) {
        if (name.startsWith(prefix)) resolved.push(name);
      }
    }

    return resolved;
  }

  #deserializeTable(table: Table): Plain[] {
    const numRows = table.numRows;
    if (numRows === 0) return [];

    const results: Plain[] = Array.from({ length: numRows }, () => ({}));

    const fields = table.schema.fields
      .map((field: { name: string }) => ({
        parts: field.name.split('.'),
        column: table.getChild(field.name),
      }))
      .filter(
        (f: {
          parts: string[];
          column: ReturnType<typeof table.getChild>;
        }): f is {
          parts: string[];
          column: NonNullable<ReturnType<typeof table.getChild>>;
        } => f.column !== null
      );

    for (const { parts, column } of fields) {
      for (let rowIdx = 0; rowIdx < numRows; rowIdx++) {
        let value: unknown = column.get(rowIdx);

        if (typeof value === 'string' && value.startsWith(Arrow.#ARRAY_PREFIX)) {
          value = JSON.parse(value.slice(Arrow.#ARRAY_PREFIX.length));
        }

        this.#setNestedValue(results[rowIdx] as Plain, parts, value);
      }
    }

    return results;
  }

  #flattenIntoColumns(
    obj: Plain,
    prefix: string,
    rowIndex: number,
    columns: Map<string, unknown[]>,
    totalRows: number
  ): void {
    for (const key in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

      const value: unknown = obj[key];
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (
        value !== null &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        !(value instanceof Date)
      ) {
        this.#flattenIntoColumns(value as Plain, fullKey, rowIndex, columns, totalRows);
        continue;
      }

      let col = columns.get(fullKey);
      if (col === undefined) {
        col = new Array<unknown>(totalRows).fill(undefined);
        columns.set(fullKey, col);
      }

      col[rowIndex] = Array.isArray(value) ? Arrow.#ARRAY_PREFIX + JSON.stringify(value) : value;
    }
  }

  #setNestedValue(current: Plain, parts: string[], value: unknown): void {
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i] as string;
      if (current[part] === undefined) current[part] = {};
      current = current[part] as Plain;
    }
    (current as Record<string, unknown>)[parts[parts.length - 1] as string] = value;
  }
}

export default Arrow;
export type { Plain, ArrowResult };
