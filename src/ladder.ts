// 사다리게임(아미다쿠지) 규칙. herdr-tetris 의 src/ladder.py 를 옮긴 것이다. 그리기는 panel.ts 가 맡는다.

export const COLUMNS = 10
export const ROWS = 10 // 사다리 캔버스 높이 52 + 10×34 + 30 = 422px

export class Ladder {
  // rungs[r][c] 가 true 면 r 번째 줄에서 c 열과 c+1 열이 가로선으로 이어진다.
  readonly rungs: boolean[][] = []
  readonly columns: number

  constructor(columns = COLUMNS, rows = ROWS, rng: () => number = Math.random) {
    this.columns = columns
    for (let r = 0; r < rows; r++) {
      const row = new Array<boolean>(columns - 1).fill(false)
      let c = 0
      while (c < columns - 1) {
        if (rng() < 0.5) {
          row[c] = true
          c += 2 // 가로선이 겹치면 갈림길이 되므로 바로 다음 칸은 비운다.
        } else {
          c++
        }
      }
      this.rungs.push(row)
    }
  }

  get rows(): number {
    return this.rungs.length
  }

  // start 열(0부터)에서 아래로 내려간다. 도착 열과 줄마다 (들어간 열, 나온 열) 목록을 돌려준다.
  trace(start: number): { end: number; steps: [number, number][] } {
    let col = start
    const steps: [number, number][] = []
    for (const row of this.rungs) {
      const before = col
      if (col < this.columns - 1 && row[col]) col += 1
      else if (col > 0 && row[col - 1]) col -= 1
      steps.push([before, col])
    }
    return { end: col, steps }
  }
}
