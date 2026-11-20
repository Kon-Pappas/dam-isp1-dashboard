"""Measures the data files (rule: measure before deciding the file layout)."""
import gzip

from . import config as C

LIMIT_KB = 250

def main():
    rows, total = [], 0
    for p in sorted(C.DATA_DIR.glob("*.json")):
        raw = p.read_bytes()
        gz = len(gzip.compress(raw, 6))
        rows.append((p.name, len(raw) / 1024, gz / 1024))
        total += gz
    print(f"{'file':<20}{'raw KB':>10}{'gzip KB':>10}")
    for n, a, b in rows:
        flag = "  <-- over limit" if b > LIMIT_KB else ""
        print(f"{n:<20}{a:>10.1f}{b:>10.1f}{flag}")
    print(f"total gzip {total / 1024:.1f} KB; limit per file {LIMIT_KB} KB")

if __name__ == "__main__":
    main()
