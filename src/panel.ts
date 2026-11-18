// 패널: 입력, 중력 타이머, 그리기. 규칙은 game.ts, ladder.ts, snake.ts, minesweeper.ts 에 있다.
import { Game, HEIGHT, WIDTH, cellsAt, type Kind } from './game'
import { Ladder } from './ladder'
import { Snake, WIDTH as SNAKE_WIDTH, HEIGHT as SNAKE_HEIGHT, type Direction } from './snake'
import { Minesweeper } from './minesweeper'
import { t, getLang, cycleLang, type Key } from './i18n'

const CELL = 16
const SNAKE_CELL = 14 // 스네이크 칸 높이. 폭은 354px ÷ 20칸이라 가로로 조금 넓다
const SNAKE_CELL_W = 354 / 20
// 테트리스 보드는 가로 280px(10칸 → 칸 폭 28), 세로 398px(20칸 → 칸 높이 19.9)로 그린다.
const BOARD_CELL_W = 28 // 테트리스 보드 280px ÷ 10칸
const BOARD_CELL_H = 19.9 // 보드 세로 398px(사다리 캔버스 높이 422 − 여백) ÷ 20칸
const MINE_CELL = 20 // 지뢰찾기 칸 20px (14×21칸 → 280×420px)

type GameId = 'tetris' | 'ladder' | 'snake' | 'minesweeper'
type Screen = GameId | 'monitor'
type Theme = { chrome: string; field: string; fg: string; accent: string; dim: string }

// 게임마다 레트로 팔레트를 쓴다. 테트리스는 NES, 사다리는 호박색 CRT, 스네이크는 게임보이, 지뢰찾기는 윈도 95 풍이다.
const THEMES: Record<Screen, Theme> = {
  monitor: { chrome: '#001a00', field: '#000d00', fg: '#33ff66', accent: '#b6ffcc', dim: '#1f7a3a' },
  tetris: { chrome: '#0b0b2b', field: '#000000', fg: '#ffffff', accent: '#fcfc00', dim: '#5c5c9c' },
  ladder: { chrome: '#1a0f00', field: '#000000', fg: '#ffb000', accent: '#ffe066', dim: '#a06a10' },
  snake: { chrome: '#8bac0f', field: '#9bbc0f', fg: '#0f380f', accent: '#0f380f', dim: '#306230' },
  minesweeper: { chrome: '#008080', field: '#c0c0c0', fg: '#000000', accent: '#000080', dim: '#404040' },
}
const BLOCK_COLORS: Record<Kind, string> = {
  I: '#00e8d8', O: '#fcfc00', T: '#bc40ff', S: '#00a800', Z: '#f83800', J: '#0058f8', L: '#fca044',
}
const WIN_GRAY = '#c0c0c0'
const WIN_LIGHT = '#ffffff'
const WIN_DARK = '#808080'
const WIN_NUMBERS = ['', '#0000ff', '#008000', '#ff0000', '#000080', '#800000', '#008080', '#000000', '#808080']

const GAME_FOR_KEY: Record<string, GameId> = { '1': 'tetris', '2': 'ladder', '3': 'snake', '4': 'minesweeper' }
const HELP_KEY: Record<GameId, Key> = {
  tetris: 'help_tetris', ladder: 'help_ladder', snake: 'help_snake', minesweeper: 'help_minesweeper',
}

function byId<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id)
  if (!el) throw new Error(`panel element #${id} not found`)
  return el as T
}

const game$ = byId<HTMLElement>('game')
const boardCanvas = byId<HTMLCanvasElement>('board')
const nextCanvas = byId<HTMLCanvasElement>('next')
const hudLabel = byId<HTMLElement>('score-label')
const hud$ = byId<HTMLElement>('hud')
const textSide$ = byId<HTMLElement>('text-side')
const boxKeys$ = byId<HTMLElement>('box-keys')
const panelNameEl = byId<HTMLElement>('panel-name')
const fieldHud$ = byId<HTMLElement>('field-hud')
const fieldLabelEl = byId<HTMLElement>('field-label')
const fieldScoreEl = byId<HTMLElement>('field-score')
const fieldOverlay$ = byId<HTMLElement>('field-overlay')
const fieldOverlayText = byId<HTMLElement>('field-overlay-text')
const scoreEl = byId<HTMLElement>('score')
const boardScoreEl = byId<HTMLElement>('board-score')
const linesEl = byId<HTMLElement>('lines')
const levelEl = byId<HTMLElement>('level')
const overlay = byId<HTMLElement>('overlay')
const overlayText = byId<HTMLElement>('overlay-text')
const statusEl = byId<HTMLElement>('status')
const restartBtn = byId<HTMLButtonElement>('restart')
const pauseBtn = byId<HTMLButtonElement>('pause')
const gameScreen = byId<HTMLElement>('game-screen')
const textGame$ = byId<HTMLElement>('text-game')
const fieldCanvas = byId<HTMLCanvasElement>('field')
const infoEl = byId<HTMLElement>('info')
const monitor$ = byId<HTMLElement>('monitor')
const monitorRows = byId<HTMLElement>('monitor-rows')
const monitorLogs = byId<HTMLElement>('monitor-logs')
const help$ = byId<HTMLElement>('help')
const helpText = byId<HTMLElement>('help-text')

const boardCtx = boardCanvas.getContext('2d')!
const nextCtx = nextCanvas.getContext('2d')!
const fieldCtx = fieldCanvas.getContext('2d')!

// 게임마다 상태를 따로 든다. 판이 진행 중이면 다른 게임으로 갔다 와도 그대로 둔다 (herdr-tetris 와 같다).
let current: GameId = 'tetris'
let game = new Game()
let snake = new Snake()
let mines = new Minesweeper()
let ladder = new Ladder()
let ladderSelected: number | null = null

let paused = false
let started = false
let helpOpen = false
let acc = 0
let snakeAcc = 0
let last = performance.now()
let onMonitor = true // 처음에는 모니터 화면 (herdr-tetris 와 같다)

// 모니터 화면은 가짜 대시보드다 (herdr-tetris src/monitor.py 의 서비스 목록과 로그 문구를 가져왔다).
const SERVICES = ['gateway', 'auth-api', 'orders-db', 'cache-redis', 'queue-worker', 'edge-proxy']
// 한 줄은 패널 폭(420px) 안에 들어가도록 짧게 쓴다. 넘치면 가로 스크롤이 생긴다.
const LOG_LINES = [
  'INFO  http.server    gateway 200 latency=12ms',
  'INFO  cache.redis    cache hit ratio 93%',
  'WARN  db.pool        orders-db slow query 740ms',
  'INFO  queue.consumer queue-worker lag ok',
  'INFO  metrics.export edge-proxy health ok 3ms',
]
const LOG_ROWS = 10
let logHistory: string[] = []

function tickMonitor(): void {
  monitorRows.textContent = SERVICES.map((name) => {
    const value = Math.floor(Math.random() * 101)
    const bar = '#'.repeat(Math.round(value / 100 * 12)).padEnd(12, '.')
    return `${name.padEnd(14)} ${bar} ${String(value).padStart(3)}%`
  }).join('\n')
  logHistory = [...logHistory, LOG_LINES[Math.floor(Math.random() * LOG_LINES.length)]].slice(-LOG_ROWS)
  monitorLogs.textContent = logHistory.join('\n')
}

// data-i18n 이 붙은 HTML 문구를 고른 언어로 바꾼다.
function applyLocale(): void {
  document.documentElement.lang = getLang()
  for (const el of Array.from(document.querySelectorAll<HTMLElement>('[data-i18n]'))) {
    el.textContent = t(el.dataset.i18n as Key)
  }
  pauseBtn.textContent = paused ? t('resume') : t('pause')
  if (current === 'tetris' && started) {
    setStatus(game.gameOver ? t('status_game_over') : paused ? t('status_paused') : t('status_playing'))
  }
  if (helpOpen) helpText.textContent = t(HELP_KEY[current])
  render()
}

// F2: 언어를 다음 것으로 바꾼다.
function changeLanguage(): void {
  cycleLang()
  applyLocale()
}

// 화면 종류에 맞는 팔레트를 CSS 변수로 올린다. 스타일 시트의 색은 모두 이 변수를 쓴다.
function applyTheme(screen: Screen): void {
  const t = THEMES[screen]
  const style = document.documentElement.style
  style.setProperty('--chrome', t.chrome)
  style.setProperty('--field', t.field)
  style.setProperty('--fg', t.fg)
  style.setProperty('--accent', t.accent)
  style.setProperty('--dim', t.dim)
}

function setScreen(monitor: boolean): void {
  onMonitor = monitor
  monitor$.hidden = !monitor
  gameScreen.hidden = monitor
  if (monitor) {
    applyTheme('monitor')
    tickMonitor()
  } else {
    showGame()
  }
}

function drawCell(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, w = CELL, h = CELL): void {
  ctx.fillStyle = color
  ctx.fillRect(x * w + 1, y * h + 1, w - 2, h - 2)
}

function renderTetris(): void {
  boardCtx.clearRect(0, 0, boardCanvas.width, boardCanvas.height)
  for (let r = 0; r < HEIGHT; r++) {
    for (let c = 0; c < WIDTH; c++) {
      const kind = game.board[r][c]
      if (kind) drawCell(boardCtx, c, r, BLOCK_COLORS[kind], BOARD_CELL_W, BOARD_CELL_H)
    }
  }
  if (!game.gameOver) {
    for (const [r, c] of game.activeCells()) {
      if (r >= 0) drawCell(boardCtx, c, r, BLOCK_COLORS[game.kind], BOARD_CELL_W, BOARD_CELL_H)
    }
  }

  nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height)
  for (const [r, c] of cellsAt(game.nextKind, 0, 0, 0)) {
    nextCtx.fillStyle = BLOCK_COLORS[game.nextKind]
    nextCtx.fillRect(c * 14 + 8, r * 14 + 16, 12, 12)
  }

  boardScoreEl.textContent = String(game.score)
  linesEl.textContent = String(game.lines)
  levelEl.textContent = String(game.level)
  overlay.hidden = !game.gameOver
  overlayText.textContent = t('game_over')
}

// 사다리, 스네이크, 지뢰찾기는 캔버스에 그린다. 색은 THEMES 와 위 상수를 쓴다.
const LADDER_COL = 35 // 세로선 사이 간격 (10열이 350px 캔버스에 들어가도록)
const LADDER_ROW = 34 // 가로선 줄 간격
const LADDER_TOP = 52 // 맨 윗줄(PICK 표시)을 비우고, 그 아래 번호 줄과 여백

function ladderX(c: number): number {
  return 16 + c * LADDER_COL
}

function ladderY(r: number): number {
  return LADDER_TOP + (r + 0.5) * LADDER_ROW
}

function drawLadder(): void {
  const t = THEMES.ladder
  const bottom = LADDER_TOP + ladder.rows * LADDER_ROW
  const { end, steps } = ladderSelected === null ? { end: null, steps: [] } : ladder.trace(ladderSelected)
  fieldCtx.fillStyle = t.field
  fieldCtx.fillRect(0, 0, fieldCanvas.width, fieldCanvas.height)
  fieldCtx.font = '12px Consolas, monospace'
  fieldCtx.textAlign = 'center'
  fieldCtx.lineCap = 'round'
  fieldCtx.lineJoin = 'round'

  for (let c = 0; c < ladder.columns; c++) {
    fieldCtx.fillStyle = c === ladderSelected ? t.accent : t.fg
    fieldCtx.fillText(String(c + 1), ladderX(c), 42)
    if (end !== null) {
      fieldCtx.fillStyle = c === end ? t.accent : t.fg
      fieldCtx.fillText(String(c + 1), ladderX(c), bottom + 18)
    }
    fieldCtx.strokeStyle = t.dim
    fieldCtx.lineWidth = 3
    fieldCtx.beginPath()
    fieldCtx.moveTo(ladderX(c), LADDER_TOP)
    fieldCtx.lineTo(ladderX(c), bottom)
    fieldCtx.stroke()
  }
  fieldCtx.strokeStyle = t.fg
  fieldCtx.lineWidth = 3
  ladder.rungs.forEach((rung, r) => {
    rung.forEach((has, c) => {
      if (!has) return
      fieldCtx.beginPath()
      fieldCtx.moveTo(ladderX(c), ladderY(r))
      fieldCtx.lineTo(ladderX(c + 1), ladderY(r))
      fieldCtx.stroke()
    })
  })

  if (ladderSelected !== null && end !== null) {
    // 경로: 시작 열에서 줄마다 옆으로 옮겨 가며 아래 끝까지 잇는다.
    fieldCtx.strokeStyle = t.accent
    fieldCtx.lineWidth = 4
    fieldCtx.beginPath()
    fieldCtx.moveTo(ladderX(ladderSelected), LADDER_TOP)
    steps.forEach(([before, after], r) => {
      fieldCtx.lineTo(ladderX(before), ladderY(r))
      fieldCtx.lineTo(ladderX(after), ladderY(r))
    })
    fieldCtx.lineTo(ladderX(end), bottom)
    fieldCtx.stroke()
  }
}

function drawSnake(): void {
  const t = THEMES.snake
  fieldCtx.fillStyle = t.field
  fieldCtx.fillRect(0, 0, fieldCanvas.width, fieldCanvas.height)
  if (snake.food) {
    // 먹이는 칸 가운데 작은 네모로 그린다.
    const [r, c] = snake.food
    fieldCtx.fillStyle = t.accent
    fieldCtx.fillRect(c * SNAKE_CELL_W + 4, r * SNAKE_CELL + 4, SNAKE_CELL_W - 8, SNAKE_CELL - 8)
  }
  // 몸은 칸 가운데를 잇는 굵은 선으로 그려서 뱀처럼 이어 보이게 한다.
  const center = ([r, c]: [number, number]): [number, number] => [c * SNAKE_CELL_W + SNAKE_CELL_W / 2, r * SNAKE_CELL + SNAKE_CELL / 2]
  fieldCtx.strokeStyle = t.dim
  fieldCtx.lineWidth = SNAKE_CELL * 0.8
  fieldCtx.lineCap = 'round'
  fieldCtx.lineJoin = 'round'
  fieldCtx.beginPath()
  snake.body.forEach((cell, i) => {
    const [x, y] = center(cell)
    if (i === 0) fieldCtx.moveTo(x, y)
    else fieldCtx.lineTo(x, y)
  })
  fieldCtx.stroke()

  // 머리: 큰 원과 눈 두 개. 눈은 진행 방향 앞쪽에 둔다.
  const [hx, hy] = center(snake.body[0])
  const [dr, dc] = snake.direction
  fieldCtx.fillStyle = t.fg
  fieldCtx.beginPath()
  fieldCtx.arc(hx, hy, SNAKE_CELL * 0.6, 0, Math.PI * 2)
  fieldCtx.fill()
  fieldCtx.fillStyle = t.field
  for (const side of [-1, 1]) {
    const ex = hx + dc * 3 + -dr * 3 * side
    const ey = hy + dr * 3 + dc * 3 * side
    fieldCtx.beginPath()
    fieldCtx.arc(ex, ey, 1.8, 0, Math.PI * 2)
    fieldCtx.fill()
  }
  drawSnakeBand(t)
}

// 칸 위쪽 띠에 이름과 수치를 쓴다. 띠는 반투명이라 아래 칸이 조금 비쳐 보인다.
function drawSnakeBand(theme: Theme): void {
  fieldCtx.fillStyle = theme.fg
  fieldCtx.globalAlpha = 0.85
  fieldCtx.fillRect(0, 0, fieldCanvas.width, 24)
  fieldCtx.globalAlpha = 1
  fieldCtx.fillStyle = theme.field
  fieldCtx.font = 'bold 12px Consolas, monospace'
  fieldCtx.textAlign = 'left'
  fieldCtx.textBaseline = 'middle'
  fieldCtx.fillText(`${t('game_snake')}  ${t('snake_stats', { len: snake.body.length, best: snake.best, score: snake.score })}`, 6, 12)
}

function drawMinesweeper(): void {
  fieldCtx.fillStyle = THEMES.minesweeper.field
  fieldCtx.fillRect(0, 0, fieldCanvas.width, fieldCanvas.height)
  fieldCtx.font = 'bold 13px Consolas, monospace'
  fieldCtx.textAlign = 'center'
  fieldCtx.textBaseline = 'middle'
  for (let r = 0; r < mines.rows; r++) {
    for (let c = 0; c < mines.cols; c++) {
      const k = `${r},${c}`
      const x = c * MINE_CELL
      const y = r * MINE_CELL
      const w = MINE_CELL
      if (mines.revealed.has(k)) {
        // 열린 칸: 회색 바탕에 얇은 테두리
        fieldCtx.fillStyle = WIN_GRAY
        fieldCtx.fillRect(x, y, w, w)
        fieldCtx.strokeStyle = WIN_DARK
        fieldCtx.lineWidth = 1
        fieldCtx.strokeRect(x + 0.5, y + 0.5, w - 1, w - 1)
        if (mines.mines?.has(k)) {
          fieldCtx.fillStyle = '#000000'
          fieldCtx.beginPath()
          fieldCtx.arc(x + w / 2, y + w / 2, 5, 0, Math.PI * 2)
          fieldCtx.fill()
        } else {
          const n = mines.count(r, c)
          if (n > 0) {
            fieldCtx.fillStyle = WIN_NUMBERS[n]
            fieldCtx.fillText(String(n), x + w / 2, y + w / 2 + 1)
          }
        }
      } else {
        // 덮인 칸: 윈도 95 식 입체 테두리
        fieldCtx.fillStyle = WIN_GRAY
        fieldCtx.fillRect(x, y, w, w)
        fieldCtx.fillStyle = WIN_LIGHT
        fieldCtx.fillRect(x, y, w, 2)
        fieldCtx.fillRect(x, y, 2, w)
        fieldCtx.fillStyle = WIN_DARK
        fieldCtx.fillRect(x, y + w - 2, w, 2)
        fieldCtx.fillRect(x + w - 2, y, 2, w)
        if (mines.flags.has(k)) {
          fieldCtx.fillStyle = '#ff0000'
          fieldCtx.fillRect(x + 6, y + 5, 8, 8)
        }
      }
    }
  }
  const [cr, cc] = mines.cursor
  fieldCtx.strokeStyle = '#000000'
  fieldCtx.lineWidth = 2
  fieldCtx.strokeRect(cc * MINE_CELL + 1, cr * MINE_CELL + 1, MINE_CELL - 2, MINE_CELL - 2)
}

// 캔버스 크기는 게임이 바뀔 때 맞춘다. 테트리스 칸 크기(CELL)를 그대로 쓴다.
function sizeField(): void {
  if (current === 'ladder') {
    fieldCanvas.width = 354 // 380px 상자 안쪽 폭
    fieldCanvas.height = LADDER_TOP + ladder.rows * LADDER_ROW + 30
  } else if (current === 'snake') {
    fieldCanvas.width = SNAKE_WIDTH * SNAKE_CELL_W
    fieldCanvas.height = SNAKE_HEIGHT * SNAKE_CELL
  } else if (current === 'minesweeper') {
    fieldCanvas.width = mines.cols * MINE_CELL
    fieldCanvas.height = mines.rows * MINE_CELL
  }
}

// 오른쪽 상단 점수 칸. 게임마다 이름만 바뀌고 자리는 같다.
function renderHud(): void {
  switch (current) {
    case 'tetris':
      setHud(t('score'), String(game.score))
      break
    case 'snake':
      setHud(t('score'), String(snake.score))
      break
    case 'minesweeper':
      setHud(t('time'), `${mines.elapsed(performance.now() / 1000)}s`)
      break
    case 'ladder':
      setHud(t('pick'), ladderSelected === null ? '-' : String(ladderSelected + 1))
      break
  }
}

// 상단 우측 HUD 와 사다리 보드 안 점수에 같은 값을 넣는다. 보이는 쪽은 showGame 이 고른다.
function setHud(label: string, value: string): void {
  hudLabel.textContent = label
  scoreEl.textContent = value
  fieldLabelEl.textContent = label
  fieldScoreEl.textContent = value
}

function renderInfo(): void {
  if (current === 'ladder') {
    const picked = ladderSelected === null ? '' : t('pick_pair', { a: ladderSelected + 1, b: ladder.trace(ladderSelected).end + 1 })
    infoEl.textContent = picked
  } else if (current === 'minesweeper') {
    infoEl.textContent = [t('mines_line', { n: mines.minesLeft() }), t('time_line', { n: mines.elapsed(performance.now() / 1000) })].join('\n')
  }
}

function render(): void {
  renderHud()
  if (current === 'tetris') {
    renderTetris()
    return
  }
  if (current === 'ladder') drawLadder()
  else if (current === 'snake') drawSnake()
  else drawMinesweeper()
  renderInfo()
  renderFieldOverlay()
}

// 끝난 판은 화면 위에 결과를 띄운다. 사다리는 끝이 없다.
function renderFieldOverlay(): void {
  const status = current === 'snake' ? snake.status() : current === 'minesweeper' ? mines.status() : 'playing'
  const text = status === 'lost' ? t('game_over') : status === 'won' ? (current === 'snake' ? t('full') : t('clear')) : ''
  fieldOverlay$.hidden = text === ''
  fieldOverlayText.textContent = text
}

function setStatus(text: string): void {
  statusEl.textContent = text
}

// 현재 게임에 맞게 화면 조각과 팔레트를 고른다.
function showGame(): void {
  const tetris = current === 'tetris'
  applyTheme(current)
  // 패널이 있는 게임만 패널 위에 이름을 보인다. 사다리는 패널이 없다.
  textSide$.hidden = current === 'ladder' || current === 'snake'
  // 조작 안내: 패널이 있으면 패널 하단, 없으면 게임 화면 하단
  boxKeys$.hidden = current === 'minesweeper'
  panelNameEl.textContent = current === 'minesweeper' ? t('game_minesweeper') : ''
  // 테트리스와 사다리는 점수를 보드 안에 둔다
  hud$.hidden = tetris || current === 'ladder' || current === 'snake' || current === 'minesweeper'
  fieldHud$.hidden = current !== 'ladder'
  game$.hidden = !tetris
  textGame$.hidden = tetris
  pauseBtn.hidden = !tetris
  if (tetris) game$.focus()
  else sizeField()
  if (!tetris) setStatus('')
  render()
}

// herdr-tetris 규칙: 판이 진행 중이면 그대로 두고, 끝난 판만 새로 시작한다. 사다리는 매번 새로 만든다.
function switchGame(id: GameId): void {
  if (id === 'tetris' && game.gameOver) game = new Game()
  if (id === 'snake' && snake.status() !== 'playing') snake.restart()
  if (id === 'minesweeper' && mines.status() !== 'playing') mines.restart()
  if (id === 'ladder') {
    ladder = new Ladder()
    ladderSelected = null
  }
  current = id
  setScreen(false)
}

function restart(): void {
  game = new Game()
  paused = false
  started = true
  acc = 0
  pauseBtn.textContent = t('pause')
  setStatus(t('status_playing'))
  render()
}

// 다시 시작 버튼과 R 키는 지금 보이는 게임을 다시 시작한다.
function restartCurrent(): void {
  if (current === 'tetris') restart()
  else if (current === 'snake') snake.restart()
  else if (current === 'minesweeper') mines.restart()
  else {
    ladder = new Ladder()
    ladderSelected = null
  }
  render()
}

function togglePause(): void {
  if (!started || game.gameOver) return
  paused = !paused
  pauseBtn.textContent = paused ? t('resume') : t('pause')
  setStatus(paused ? t('status_paused') : t('status_playing'))
}

function act(fn: () => unknown): void {
  if (!started) restart()
  if (paused || game.gameOver) return
  fn()
  render()
}

const keyActions: Record<string, () => void> = {
  ArrowLeft: () => act(() => game.move(-1)),
  ArrowRight: () => act(() => game.move(1)),
  ArrowUp: () => act(() => game.rotate()),
  ArrowDown: () => act(() => game.softDrop()),
  ' ': () => act(() => game.hardDrop()),
  p: togglePause,
  P: togglePause,
  r: restartCurrent,
  R: restartCurrent,
}

// 방향키와 WASD. 스네이크는 방향을 바꾸고, 지뢰찾기는 커서를 옮긴다.
const DIR_KEYS: Record<string, Direction> = {
  ArrowUp: [-1, 0], w: [-1, 0], ArrowDown: [1, 0], s: [1, 0],
  ArrowLeft: [0, -1], a: [0, -1], ArrowRight: [0, 1], d: [0, 1],
}

// 처리한 키면 true 를 돌려준다.
function handleGameKey(key: string): boolean {
  const lower = key.length === 1 ? key.toLowerCase() : key
  if (current === 'tetris') {
    const action = keyActions[key]
    if (!action) return false
    action()
    return true
  }
  if (lower === 'r') {
    restartCurrent()
    return true
  }
  if (current === 'snake') {
    const dir = DIR_KEYS[key] ?? DIR_KEYS[lower]
    if (!dir) return false
    snake.turn(dir)
  } else if (current === 'minesweeper') {
    const now = performance.now() / 1000
    const move = DIR_KEYS[key] ?? DIR_KEYS[lower]
    if (move) mines.moveCursor(move[0], move[1])
    else if (key === ' ' || key === 'Enter') mines.reveal(mines.cursor[0], mines.cursor[1], now)
    else if (lower === 'f') mines.toggleFlag(mines.cursor[0], mines.cursor[1], now)
    else return false
  } else {
    if (key === 'ArrowLeft') ladderSelected = ladderSelected === null ? 0 : Math.max(0, ladderSelected - 1)
    else if (key === 'ArrowRight') ladderSelected = ladderSelected === null ? 0 : Math.min(ladder.columns - 1, ladderSelected + 1)
    else return false
  }
  render()
  return true
}

// 도움말 팝업. 게임 화면에서만 연다. 열려 있는 동안 게임은 멈춘다.
function toggleHelp(): void {
  helpOpen = !helpOpen
  if (helpOpen) helpText.textContent = t(HELP_KEY[current])
  help$.hidden = !helpOpen
}

window.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.key.toLowerCase() === 'h') {
    event.preventDefault()
    if (!onMonitor) toggleHelp()
    return
  }
  if (event.key === 'F2') {
    event.preventDefault()
    changeLanguage()
    return
  }
  if (helpOpen) {
    if (event.key === 'Escape') toggleHelp()
    return
  }
  if (event.key === 'F1') {
    event.preventDefault()
    setScreen(!onMonitor)
    return
  }
  if (onMonitor) return
  if (GAME_FOR_KEY[event.key]) {
    event.preventDefault()
    switchGame(GAME_FOR_KEY[event.key])
    return
  }
  if (handleGameKey(event.key)) event.preventDefault()
})
restartBtn.addEventListener('click', restartCurrent)
pauseBtn.addEventListener('click', togglePause)
game$.addEventListener('click', () => game$.focus())

// 중력과 틱: 테트리스는 game.tickSeconds, 스네이크는 snake.interval() 마다 한 칸 움직인다.
// 일시정지, 게임 오버, 모니터, 도움말 팝업에서는 멈춘다.
function frame(now: number): void {
  const dt = (now - last) / 1000
  last = now
  if (!onMonitor && !helpOpen) {
    if (current === 'tetris' && started && !paused && !game.gameOver) {
      acc += dt
      while (acc >= game.tickSeconds && !game.gameOver) {
        acc -= game.tickSeconds
        game.tick()
      }
      if (game.gameOver) setStatus(t('status_game_over'))
    }
    if (current === 'snake' && !paused && snake.status() === 'playing') {
      snakeAcc += dt
      while (snakeAcc >= snake.interval() && snake.status() === 'playing') {
        snakeAcc -= snake.interval()
        snake.tick()
      }
    }
    render()
  }
  requestAnimationFrame(frame)
}

applyLocale()
render()
setScreen(true)
setInterval(() => { if (onMonitor) tickMonitor() }, 1200)
requestAnimationFrame(frame)
