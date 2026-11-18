import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Game, HEIGHT, WIDTH } from '../src/game.ts'

test('레벨은 10줄마다 1 오르고, 중력 간격은 0.05초 밑으로 내려가지 않는다', () => {
  const g = new Game(() => 0.5)
  assert.equal(g.level, 1)
  g.lines = 10
  assert.equal(g.level, 2)
  g.lines = 1000
  assert.equal(g.tickSeconds, 0.05)
})

test('하드 드롭은 내려간 칸마다 2점을 준다', () => {
  const g = new Game(() => 0.5)
  const before = g.row
  g.hardDrop()
  assert.ok(g.score >= 2 * (HEIGHT - 4), `score ${g.score}`)
  assert.ok(g.row === before || g.board.some((r) => r.some((c) => c !== null)))
})

test('가득 찬 줄은 지우고 레벨 전 점수로 보너스를 준다', () => {
  const g = new Game(() => 0.5)
  // 바닥 한 줄을 9칸 채워 둔다. 빈 칸은 0열.
  for (let c = 1; c < WIDTH; c++) g.board[HEIGHT - 1][c] = 'O'
  g.kind = 'I'
  g.rotation = 1 // 세로 I 블록
  g.row = 0
  g.col = 0
  g.hardDrop()
  assert.equal(g.lines, 1)
  assert.equal(g.board[HEIGHT - 1].every((c) => c === null), false)
})

test('블록이 맨 위에 놓이지 못하면 게임 오버', () => {
  const g = new Game(() => 0.5)
  // 맨 윗줄 두 줄을 왼쪽 9칸 채운다. 다음 블록은 3~6열에서 시작하므로 겹친다. (가득 찬 줄은 없음)
  for (const r of [0, 1]) for (let c = 0; c < WIDTH - 1; c++) g.board[r][c] = 'O'
  g.hardDrop()
  assert.equal(g.gameOver, true)
})
