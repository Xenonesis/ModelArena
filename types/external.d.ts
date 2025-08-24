declare module 'pdf-parse' {
  import type { Readable } from 'node:stream';
  type Input = Buffer | Uint8Array | ArrayBuffer | Readable;
  interface PdfParseResult {
    text: string;
  }
  const pdfParse: (data: Input) => Promise<PdfParseResult>;
  export default pdfParse;
}

declare module 'mammoth' {
  export interface ExtractRawTextResult {
    value: string;
  }
  export function extractRawText(arg: { buffer: Buffer }): Promise<ExtractRawTextResult>;
  const _default: {
    extractRawText: typeof extractRawText;
  };
  export default _default;
}
