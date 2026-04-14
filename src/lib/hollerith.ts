/* ═══════════════════════════════════════════
   12-ROW HOLLERITH PUNCH CARD ENCODING
   Rows (top to bottom): 12, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
   Zone punches: 12, 11, 0 (top three rows)
   Digit punches: 0-9
   Characters = combinations of zone + digit punches
   ═══════════════════════════════════════════ */

export const EMAIL_ROWS = 12;
export const EMAIL_COLS = 32;
export const ROW_LABELS = ["12", "11", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

export const HOLLERITH: Record<string, number[]> = {
  " ": [],
  "0": [2], "1": [3], "2": [4], "3": [5], "4": [6],
  "5": [7], "6": [8], "7": [9], "8": [10], "9": [11],
  "A": [0, 3], "B": [0, 4], "C": [0, 5], "D": [0, 6], "E": [0, 7],
  "F": [0, 8], "G": [0, 9], "H": [0, 10], "I": [0, 11],
  "J": [1, 3], "K": [1, 4], "L": [1, 5], "M": [1, 6], "N": [1, 7],
  "O": [1, 8], "P": [1, 9], "Q": [1, 10], "R": [1, 11],
  "S": [2, 4], "T": [2, 5], "U": [2, 6], "V": [2, 7],
  "W": [2, 8], "X": [2, 9], "Y": [2, 10], "Z": [2, 11],
  ".": [0, 5, 10], "@": [6, 10], "-": [1], "_": [2, 7, 10],
  "+": [0, 8, 10], "/": [2, 3], ",": [2, 5, 10], "#": [5, 10],
  "!": [0, 4, 10], "&": [0], "*": [1, 6, 10], "=": [8, 10],
  "'": [7, 10], "%": [2, 6, 10], "(": [0, 7, 10], ")": [1, 7, 10],
};

export const HOLLERITH_DECODE: Record<string, string> = {};
for (const [char, rows] of Object.entries(HOLLERITH)) {
  if (rows.length > 0) {
    HOLLERITH_DECODE[[...rows].sort((a, b) => a - b).join(",")] = char;
  }
}

export function decodeHollerithCard(
  punched: Set<number>,
  cols: number,
): { char: string; hasHoles: boolean }[] {
  return Array.from({ length: cols }, (_, col) => {
    const rows: number[] = [];
    for (let r = 0; r < EMAIL_ROWS; r++) {
      if (punched.has(r * cols + col)) rows.push(r);
    }
    if (rows.length === 0) return { char: "", hasHoles: false };
    const key = rows.sort((a, b) => a - b).join(",");
    return { char: HOLLERITH_DECODE[key] || "?", hasHoles: true };
  });
}
