"use client";

// Insert table separators and strip leading heading marker before pipe tables
function normalizeTableLikeMarkdown(lines: string[]): string[] {
  const out = [...lines];

  // 1) Convert lines like "# | Col1 | Col2 |" to "| Col1 | Col2 |"
  for (let i = 0; i < out.length; i++) {
    if (/^\s*#\s*\|/.test(out[i])) {
      out[i] = out[i].replace(/^(\s*)#\s*/, '$1');
    }
  }

  // 2) If a pipe header is followed by rows but missing a separator, insert one
  const looksLikeSep = (s: string) => {
    return (/(^\s*\|?\s*(?::?-+\s*\|\s*)*:?-+\s*\|?\s*$)/.test(s)) ||
           (/^\s*\|?\s*(-+\s*\|\s*)*-+\s*\|?\s*$/.test(s));
  };

  let i = 0;
  while (i < out.length - 1) {
    const cur = out[i];
    const nxt = out[i + 1];
    const isPipe = /\|/.test(cur);
    const nextIsPipe = /\|/.test(nxt);
    if (isPipe && nextIsPipe && !looksLikeSep(nxt)) {
      // Synthesize separator based on header column count
      const cols = splitRow(cur).length || 1;
      const sep = '| ' + Array(cols).fill('---').join(' | ') + ' |';
      out.splice(i + 1, 0, sep);
      i += 2; // skip over inserted separator
      continue;
    }
    i++;
  }

  return out;
}

import React from "react";

type Props = { text: string };

// Minimal, dependency-free Markdown renderer focusing on bold, italics and inline code.
// Supported:
// - **bold**
// - *italic* or _italic_
// - `inline code`
// - preserves line breaks and paragraphs
// - fenced code blocks ``` ... ```
// - simple lists (-, *, 1.)
// - simple GitHub-style tables
export default function MarkdownLite({ text }: Props) {
  if (!text) return null;

  // Split out fenced code blocks first so we don't transform inside them
  const blocks = splitFencedCodeBlocks(text);

  return (
    <div className="text-zinc-100 leading-relaxed whitespace-pre-wrap text-[13.5px] sm:text-sm space-y-2 tracking-[0.004em]">
      {blocks.map((b, i) =>
        b.type === "code" ? (
          <pre
            key={i}
            className="my-2 rounded bg-black/40 border border-white/10 p-2 overflow-x-auto text-xs"
          >
            <code>{b.content}</code>
          </pre>
        ) : (
          // For non-code text, clean simple math delimiters like \( \) \[ \] and $...$
          <BlockRenderer key={i} text={sanitizeMath(b.content)} />
        )
      )}
    </div>
  );
}

function splitFencedCodeBlocks(input: string): Array<{ type: "text" | "code"; content: string }> {
  const parts: Array<{ type: "text" | "code"; content: string }> = [];
  const regex = /```[\w-]*\n([\s\S]*?)\n```/g; // ```lang?\n...\n```
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(input)) !== null) {
    if (m.index > lastIndex) {
      parts.push({ type: "text", content: input.slice(lastIndex, m.index) });
    }
    parts.push({ type: "code", content: m[1] });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < input.length) {
    parts.push({ type: "text", content: input.slice(lastIndex) });
  }
  return parts;
}

// Renders a text block with support for paragraphs, simple lists, and tables.
function BlockRenderer({ text }: { text: string }) {
  // Normalize newlines
  const rawLines = text.replace(/\r\n?/g, "\n").split("\n");
  const lines = normalizeTableLikeMarkdown(rawLines);
  const nodes: React.ReactNode[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Headings: # to ######
    const heading = /^\s{0,3}(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      const content = heading[2].trim();
      const Tag = (`h${Math.min(6, Math.max(1, level))}` as unknown) as React.ElementType;
      nodes.push(
        <Tag key={`h-${i}`} className={`mt-2 mb-1 font-semibold tracking-tight ${
          level <= 2 ? 'text-base md:text-lg' : level === 3 ? 'text-sm md:text-base' : 'text-sm'
        }`}>
          {renderInline(content)}
        </Tag>
      );
      i++;
      continue;
    }

    // Blockquote: lines starting with ">"; group consecutive
    if (/^\s*>\s?/.test(line)) {
      const quoteLines: string[] = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        quoteLines.push(lines[i].replace(/^\s*>\s?/, ''));
        i++;
      }
      nodes.push(
        <div key={`q-${i}`} className="my-2 px-3 py-2 rounded-md border border-white/10 bg-white/5">
          <BlockRenderer text={quoteLines.join('\n')} />
        </div>
      );
      continue;
    }

    // Table detection: header | --- | --- | followed by rows starting with |
    if (isTableHeader(lines, i)) {
      const { element, nextIndex } = parseTable(lines, i);
      nodes.push(
        <div key={`tbl-${i}`} className="my-2 overflow-x-auto rounded-lg ring-1 ring-white/20 bg-gradient-to-b from-black/40 to-black/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] p-2">
          {element}
        </div>
      );
      i = nextIndex;
      continue;
    }

    // List detection: -, *, or numbered like 1.
    if (isListLine(line)) {
      const { element, nextIndex } = parseList(lines, i);
      nodes.push(
        <div key={`list-${i}`} className="my-1">
          {element}
        </div>
      );
      i = nextIndex;
      continue;
    }

    // Blank line -> paragraph break
    if (!line.trim()) {
      nodes.push(<br key={`br-${i}`} />);
      i++;
      continue;
    }

    // Regular paragraph line(s) until next blank/table/list/heading/blockquote
    const start = i;
    const buf: string[] = [];
    while (i < lines.length) {
      const l = lines[i];
      if (!l.trim() || isTableHeader(lines, i) || isListLine(l) || /^\s{0,3}#{1,6}\s+/.test(l) || /^\s*>\s?/.test(l)) break;
      buf.push(l);
      i++;
    }
    nodes.push(
      <p key={`p-${start}`} className="whitespace-pre-wrap my-1">
        {renderInline(buf.join("\n"))}
      </p>
    );
  }

  return <>{nodes}</>;
}

// Remove simple math delimiters so math reads cleanly without a renderer
function sanitizeMath(input: string): string {
  let out = input;
  // Remove escaped LaTeX inline/block delimiters \( \) \[ \]
  out = out.replace(/\\[()\[\]]/g, '');
  // Replace $...$ or $$...$$ with the inner content
  out = out.replace(/\${1,2}([\s\S]*?)\${1,2}/g, (_, inner) => inner);
  return out;
}

function isTableHeader(lines: string[], idx: number): boolean {
  const header = lines[idx] || "";
  const sep = lines[idx + 1] || "";
  // Require some pipes and a separator line like |---|---| (allow spaces/colons)
  if (!/\|/.test(header) || !/\|/.test(sep)) return false;
  const looksLikeSep = /^\s*\|?\s*(?::?-+\s*\|\s*)*:?-+\s*\|?\s*$/.test(sep) ||
    /^\s*\|?\s*(-+\s*\|\s*)*-+\s*\|?\s*$/.test(sep);
  return looksLikeSep;
}

function parseTable(lines: string[], idx: number): { element: React.ReactElement; nextIndex: number } {
  const headerLine = lines[idx] || "";
  // skip separator line
  let i = idx + 2;
  const rows: string[] = [];
  while (i < lines.length) {
    const raw = lines[i];
    if (!raw || raw.trim() === "") break;
    // Skip any separator-like row inside body (rows made only/mostly of dashes, mdashes, en-dashes, colons, or spaces)
    const isSepLike = (() => {
      const core = raw.trim().replace(/^\|/, "").replace(/\|$/, "");
      const cells = core.split("|").map((s) => s.trim());
      const sepRe = /^[:\-\s—–]+$/;
      const sepCount = cells.filter((c) => c === "" || sepRe.test(c)).length;
      if (cells.length <= 1) return sepCount === 1; // handle lines without pipes
      return sepCount >= Math.ceil(cells.length / 2); // majority separator-like -> skip
    })();
    if (isSepLike) { i++; continue; }
    if (!/\|/.test(raw)) {
      // continuation text for previous row
      if (rows.length > 0) {
        rows[rows.length - 1] = rows[rows.length - 1] + " " + raw.trim();
        i++;
        continue;
      } else {
        break;
      }
    }
    const pipeCount = (raw.match(/\|/g) || []).length;
    if (pipeCount < 2 && rows.length > 0) {
      // Likely a continuation that begins with a single pipe
      const cont = raw.replace(/^\|?\s*/, '').trim();
      // If the continuation is only separator characters (dashes/colons/mdashes/en-dashes/spaces), skip it
      if (/^[:\-\s—–]+$/.test(cont)) { i++; continue; }
      rows[rows.length - 1] = rows[rows.length - 1] + " " + cont;
    } else {
      // If cells are only separator characters, skip
      const cells = splitRow(raw);
      const allSep = cells.length > 0 && cells.every(c => /^[:\-\s—–]+$/.test(c));
      if (!allSep) rows.push(raw);
    }
    i++;
  }

  // Split headers and drop empty/separator-only header columns to avoid blank columns
  let headers = splitRow(headerLine);
  const sepOnly = (s: string) => /^[:\-\s—–]*$/.test(s || "");
  const keepIdx: number[] = [];
  headers.forEach((h, idx) => { if (h.trim() !== "" && !sepOnly(h)) keepIdx.push(idx); });
  if (keepIdx.length > 0) {
    headers = keepIdx.map((i) => headers[i]);
  } else {
    // If all were empty, fall back to original to avoid losing data
    headers = headers.map((h) => (h || "").trim());
    headers = headers.length ? headers : [""];
  }

  // Map body rows to kept columns and normalize lengths
  const bodyRaw = rows.map(splitRow);
  const projectCols = (cols: string[]) => {
    if (keepIdx.length > 0) {
      const projected = keepIdx.map((i) => (i < cols.length ? cols[i] : ""));
      return projected;
    }
    return cols;
  };
  const colCount = headers.length;
  const body = bodyRaw.map((cols) => {
    const proj = projectCols(cols);
    if (proj.length === colCount) return proj;
    if (proj.length < colCount) return proj.concat(Array(colCount - proj.length).fill(""));
    // If too many, merge extras into last cell
    return proj.slice(0, colCount - 1).concat([proj.slice(colCount - 1).join(" | ")]);
  });

  const element = (
    <table className="text-[13px] sm:text-sm w-full table-auto border-separate border-spacing-0">
      <thead>
        <tr>
          {headers.map((h, hi) => (
            <th
              key={hi}
              className="text-left font-semibold text-zinc-100 bg-black/30 border border-white/15 px-3 py-1.5"
            >
              {renderInline(h)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {body.map((r, ri) => (
          <tr key={ri} className="even:bg-black/20">
            {r.map((c, ci) => (
              <td key={ci} className="align-top border border-white/15 px-3 py-1.5 whitespace-pre-wrap text-zinc-200">
                {renderInline(c)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return { element, nextIndex: i };
}

function splitRow(line: string): string[] {
  // Trim outer pipes, then split; keep empty cells; collapse inner spaces
  const core = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  const parts = core.split("|").map((s) => s.replace(/\s+/g, ' ').trim());
  return parts;
}

function isListLine(line: string): boolean {
  return /^\s*(?:[-*]\s+|\d+\.\s+)/.test(line);
}

function parseList(lines: string[], idx: number): { element: React.ReactElement; nextIndex: number } {
  const items: { marker: "ul" | "ol"; text: string }[] = [];
  let i = idx;
  let mode: "ul" | "ol" | null = null;
  while (i < lines.length) {
    const line = lines[i];
    if (!isListLine(line)) break;
    const ol = /^\s*\d+\.\s+(.*)$/.exec(line);
    const ul = /^\s*(?:[-*])\s+(.*)$/.exec(line);
    if (ol) {
      if (mode && mode !== "ol") break; // stop when list type changes
      mode = "ol";
      items.push({ marker: "ol", text: ol[1] });
    } else if (ul) {
      if (mode && mode !== "ul") break;
      mode = "ul";
      items.push({ marker: "ul", text: ul[1] });
    } else {
      break;
    }
    i++;
  }

  const element = mode === "ol" ? (
    <ol className="list-decimal list-outside pl-5 space-y-1">
      {items.map((it, idx2) => (
        <li key={idx2} className="whitespace-pre-wrap">
          {renderInline(it.text)}
        </li>
      ))}
    </ol>
  ) : (
    <ul className="list-disc list-outside pl-5 space-y-1">
      {items.map((it, idx2) => (
        <li key={idx2} className="whitespace-pre-wrap">
          {renderInline(it.text)}
        </li>
      ))}
    </ul>
  );

  return { element, nextIndex: i };
}

function renderInline(input: string): React.ReactNode[] {
  // First split by inline code `...`
  const segments = input.split(/(`[^`]+`)/g);
  const out: React.ReactNode[] = [];
  segments.forEach((seg, idx) => {
    if (/^`[^`]+`$/.test(seg)) {
      const content = seg.slice(1, -1);
      out.push(
        <code key={idx} className="rounded bg-black/40 px-1 py-0.5 border border-white/10 text-[0.85em]">
          {content}
        </code>
      );
    } else {
      // Bold then italics on the remaining text. Keep it simple and safe.
      // Replace **bold**
      const withBold = splitAndWrap(seg, /\*\*([^*]+)\*\*/g, (m, i) => (
        <strong key={`b-${idx}-${i}`} className="font-semibold text-zinc-100">{m}</strong>
      ));
      // For each piece, also apply _italic_ or *italic*
      const withItalics: React.ReactNode[] = [];
      withBold.forEach((piece, i) => {
        if (typeof piece !== "string") { withItalics.push(piece); return; }
        const italics = splitAndWrap(piece, /(?:\*([^*]+)\*|_([^_]+)_)/g, (m2, ii) => (
          <em key={`i-${idx}-${i}-${ii}`} className="italic text-zinc-100/90">{m2}</em>
        ));
        // After italics, highlight standalone word FREE in emerald
        italics.forEach((part, j) => {
          if (typeof part !== 'string') { withItalics.push(part); return; }
          const chunks = part.split(/(\bFREE\b)/gi);
          chunks.forEach((ch, k) => {
            if (/^\bFREE\b$/i.test(ch)) {
              withItalics.push(<span key={`free-${idx}-${i}-${j}-${k}`} className="text-emerald-300 font-semibold">FREE</span>);
            } else if (ch) {
              withItalics.push(<React.Fragment key={`t-${idx}-${i}-${j}-${k}`}>{ch}</React.Fragment>);
            }
          });
        });
      });
      out.push(<React.Fragment key={`t-${idx}`}>{withItalics}</React.Fragment>);
    }
  });
  return out;
}

function splitAndWrap(
  input: string,
  regex: RegExp,
  wrap: (matchText: string, idx: number) => React.ReactNode
): React.ReactNode[] {
  const result: React.ReactNode[] = [];
  let lastIndex = 0;
  let i = 0;
  let m: RegExpExecArray | null;
  const re = new RegExp(regex.source, regex.flags.includes("g") ? regex.flags : regex.flags + "g");
  while ((m = re.exec(input)) !== null) {
    if (m.index > lastIndex) result.push(input.slice(lastIndex, m.index));
    const captured = m[1] || m[2] || "";
    result.push(wrap(captured, i++));
    lastIndex = re.lastIndex;
  }
  if (lastIndex < input.length) result.push(input.slice(lastIndex));
  return result;
}
