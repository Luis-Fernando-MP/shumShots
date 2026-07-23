import { decompress, decompressSync, gzip, gzipSync, strFromU8, strToU8 } from 'fflate';

type CompressionLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type CompressionMem = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type FlateInput = Uint8Array | string;

class Flate {
  readonly #level: CompressionLevel;
  readonly #mem: CompressionMem;

  constructor(level: CompressionLevel = 6, mem: CompressionMem = 4) {
    this.#level = level;
    this.#mem = mem;
  }

  compress(data: FlateInput): Uint8Array {
    return gzipSync(typeof data === 'string' ? strToU8(data) : data, {
      level: this.#level,
      mem: this.#mem,
    });
  }

  decompress(data: Uint8Array, asString?: false): Uint8Array;
  decompress(data: Uint8Array, asString: true): string;
  decompress(data: Uint8Array, asString = false): Uint8Array | string {
    const result = decompressSync(data);
    return asString ? strFromU8(result) : result;
  }

  compressAsync(data: FlateInput): Promise<Uint8Array> {
    const buf = typeof data === 'string' ? strToU8(data) : data;
    return new Promise((resolve, reject) =>
      gzip(buf, { level: this.#level, mem: this.#mem, consume: true }, (err, result) =>
        err ? reject(err) : resolve(result)
      )
    );
  }

  decompressAsync(data: Uint8Array, asString?: false): Promise<Uint8Array>;
  decompressAsync(data: Uint8Array, asString: true): Promise<string>;
  decompressAsync(data: Uint8Array, asString = false): Promise<Uint8Array | string> {
    return new Promise((resolve, reject) =>
      decompress(data, { consume: true }, (err, result) =>
        err ? reject(err) : resolve(asString ? strFromU8(result) : result)
      )
    );
  }

  ratio(data: FlateInput): { raw: number; compressed: number; saving: string } {
    const buf = typeof data === 'string' ? strToU8(data) : data;
    const compressed = this.compress(buf);
    return {
      raw: buf.byteLength,
      compressed: compressed.byteLength,
      saving: ((1 - compressed.byteLength / buf.byteLength) * 100).toFixed(1) + '%',
    };
  }
}

export default Flate;
export type { CompressionLevel, CompressionMem, FlateInput };
