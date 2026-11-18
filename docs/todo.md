# 할 일

## 우선

- [ ] 키 조작 확인 (Orca 안에서): 테트리스, 사다리, 스네이크, 지뢰찾기, 전환 키 1~4, F1, F2, Ctrl+H
- [ ] 화면 배치 확인 (Orca 사이드바 폭): 380px 상자, 버튼 위치, 스네이크 띠, 조작 안내
- [ ] 호스트 단축키 충돌 확인: F1, F2, Ctrl+H (Ctrl+T 는 터미널을 열었음)
- [ ] 시작 전 블록 숨기기 (지금은 처음부터 보임)

## herdr-tetris 에서 가져올 것

herdr-tetris 에는 게임이 여러 개 있습니다. 이 플러그인은 테트리스만 옮겼습니다.

- [x] 사다리 게임 (`src/ladder.ts`)
- [x] 스네이크 (`src/snake.ts`)
- [x] 지뢰찾기 (`src/minesweeper.ts`)
- [ ] 시스템 모니터의 실제 수치 (`src/sysmetrics.py`는 샌드박스에서 읽을 수 없어 미포함, 모니터는 가짜 대시보드)
- [ ] 모니터 명령줄(help, status, logs, clear)
- [x] 게임 전환 키 (숫자 키 1~4 와 상단 탭)
- [x] 다국어 문자열 (7개 언어, `src/i18n.ts`). 번역 원어민 검토는 남음

## 배포

- [ ] 매니페스트 `description` 을 영문으로 바꾸기
- [x] 스토어 이미지: `docs/store/store-cover.png`(1600×1000), `docs/store/store-screenshots.png`(2560×1600). 게임 화면으로 캡처 (모니터 화면 제외)
- [ ] icon 512×512 (아직 없음)
- [ ] GitHub 저장소 만들고 `orca-plugin` 토픽 추가, 태그 `v0.1.0`
- [ ] 목록 상태 페이지 확인
