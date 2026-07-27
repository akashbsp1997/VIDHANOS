declare module 'exifr/dist/lite.esm.mjs' {
  export function parse(
    input: ArrayBuffer | Uint8Array,
    options?: Record<string, unknown>
  ): Promise<Record<string, any> | undefined>;
}
