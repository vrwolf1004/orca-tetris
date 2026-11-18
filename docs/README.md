# Tetris for Orca 문서

Orca 사이드바에서 하는 레트로 게임 모음입니다(테트리스, 사다리, 스네이크, 지뢰찾기). 규칙과 구조는 [herdr-tetris](https://github.com/vrwolf1004/herdr-tetris)를 기준으로 옮겼습니다.

## 문서 목록

- [rules.md](rules.md): 게임 규칙(테트리스 전체, 다른 게임 요약, 키 목록)
- [structure.md](structure.md): 파일 구성, 화면 크기, 역할 나눔, 입력
- [development.md](development.md): 로드, 승인, 테스트, 캡처 등 개발 절차
- [status.md](status.md): 현재 구현 상태와 확인한 것, 확인하지 않은 것
- [todo.md](todo.md): 남은 작업과 배포 준비
- [intro-prep.md](intro-prep.md): 플러그인 목록(소개글, 이미지, 매니페스트) 준비 메모

## 현재 상태 한눈에

- 게임 4종, 모니터 화면, 도움말 팝업(Ctrl+H), 언어 7종(F2 로 변경)이 구현되어 있습니다.
- 규칙 단위 테스트 10개가 통과합니다(`node --test tests/game.test.ts tests/games.test.ts`).
- 매니페스트 검증과 strict 타입체크가 통과합니다.
- Orca 안에서 키 조작과 화면 배치는 아직 확인하지 않았습니다. 자세한 내용은 status.md 를 보세요.
