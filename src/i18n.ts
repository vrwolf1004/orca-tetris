// 패널 문구 다국어. 언어는 브라우저 언어(navigator.language)로 고른다. 맞는 언어가 없으면 영어.
// 언어 목록은 herdr-tetris 의 src/locales 와 같다. 키가 한 언어라도 빠지면 컴파일 에러가 난다.
// 언어는 화면을 새로 열 때 브라우저 언어로 정하고, F2 로 바꾼다.

const ko = {
  lines: '줄', level: '레벨', next: '다음',
  game_tetris: '테트리스', game_ladder: '사다리', game_snake: '스네이크', game_minesweeper: '지뢰찾기',
  score: '점수', time: '시간', pick: '선택',
  restart: '다시 시작', pause: '일시정지', resume: '계속',
  status_paused: '일시정지', status_game_over: '게임 오버 · R 로 다시 시작',
  game_over: '게임 오버', full: '꽉 참!', clear: '클리어!', restart_hint: 'R: 다시 시작',
  hint_long: 'Ctrl+H 도움말 · F2 언어 · 1-4 게임 · F1 모니터', hint_side: 'Ctrl+H 도움말\n1-4 · F1', help_close: 'Ctrl+H 또는 Esc 로 닫기',
  help_common: 'F2 언어 · 1-4 게임 · F1 모니터',
  help_tetris: '테트리스\n\n← → 이동    ↑ 회전    ↓ 내리기\nSpace 바로 떨어뜨리기    P 일시정지\nR 다시 시작\n\n가로 한 줄을 가득 채우면 지워지고 점수가 오릅니다.\n10줄마다 레벨이 올라 블록이 빨라집니다.',
  help_ladder: '사다리\n\n← → 시작 열 고르기\n고른 열에서 아래까지 가는 길이 노랗게 표시됩니다.\nR 새 사다리',
  help_snake: '스네이크\n\n방향키 또는 WASD 로 방향 바꾸기\n먹이(■)를 먹으면 길어지고 빨라집니다.\n벽이나 자기 몸에 닿으면 끝. R 다시 시작',
  help_minesweeper: '지뢰찾기\n\n방향키 또는 WASD 로 커서 이동\nSpace / Enter 칸 열기    F 깃발\n숫자는 주변 8칸의 지뢰 수입니다.\n지뢰가 아닌 칸을 모두 열면 승리. R 다시 시작',
  mines_line: '지뢰 {n}', time_line: '시간 {n}s', pick_pair: '{a}번 → {b}번',
  snake_stats: '길이 {len}  최고 {best}  점수 {score}',
}

const en: typeof ko = {
  lines: 'LINES', level: 'LEVEL', next: 'NEXT',
  game_tetris: 'TETRIS', game_ladder: 'LADDER', game_snake: 'SNAKE', game_minesweeper: 'MINESWEEPER',
  score: 'SCORE', time: 'TIME', pick: 'PICK',
  restart: 'RESTART', pause: 'PAUSE', resume: 'RESUME',
  status_paused: 'PAUSED', status_game_over: 'GAME OVER · R to restart',
  game_over: 'GAME OVER', full: 'FULL!', clear: 'CLEAR!', restart_hint: 'R: restart',
  hint_long: 'Ctrl+H help · F2 language · 1-4 games · F1 monitor', hint_side: 'Ctrl+H help\n1-4 · F1', help_close: 'Ctrl+H or Esc to close',
  help_common: 'F2 language · 1-4 games · F1 monitor',
  help_tetris: 'TETRIS\n\n← → move    ↑ rotate    ↓ soft drop\nSpace hard drop    P pause\nR restart\n\nFill a row to clear it and score.\nEvery 10 lines the level rises and blocks speed up.',
  help_ladder: 'LADDER\n\n← → choose a start column\nThe path to the bottom is shown in yellow.\nR new ladder',
  help_snake: 'SNAKE\n\nArrows or WASD to turn\nEat food to grow and speed up.\nHit a wall or yourself and it is over. R restart',
  help_minesweeper: 'MINESWEEPER\n\nArrows or WASD to move the cursor\nSpace / Enter open    F flag\nNumbers count the mines in the 8 cells around.\nOpen every safe cell to win. R restart',
  mines_line: 'MINES {n}', time_line: 'TIME {n}s', pick_pair: '{a} → {b}',
  snake_stats: 'LENGTH {len}  BEST {best}  SCORE {score}',
}

const ja: typeof ko = {
  lines: 'ライン', level: 'レベル', next: 'ネクスト',
  game_tetris: 'テトリス', game_ladder: 'はしご', game_snake: 'スネーク', game_minesweeper: 'マインスイーパー',
  score: 'スコア', time: 'タイム', pick: 'ピック',
  restart: 'リスタート', pause: 'ポーズ', resume: '再開',
  status_paused: '一時停止', status_game_over: 'ゲームオーバー · R でリスタート',
  game_over: 'ゲームオーバー', full: '満杯!', clear: 'クリア!', restart_hint: 'R: リスタート',
  hint_long: 'Ctrl+H ヘルプ · F2 言語 · 1-4 ゲーム · F1 モニター', hint_side: 'Ctrl+H ヘルプ\n1-4 · F1', help_close: 'Ctrl+H または Esc で閉じる',
  help_common: 'F2 言語 · 1-4 ゲーム · F1 モニター',
  help_tetris: 'テトリス\n\n← → 移動    ↑ 回転    ↓ ソフトドロップ\nSpace ハードドロップ    P ポーズ\nR リスタート\n\n横一列を埋めると消えて得点になります。\n10ラインごとにレベルが上がり、ブロックが速くなります。',
  help_ladder: 'はしご\n\n← → 開始列を選ぶ\n選んだ列から下までの道が黄色で表示されます。\nR 新しいはしご',
  help_snake: 'スネーク\n\n矢印キーまたは WASD で向きを変える\nエサを食べると長くなり速くなります。\n壁や自分の体に当たると終了。R リスタート',
  help_minesweeper: 'マインスイーパー\n\n矢印キーまたは WASD でカーソル移動\nSpace / Enter 開く    F 旗\n数字は周囲8マスの地雷の数です。\n地雷以外をすべて開けば勝ち。R リスタート',
  mines_line: '地雷 {n}', time_line: 'タイム {n}s', pick_pair: '{a} → {b}',
  snake_stats: '長さ {len}  ベスト {best}  スコア {score}',
}

const de: typeof ko = {
  lines: 'ZEILEN', level: 'STUFE', next: 'NÄCHSTE',
  game_tetris: 'TETRIS', game_ladder: 'LEITER', game_snake: 'SNAKE', game_minesweeper: 'MINENSUCHER',
  score: 'PUNKTE', time: 'ZEIT', pick: 'WAHL',
  restart: 'NEUSTART', pause: 'PAUSE', resume: 'WEITER',
  status_paused: 'PAUSIERT', status_game_over: 'SPIEL VORBEI · R zum Neustart',
  game_over: 'SPIEL VORBEI', full: 'VOLL!', clear: 'GESCHAFFT!', restart_hint: 'R: Neustart',
  hint_long: 'Ctrl+H Hilfe · F2 Sprache · 1-4 Spiele · F1 Monitor', hint_side: 'Ctrl+H Hilfe\n1-4 · F1', help_close: 'Ctrl+H oder Esc zum Schließen',
  help_common: 'F2 Sprache · 1-4 Spiele · F1 Monitor',
  help_tetris: 'TETRIS\n\n← → bewegen    ↑ drehen    ↓ weich fallen\nSpace hart fallen    P Pause\nR Neustart\n\nEine volle Reihe wird gelöscht und gibt Punkte.\nAlle 10 Zeilen steigt das Level und die Blöcke werden schneller.',
  help_ladder: 'LEITER\n\n← → Startspalte wählen\nDer Weg nach unten wird gelb angezeigt.\nR neue Leiter',
  help_snake: 'SNAKE\n\nPfeiltasten oder WASD zum Abbiegen\nFutter fressen macht länger und schneller.\nWand oder eigener Körper beendet das Spiel. R Neustart',
  help_minesweeper: 'MINENSUCHER\n\nPfeiltasten oder WASD bewegen den Cursor\nSpace / Enter öffnen    F Flagge\nZahlen zählen die Minen in den 8 Feldern ringsum.\nAlle freien Felder öffnen gewinnt. R Neustart',
  mines_line: 'MINEN {n}', time_line: 'ZEIT {n}s', pick_pair: '{a} → {b}',
  snake_stats: 'LÄNGE {len}  BEST {best}  PUNKTE {score}',
}

const es: typeof ko = {
  lines: 'LÍNEAS', level: 'NIVEL', next: 'SIGUIENTE',
  game_tetris: 'TETRIS', game_ladder: 'ESCALERA', game_snake: 'SERPIENTE', game_minesweeper: 'BUSCAMINAS',
  score: 'PUNTOS', time: 'TIEMPO', pick: 'ELEGIR',
  restart: 'REINICIAR', pause: 'PAUSA', resume: 'CONTINUAR',
  status_paused: 'EN PAUSA', status_game_over: 'FIN DEL JUEGO · R para reiniciar',
  game_over: 'FIN DEL JUEGO', full: '¡LLENO!', clear: '¡LIMPIO!', restart_hint: 'R: reiniciar',
  hint_long: 'Ctrl+H ayuda · F2 idioma · 1-4 juegos · F1 monitor', hint_side: 'Ctrl+H ayuda\n1-4 · F1', help_close: 'Ctrl+H o Esc para cerrar',
  help_common: 'F2 idioma · 1-4 juegos · F1 monitor',
  help_tetris: 'TETRIS\n\n← → mover    ↑ girar    ↓ bajar\nSpace caída rápida    P pausa\nR reiniciar\n\nLlena una fila para borrarla y sumar puntos.\nCada 10 líneas sube el nivel y los bloques se aceleran.',
  help_ladder: 'ESCALERA\n\n← → elegir columna inicial\nEl camino hasta abajo se muestra en amarillo.\nR nueva escalera',
  help_snake: 'SERPIENTE\n\nFlechas o WASD para girar\nCome comida para crecer y acelerar.\nSi chocas con una pared o contigo misma, se acaba. R reiniciar',
  help_minesweeper: 'BUSCAMINAS\n\nFlechas o WASD para mover el cursor\nSpace / Enter abrir    F bandera\nLos números cuentan las minas de las 8 casillas vecinas.\nAbre todas las casillas seguras para ganar. R reiniciar',
  mines_line: 'MINAS {n}', time_line: 'TIEMPO {n}s', pick_pair: '{a} → {b}',
  snake_stats: 'LONG. {len}  MEJOR {best}  PUNTOS {score}',
}

const fr: typeof ko = {
  lines: 'LIGNES', level: 'NIVEAU', next: 'SUIVANT',
  game_tetris: 'TETRIS', game_ladder: 'ÉCHELLE', game_snake: 'SERPENT', game_minesweeper: 'DÉMINEUR',
  score: 'SCORE', time: 'TEMPS', pick: 'CHOIX',
  restart: 'REDÉMARRER', pause: 'PAUSE', resume: 'REPRENDRE',
  status_paused: 'EN PAUSE', status_game_over: 'PARTIE TERMINÉE · R pour recommencer',
  game_over: 'PARTIE TERMINÉE', full: 'PLEIN !', clear: 'DÉGAGÉ !', restart_hint: 'R : recommencer',
  hint_long: 'Ctrl+H aide · F2 langue · 1-4 jeux · F1 moniteur', hint_side: 'Ctrl+H aide\n1-4 · F1', help_close: 'Ctrl+H ou Échap pour fermer',
  help_common: 'F2 langue · 1-4 jeux · F1 moniteur',
  help_tetris: 'TETRIS\n\n← → déplacer    ↑ tourner    ↓ descente douce\nEspace chute rapide    P pause\nR recommencer\n\nRemplir une ligne la supprime et rapporte des points.\nToutes les 10 lignes le niveau monte et les blocs accélèrent.',
  help_ladder: 'ÉCHELLE\n\n← → choisir la colonne de départ\nLe chemin jusqu\'en bas s\'affiche en jaune.\nR nouvelle échelle',
  help_snake: 'SERPENT\n\nFlèches ou WASD pour tourner\nMange la nourriture pour grandir et accélérer.\nUn mur ou ton corps et c\'est fini. R recommencer',
  help_minesweeper: 'DÉMINEUR\n\nFlèches ou WASD pour déplacer le curseur\nEspace / Entrée ouvrir    F drapeau\nLes chiffres comptent les mines dans les 8 cases voisines.\nOuvre toutes les cases sûres pour gagner. R recommencer',
  mines_line: 'MINES {n}', time_line: 'TEMPS {n}s', pick_pair: '{a} → {b}',
  snake_stats: 'LONG. {len}  MEILLEUR {best}  SCORE {score}',
}

const ru: typeof ko = {
  lines: 'ЛИНИИ', level: 'УРОВЕНЬ', next: 'СЛЕДУЮЩАЯ',
  game_tetris: 'ТЕТРИС', game_ladder: 'ЛЕСТНИЦА', game_snake: 'ЗМЕЙКА', game_minesweeper: 'САПЁР',
  score: 'ОЧКИ', time: 'ВРЕМЯ', pick: 'ВЫБОР',
  restart: 'ЗАНОВО', pause: 'ПАУЗА', resume: 'ПРОДОЛЖИТЬ',
  status_paused: 'ПАУЗА', status_game_over: 'ИГРА ОКОНЧЕНА · R — заново',
  game_over: 'ИГРА ОКОНЧЕНА', full: 'ЗАПОЛНЕНО!', clear: 'ЧИСТО!', restart_hint: 'R: заново',
  hint_long: 'Ctrl+H справка · F2 язык · 1-4 игры · F1 монитор', hint_side: 'Ctrl+H справка\n1-4 · F1', help_close: 'Ctrl+H или Esc — закрыть',
  help_common: 'F2 язык · 1-4 игры · F1 монитор',
  help_tetris: 'ТЕТРИС\n\n← → движение    ↑ поворот    ↓ мягкое падение\nSpace жёсткое падение    P пауза\nR заново\n\nЗаполненная строка удаляется и приносит очки.\nКаждые 10 линий уровень растёт, блоки быстрее.',
  help_ladder: 'ЛЕСТНИЦА\n\n← → выбрать стартовый столбец\nПуть до низа показан жёлтым.\nR новая лестница',
  help_snake: 'ЗМЕЙКА\n\nСтрелки или WASD — поворот\nЕда делает длиннее и быстрее.\nСтена или собственное тело — конец игры. R заново',
  help_minesweeper: 'САПЁР\n\nСтрелки или WASD — курсор\nSpace / Enter открыть    F флаг\nЧисла показывают мины в 8 соседних клетках.\nОткройте все безопасные клетки, чтобы выиграть. R заново',
  mines_line: 'МИНЫ {n}', time_line: 'ВРЕМЯ {n}s', pick_pair: '{a} → {b}',
  snake_stats: 'ДЛИНА {len}  РЕКОРД {best}  ОЧКИ {score}',
}

const STRINGS = { ko, en, ja, de, es, fr, ru }
export type Lang = keyof typeof STRINGS
export type Key = keyof typeof ko

const LANGS = Object.keys(STRINGS) as Lang[]
let current: Lang = LANGS.find((l) => (navigator.language || '').toLowerCase().startsWith(l)) ?? 'en'

export function getLang(): Lang {
  return current
}

// F2 로 다음 언어를 고른다.
export function cycleLang(): Lang {
  current = LANGS[(LANGS.indexOf(current) + 1) % LANGS.length]
  return current
}

// 문구를 고르고 {이름} 자리에 값을 넣는다.
export function t(key: Key, vars: Record<string, string | number> = {}): string {
  let text: string = STRINGS[current][key]
  for (const [name, value] of Object.entries(vars)) text = text.split(`{${name}}`).join(String(value))
  return text
}
