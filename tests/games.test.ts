import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Ladder } from '../src/ladder.ts'
import { Snake, WIDTH, HEIGHT } from '../src/snake.ts'
import { Minesweeper } from '../src/minesweeper.ts'

test('사다리: 가로선이 없으면 그 열에서 그대로 내려온다', () => {
  const l = new Ladder(4, 3, () => 0.9)
  assert.equal(l.trace(2).end, 2)
})

test('사다리: 가로선은 줄마다 한 번만 건너며, 도착 열은 범위 안이다', () => {
  const l = new Ladder(4, 5, () => 0) // 모든 줄에 0-1, 2-3 가로선
  const { end, steps } = l.trace(0)
  assert.equal(steps.length, 5)
  assert.ok(end >= 0 && end < 4)
  assert.deepEqual(steps[0], [0, 1])
})

test('스네이크: 바로 뒤로 도는 방향은 무시한다', () => {
  const s = new Snake(() => 0)
  s.turn([0, -1])
  s.tick()
  assert.equal(s.dead, false)
  assert.deepEqual(s.direction, [0, 1])
})

test('스네이크: 벽에 닿으면 끝나고 최고 점수를 남긴다', () => {
  const s = new Snake(() => 0)
  s.body = [[HEIGHT - 1, 5], [HEIGHT - 1, 4], [HEIGHT - 1, 3]]
  s.direction = s.nextDirection = [1, 0]
  s.score = 30
  s.tick()
  assert.equal(s.status(), 'lost')
  assert.equal(s.best, 30)
  assert.ok(WIDTH > 0)
})

test('지뢰찾기: 첫 칸은 지뢰가 아니고, 지뢰를 열면 진다', () => {
  const m = new Minesweeper(() => 0.5)
  m.reveal(0, 0, 0)
  assert.ok(!m.mines?.has('0,0'))
  assert.equal(m.mines?.size, 40)
  const mine = [...m.mines!][0].split(',').map(Number) as [number, number]
  m.reveal(mine[0], mine[1], 1)
  assert.equal(m.status(), 'lost')
})

test('지뢰찾기: 깃발은 열린 칸에 꽂히지 않는다', () => {
  const m = new Minesweeper(() => 0.5)
  m.reveal(0, 0, 0)
  const hidden = [...Array(m.rows * m.cols).keys()]
    .map((i) => [Math.floor(i / m.cols), i % m.cols] as [number, number])
    .find(([r, c]) => !m.revealed.has(`${r},${c}`))!
  const revealed = [...m.revealed][0].split(',').map(Number) as [number, number]
  assert.equal(m.toggleFlag(revealed[0], revealed[1], 1), false)
  assert.equal(m.toggleFlag(hidden[0], hidden[1], 1), true)
  assert.equal(m.minesLeft(), 39)
})
