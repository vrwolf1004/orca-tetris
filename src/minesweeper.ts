// 지뢰찾기 규칙. herdr-tetris 의 src/minesweeper.py 를 옮긴 것이다. 그리기는 panel.ts 가 맡는다.
// 첫 칸을 열 때 지뢰를 놓아서 첫 칸은 항상 안전하다.

export const ROWS = 21 // 21칸 × 20px = 420px, 화면 영역(422px) 높이에 맞춤
export const COLS = 14 // 14칸 × 20px = 280px
export const MINES = 40

const DIRECTIONS: [number, number][] = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]

const key = (r: number, c: number) => `${r},${c}`

export class Minesweeper {
  mines: Set<string> | null = null
  revealed = new Set<string>()
  flags = new Set<string>()
  cursor: [number, number] = [0, 0]
  lost = false
  startedAt: number | null = null // 초 단위
  endedAt: number | null = null

  private readonly rng: () => number
  readonly rows: number
  readonly cols: number

  constructor(rng: () => number = Math.random, rows = ROWS, cols = COLS) {
    this.rng = rng
    this.rows = rows
    this.cols = cols
    this.restart()
  }

  restart(): void {
    this.mines = null
    this.revealed = new Set()
    this.flags = new Set()
    this.cursor = [Math.floor(this.rows / 2), Math.floor(this.cols / 2)]
    this.lost = false
    this.startedAt = null
    this.endedAt = null
  }

  inside(r: number, c: number): boolean {
    return r >= 0 && r < this.rows && c >= 0 && c < this.cols
  }

  neighbours(r: number, c: number): [number, number][] {
    return DIRECTIONS.map(([dr, dc]) => [r + dr, c + dc] as [number, number]).filter(([nr, nc]) => this.inside(nr, nc))
  }

  count(r: number, c: number): number {
    return this.neighbours(r, c).filter(([nr, nc]) => this.mines?.has(key(nr, nc))).length
  }

  status(): 'lost' | 'won' | 'playing' {
    if (this.lost) return 'lost'
    if (this.mines !== null && this.revealed.size === this.rows * this.cols - this.mines.size) return 'won'
    return 'playing'
  }

  // 지뢰 수 − 깃발 수. 깃발을 더 많이 꽂으면 음수가 된다.
  minesLeft(): number {
    return MINES - this.flags.size
  }

  // 칸을 연다. 연 칸이 있었으면 true. now 는 초 단위 시각이다.
  reveal(r: number, c: number, now: number): boolean {
    const k = key(r, c)
    if (this.status() !== 'playing' || this.flags.has(k) || this.revealed.has(k)) return false
    if (this.startedAt === null) this.startedAt = now
    if (this.mines === null) this.placeMines([r, c])
    if (this.mines?.has(k)) {
      this.lost = true
      this.revealed.add(k)
      this.mines.forEach((m) => this.revealed.add(m))
      this.endedAt = now
      return true
    }
    this.open(r, c)
    if (this.status() === 'won') this.endedAt = now
    return true
  }

  // 깃발을 꽂거나 뺀다. 바뀌었으면 true.
  toggleFlag(r: number, c: number, now: number): boolean {
    const k = key(r, c)
    if (this.status() !== 'playing' || this.revealed.has(k)) return false
    if (this.startedAt === null) this.startedAt = now
    if (this.flags.has(k)) this.flags.delete(k)
    else this.flags.add(k)
    return true
  }

  moveCursor(dr: number, dc: number): void {
    const [r, c] = this.cursor
    this.cursor = [Math.min(this.rows - 1, Math.max(0, r + dr)), Math.min(this.cols - 1, Math.max(0, c + dc))]
  }

  elapsed(now: number): number {
    if (this.startedAt === null) return 0
    const end = this.endedAt ?? now
    return Math.max(0, Math.floor(end - this.startedAt))
  }

  private placeMines(first: [number, number]): void {
    const safe = new Set([key(...first), ...this.neighbours(...first).map(([r, c]) => key(r, c))])
    const candidates: [number, number][] = []
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (!safe.has(key(r, c))) candidates.push([r, c])
      }
    }
    // 부분 셔플로 지뢰 자리를 고른다.
    for (let i = 0; i < MINES; i++) {
      const j = i + Math.floor(this.rng() * (candidates.length - i))
      ;[candidates[i], candidates[j]] = [candidates[j], candidates[i]]
    }
    this.mines = new Set(candidates.slice(0, MINES).map(([r, c]) => key(r, c)))
  }

  // 빈 칸(둘레 지뢰 0)이면 주변을 연쇄로 연다. 숫자 칸이면 그 칸만 연다.
  private open(r: number, c: number): void {
    const stack: [number, number][] = [[r, c]]
    while (stack.length > 0) {
      const [pr, pc] = stack.pop()!
      const k = key(pr, pc)
      if (this.revealed.has(k) || this.flags.has(k)) continue
      this.revealed.add(k)
      if (this.count(pr, pc) === 0) {
        for (const [nr, nc] of this.neighbours(pr, pc)) {
          if (!this.revealed.has(key(nr, nc))) stack.push([nr, nc])
        }
      }
    }
  }
}
