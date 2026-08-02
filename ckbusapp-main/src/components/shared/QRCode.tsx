import { useMemo } from 'react';

function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function QRCode({ value, size = 160 }: { value: string; size?: number }) {
  const cells = 21;
  const cell = size / cells;

  const matrix = useMemo(() => {
    const m: boolean[][] = [];
    let seed = 0;
    for (let i = 0; i < value.length; i++) seed += value.charCodeAt(i);
    for (let r = 0; r < cells; r++) {
      const row: boolean[] = [];
      for (let c = 0; c < cells; c++) {
        seed += 1;
        row.push(pseudoRandom(seed) > 0.5);
      }
      m.push(row);
    }
    const isFinder = (r: number, c: number) => {
      const inBox = (br: number, bc: number) => r >= br && r < br + 7 && c >= bc && c < bc + 7;
      return inBox(0, 0) || inBox(0, cells - 7) || inBox(cells - 7, 0);
    };
    for (let r = 0; r < cells; r++) for (let c = 0; c < cells; c++) if (isFinder(r, c)) m[r][c] = false;
    const drawFinder = (br: number, bc: number) => {
      for (let r = 0; r < 7; r++) for (let c = 0; c < 7; c++) {
        const border = r === 0 || r === 6 || c === 0 || c === 6;
        const center = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        m[br + r][bc + c] = border || center;
      }
    };
    drawFinder(0, 0); drawFinder(0, cells - 7); drawFinder(cells - 7, 0);
    return m;
  }, [value]);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rounded-lg bg-white p-1">
      <rect width={size} height={size} fill="white" />
      {matrix.map((row, r) => row.map((on, c) => on ? <rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell} height={cell} fill="black" /> : null))}
    </svg>
  );
}
