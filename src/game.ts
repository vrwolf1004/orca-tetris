// 테트리스 규칙과 상태. 입출력이 없어서 단위 테스트로 바로 검증한다.
// herdr-tetris 의 src/game.py 를 옮긴 것이다 (규칙 문서: docs/rules.md).

export const WIDTH = 10
export const HEIGHT = 20
const SPAWN_COL = 3
const LINES_PER_LEVEL = 10
// 한 번에 지운 줄 수(0~4)별 기본 점수. 실제 점수는 레벨을 곱한다.
const LINE_SCORES = [0, 100, 300, 500, 800]
// 회전 시 막히면 좌우로 밀어서 다시 시도한다(벽 킥).
const KICK_OFFSETS = [0, -1, 1, -2, 2]

export type Kind = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L'
type Cell = [number, number]

// 블록 기본 형태. (row, col) 좌표이고 회전 상태 0 기준이다.
const BASE_SHAPES: Record<Kind, Cell[]> = {
  I: [[0, 0], [0, 1], [0, 2], [0, 3]],
  O: [[0, 0], [0, 1], [1, 0], [1, 1]],
  T: [[0, 0], [0, 1], [0, 2], [1, 1]],
  S: [[0, 1], [0, 2], [1, 0], [1, 1]],
  Z: [[0, 0], [0, 1], [1, 1], [1, 2]],
  J: [[0, 0], [1, 0], [1, 1], [1, 2]],
  L: [[0, 2], [1, 0], [1, 1], [1, 2]],
}
export const KINDS = Object.keys(BASE_SHAPES) as Kind[]

function normalize(cells: Cell[]): Cell[] {
  const minR = Math.min(...cells.map(([r]) => r))
  const minC = Math.min(...cells.map(([, c]) => c))
  return cells.map(([r, c]): Cell => [r - minR, c - minC])
}

// 화면 좌표(행은 아래, 열은 오른쪽) 기준 시계 방향 90도 회전.
function rotateCw(cells: Cell[]): Cell[] {
  return normalize(cells.map(([r, c]): Cell => [c, -r]))
}

function buildRotations(cells: Cell[]): Cell[][] {
  const states = [normalize(cells)]
  for (let i = 0; i < 3; i++) states.push(rotateCw(states[states.length - 1]))
  return states
}

const ROTATIONS = Object.fromEntries(
  KINDS.map((kind) => [kind, buildRotations(BASE_SHAPES[kind])])
) as Record<Kind, Cell[][]>

export function cellsAt(kind: Kind, rotation: number, row: number, col: number): Cell[] {
  return ROTATIONS[kind][rotation].map(([r, c]): Cell => [row + r, col + c])
}

export class Game {
  board: (Kind | null)[][] = Array.from({ length: HEIGHT }, () => Array<Kind | null>(WIDTH).fill(null))
  score = 0
  lines = 0
  gameOver = false
  kind: Kind = 'I'
  nextKind: Kind = 'I'
  rotation = 0
  row = 0
  col = SPAWN_COL
  private bag: Kind[] = []
  private rng: () => number

  // rng 는 0 이상 1 미만의 난수 함수다. 테스트에서는 고정 값을 넣는다.
  constructor(rng: () => number = Math.random) {
    this.rng = rng
    this.nextKind = this.draw()
    this.spawn()
  }

  get level(): number {
    return Math.floor(this.lines / LINES_PER_LEVEL) + 1
  }

  // 중력 간격(초). herdr-tetris 와 같은 식이다.
  get tickSeconds(): number {
    return Math.max(0.05, 1.0 - 0.07 * (this.level - 1))
  }

  activeCells(): Cell[] {
    return cellsAt(this.kind, this.rotation, this.row, this.col)
  }

  move(dcol: number): boolean {
    if (this.gameOver || !this.fits(this.rotation, this.row, this.col + dcol)) return false
    this.col += dcol
    return true
  }

  rotate(): boolean {
    if (this.gameOver) return false
    const next = (this.rotation + 1) % 4
    for (const offset of KICK_OFFSETS) {
      if (this.fits(next, this.row, this.col + offset)) {
        this.rotation = next
        this.col += offset
        return true
      }
    }
    return false
  }

  // 중력으로 한 칸 내린다. 더 내려갈 수 없으면 고정한다.
  tick(): void {
    if (!this.gameOver && !this.tryDown()) this.lock()
  }

  softDrop(): void {
    if (this.gameOver) return
    if (this.tryDown()) this.score += 1
    else this.lock()
  }

  hardDrop(): void {
    if (this.gameOver) return
    let distance = 0
    while (this.tryDown()) distance++
    this.score += 2 * distance
    this.lock()
  }

  private draw(): Kind {
    // 7-bag: 7종을 한 번씩 섞어 뽑고, 다 뽑으면 다시 섞는다.
    if (this.bag.length === 0) {
      this.bag = [...KINDS]
      for (let i = this.bag.length - 1; i > 0; i--) {
        const j = Math.floor(this.rng() * (i + 1))
        ;[this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]]
      }
    }
    return this.bag.pop() as Kind
  }

  private fits(rotation: number, row: number, col: number): boolean {
    return cellsAt(this.kind, rotation, row, col).every(
      ([r, c]) => r >= 0 && r < HEIGHT && c >= 0 && c < WIDTH && this.board[r][c] === null
    )
  }

  private tryDown(): boolean {
    if (this.fits(this.rotation, this.row + 1, this.col)) {
      this.row++
      return true
    }
    return false
  }

  private spawn(): void {
    this.kind = this.nextKind
    this.nextKind = this.draw()
    this.rotation = 0
    this.row = 0
    this.col = SPAWN_COL
    if (!this.fits(this.rotation, this.row, this.col)) this.gameOver = true
  }

  private lock(): void {
    for (const [r, c] of this.activeCells()) this.board[r][c] = this.kind
    const cleared = this.clearLines()
    if (cleared) {
      // 보너스는 줄이 늘기 전 레벨로 계산한다.
      this.score += LINE_SCORES[cleared] * this.level
      this.lines += cleared
    }
    this.spawn()
  }

  private clearLines(): number {
    const kept = this.board.filter((row) => row.some((cell) => cell === null))
    const cleared = HEIGHT - kept.length
    if (cleared) {
      this.board = [
        ...Array.from({ length: cleared }, () => Array<Kind | null>(WIDTH).fill(null)),
        ...kept,
      ]
    }
    return cleared
  }
}
