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

// Puter.js global object type definitions
declare global {
  interface Window {
    puter?: {
      ai: {
        chat: (message: string, options?: {
          model?: string;
          stream?: boolean;
          temperature?: number;
          max_tokens?: number;
        }) => Promise<string>;
      };
      print: (value: any) => void;
      ready?: Promise<void>;
      isReady?: boolean;
      version?: string;
    };
  }
}

// Also declare puter as a global variable for direct access
declare const puter: {
  ai: {
    chat: (message: string, options?: {
      model?: string;
      stream?: boolean;
      temperature?: number;
      max_tokens?: number;
    }) => Promise<string>;
  };
  print: (value: any) => void;
  ready?: Promise<void>;
  isReady?: boolean;
  version?: string;
} | undefined;
