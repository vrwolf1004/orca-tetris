# 개발 절차

```text
ORCA="C:\Users\PC\AppData\Local\Programs\orca\resources\bin\orca.exe"
```

## 1. 규칙 테스트

```text
node --test tests/game.test.ts tests/games.test.ts
```

## 2. 매니페스트 검증

```text
"$ORCA" plugin validate .
```

## 3. 개발 폴더 로드

```text
"$ORCA" plugin dev load .
```

처음 불러오면 승인 지문(`ap1-...`)이 나옵니다. `--approve <지문>`을 붙여 다시 실행합니다. 파일을 바꾸면 지문이 바뀌므로 다시 승인합니다.

## 4. 패널 캡처

```text
"$ORCA" plugin shot <플러그인 키> --panel tetris --out <png 경로>
```

플러그인 키는 `"$ORCA" plugin list`에서 확인합니다.

## 5. 로그

```text
"$ORCA" plugin logs <플러그인 키>
```

## 6. 개발 폴더 제거

```text
"$ORCA" plugin dev unload .
```

## 확인 상태

| 항목 | 상태 |
| --- | --- |
| 규칙 단위 테스트 (10개) | 통과 |
| 매니페스트 검증 | 통과 |
| TypeScript 타입체크 (strict, `src/panel.ts`) | 통과 |
| 개발 폴더 로드, 패널 캡처 | 초기 버전만 확인. 이후 변경은 캡처하지 않음 |
| 키 조작(이동, 회전, 낙하) | 미확인 (사람이 직접 확인) |
