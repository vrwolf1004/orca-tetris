// 스네이크 규칙. herdr-tetris 의 src/snake.py 를 옮긴 것이다. 그리기는 panel.ts 가 맡는다.
// 최고 점수는 이 객체가 살아 있는 동안(판 사이)만 기억한다.

export const WIDTH = 20
export const HEIGHT = 30 // 30칸 × 14px = 420px, 화면 영역(422px) 높이에 맞춤
const START_LENGTH = 3
const FOOD_SCORE = 10
const BASE_SECONDS = 0.3 // 처음 한 칸 움직이는 간격
const SPEED_STEP = 0.01 // 먹이 하나마다 줄어드는 간격
const MIN_SECONDS = 0.1 // 가장 빠를 때의 간격(하한)

export type Cell = [number, number]
export type Direction = [number, number]

export class Snake {
  best = 0
  body: Cell[] = [] // 머리가 앞
  direction: Direction = [0, 1]
  nextDirection: Direction = [0, 1]
  score = 0
  dead = false
  food: Cell | null = null

  private readonly rng: () => number

  constructor(rng: () => number = Math.random) {
    this.rng = rng
    this.restart()
  }

  restart(): void {
    const midR = Math.floor(HEIGHT / 2)
    const midC = Math.floor(WIDTH / 2)
    this.body = Array.from({ length: START_LENGTH }, (_, i) => [midR, midC - i] as Cell)
    this.direction = [0, 1]
    this.nextDirection = [0, 1]
    this.score = 0
    this.dead = false
    this.food = null
    this.placeFood()
  }

  status(): 'lost' | 'won' | 'playing' {
    if (this.dead) return 'lost'
    if (this.food === null) return 'won'
    return 'playing'
  }

  // 바로 뒤로 돌아가는 방향은 무시한다.
  turn(direction: Direction): void {
    if (this.body.length > 1 && direction[0] === -this.direction[0] && direction[1] === -this.direction[1]) return
    this.nextDirection = direction
  }

  // 먹이를 먹을수록 짧아진다. MIN_SECONDS 아래로는 내려가지 않는다.
  interval(): number {
    const eaten = Math.floor(this.score / FOOD_SCORE)
    return Math.max(MIN_SECONDS, BASE_SECONDS - SPEED_STEP * eaten)
  }

  // 뱀을 한 칸 움직인다. 움직였으면 true.
  tick(): boolean {
    if (this.status() !== 'playing') return false
    this.direction = this.nextDirection
    const [hr, hc] = this.body[0]
    const nr = hr + this.direction[0]
    const nc = hc + this.direction[1]
    if (nr < 0 || nr >= HEIGHT || nc < 0 || nc >= WIDTH || this.occupied(nr, nc)) {
      this.dead = true
      this.best = Math.max(this.best, this.score)
      return false
    }
    this.body.unshift([nr, nc])
    if (this.food && this.food[0] === nr && this.food[1] === nc) {
      this.score += FOOD_SCORE
      this.placeFood()
    } else {
      this.body.pop()
    }
    return true
  }

  occupied(r: number, c: number): boolean {
    return this.body.some(([br, bc]) => br === r && bc === c)
  }

  private placeFood(): void {
    const empty: Cell[] = []
    for (let r = 0; r < HEIGHT; r++) {
      for (let c = 0; c < WIDTH; c++) {
        if (!this.occupied(r, c)) empty.push([r, c])
      }
    }
    this.food = empty.length > 0 ? empty[Math.floor(this.rng() * empty.length)] : null
  }
}
