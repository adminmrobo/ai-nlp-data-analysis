# 이미지 제작 지시서 — 인공지능과 자연어 데이터 분석 (26쪽 + 목차)

> 저장소: https://github.com/adminmrobo/ai-nlp-data-analysis · 기준일 2026-11-20 · 그림체 지침: **픽셀풍(16비트 RPG 픽셀아트)**

지금 표지 27장은 `src/build/pixel_cover.py`가 만든 **픽셀풍 자동 표지**입니다(캐릭터 팩 그림 + 쪽 용어 칩). 이 문서는 생성 도구(Genspark 등)로 **장면이 있는 픽셀풍 표지**를 새로 받을 때 쓰는 지시서입니다. 받은 그림을 정해진 이름으로 넣고 다시 빌드하면 바로 바뀝니다.

---

## 1. 그림체 규칙 (모든 그림 공통)

| 항목 | 규칙 |
|---|---|
| 스타일 | 16비트 RPG 픽셀아트(SNES 시대), 네모 픽셀이 또렷하게, **안티앨리어싱·흐림·그라데이션 없음**, 색 수 제한(약 32색) |
| 배경 | **흰 벽** 연구실 + 연한 회색 체크 바닥 타일, 밝은 낮 |
| 캐릭터 | 첨부한 기본 그림 4장과 같은 생김새: 박사(안경·흰 가운), 조수 하루(분홍·남색 머리, 보라 후드), 초파리 연구원(빨간 겹눈·흰 가운), 주판봇(네모 몸통·주판). 필요하면 인턴 시아·모아(메이드 인턴), 방청석 X1~X3 |
| 금지 | 글자·숫자·로고·워터마크를 그림 안에 넣지 않음(제목·칩은 빌드가 따로 얹음), 실제 인물·브랜드 |
| 구도 | 16:9, **왼쪽 40%는 비워 둠**(제목 자리), 캐릭터와 소품은 오른쪽 60% |
| 크기 | 표지 1600×900 PNG/WebP. 공유 미리보기는 빌드가 1200×675로 자름 |

**공통 프롬프트 (모든 요청 앞에 붙이기)**

```
16-bit RPG pixel art (SNES era), crisp square pixels, no anti-aliasing, no blur, limited 32-color palette,
bright daytime research lab with clean white walls and light-gray checker floor tiles,
characters drawn as pixel sprites exactly matching the attached reference sheet
(doctor with glasses and white lab coat; assistant Haru with pink-and-navy hair and purple hoodie;
fruit-fly researcher with big red compound eyes in a lab coat; boxy beige robot "AbaBot" holding an abacus),
16:9, keep the left 40% of the frame empty white wall for a title, no text, no letters, no numbers, no logos
```

---

## 2. 요청 꾸러미 (생성 도구에 올릴 것)

1. 캐릭터 기본 그림 4장 — `fruitfly-lab-expressions/images/{doctor,haru,fruitfly,jupanbot}/E01_joy.png`
2. 이 문서의 공통 프롬프트 + 아래 표의 장면 한 줄
3. **순서:** 목차(00)를 먼저 받아 그림체를 확정 → 확정된 00 그림을 참고 그림으로 함께 올려 나머지를 받기
4. 한 번에 3~5장씩, 같은 회차끼리 묶어 요청(1-1·1-2·1-3 …)

---

## 3. 쪽별 장면과 저장 이름

저장 위치: `src/build/covers/cover_<쪽>.webp` (예: `cover_4-2.webp`, `cover_5.webp`, `cover_00.webp`)

| 쪽 | 저장 이름 | 장면 (공통 프롬프트 뒤에 붙임) |
|---|---|---|
| 00 목차 | cover_00 | a tall pixel tower building "speech tower" seen through a big lab window; the four characters in front, blank word cards floating and turning into small glowing number tiles |
| 1-1 | cover_1-1 | the doctor holds an umbrella (judgment) while Haru points at a pixel bus window spotting a pedestrian (recognition); a chihuahua and a blueberry muffin look-alike on a desk |
| 1-2 | cover_1-2 | a neat spreadsheet-like grid on the left table vs a messy pile of letters, emails, speech bubbles and a tiny cassette on the right; the fruit fly sorts them |
| 1-3 | cover_1-3 | a newspaper stand, a "customer voice" mailbox overflowing with cards with happy/sad pixel faces, and AbaBot chatting with a friendly speech bubble screen |
| 2-1 | cover_2-1 | a conveyor belt: messy notes go in, a magnifier checks for blanks and duplicates, clean word blocks come out into a crate |
| 2-2 | cover_2-2 | a workshop wall of tool racks: a snake-themed toolbox and an "R" shaped toolbox, a notebook-style workbench and a presentation screen with bar charts (no text) |
| 2-3 | cover_2-3 | a staircase of five steps with pixel icons (rule book, dice, map pins, chain links, spotlight); Haru counts word pairs on dominoes |
| 3-1 | cover_3-1 | Haru slices a long word bar into small blocks with a ruler; the doctor pins blocks onto four boards (book, gear, dice, brain icons) |
| 3-2 | cover_3-2 | an English-language workbench: lowercase stamps, scissors cutting a sentence strip, a trash bin catching tiny "the/is" chips, a tally board |
| 3-3 | cover_3-3 | the fruit fly uses tweezers to separate a Korean word block into a root and colored suffix beads; five different knives (analyzers) on a rack; a dictionary with sticky notes |
| 4-1 | cover_4-1 | a huge wall of one-hot grids with a single lit cell each, next to a compact glowing constellation map of dots; AbaBot carries a heavy grid sheet |
| 4-2 | cover_4-2 | two report stacks (thin and thick) on a scale, a magnifier over a keyword ranking podium, a volume knob (log scaling) |
| 4-3 | cover_4-3 | a map table with colored circles of different sizes (topics); Haru sorts review cards into colored baskets; a slider lever on the wall |
| 5 | cover_5 | a cozy pixel lounge with a quiz scoreboard (empty slots), summary cards pinned to a corkboard, interns Sia and Moa holding flags |
| 6-1 | cover_6-1 | word tokens standing as pins on a floor map, neighbors connected by threads; a binary-tree signpost with yes/no arrows |
| 6-2 | cover_6-2 | a flashlight casting the shadow of a long 3D sculpture onto the wall (projection); a second neighborhood-style map with tight clusters |
| 6-3 | cover_6-3 | measuring tools on a desk: a protractor between two arrows, a ruler, overlapping tag rings (Venn) and a matching game of customer question cards |
| 7-1 | cover_7-1 | a mail sorting machine with two output trays and a dial gauge (probability), a separate scoreboard with four colored lamps (metrics) |
| 7-2 | cover_7-2 | a water channel through tanks where the water fades (RNN) beside a pipe with three valves keeping the water bright (LSTM); a small neuron lamp on a desk |
| 7-3 | cover_7-3 | an interpreter booth: one character listens with headphones and writes a single note card, another reads from it aloud word by word; a scoring stamp |
| 8-1 | cover_8-1 | a five-step staircase with a lantern on each step; repair kit with four labeled-by-icon tools (spotlight, bridge, level, branching tree) |
| 8-2 | cover_8-2 | a translator desk with a spotlight heatmap grid on a long sentence strip; Query, Key, Value shown as a magnifier, tags and boxes |
| 8-3 | cover_8-3 | a roundtable where every word token sits and looks at every other at once, multiple colored spotlights (heads), wave-patterned number badges (positions) |
| 9-1 | cover_9-1 | a family photo wall of friendly robots of growing sizes (GPT generations), a writer robot and a reader robot side by side, a camera-and-palette robot |
| 9-2 | cover_9-2 | a veteran chef robot learning a new menu card (fine-tuning), a big shared shelf of model boxes (hub), prompt cards on a table |
| 9-3 | cover_9-3 | a giant friendly robot reading company documents fetched from a filing cabinet by the fruit fly; specialist hats (doctor, judge, banker) on hooks |
| 10 | cover_10 | a pixel rooftop deck in daylight, characters holding summary cards over a small pixel city, the tower's antenna nearby |

---

## 4. 넣고 다시 빌드하기

```
# 받은 그림을 WebP로 저장 (이름은 위 표)
src/build/covers/cover_4-2.webp

# 다시 빌드 — 표지가 있으면 자동 표지 대신 그 그림을 씁니다
python3 src/build/build.py .
```

- 받은 그림이 PNG면 WebP(품질 82)로 바꿔 한 장 150KB 안팎으로 맞춥니다.
- 공유 미리보기(`assets/og/cover_<쪽>.jpg`)는 표지에서 1200×675로 줄여 만듭니다. **최근접(nearest) 축소**를 써야 픽셀이 뭉개지지 않습니다.
- 자동 표지로 되돌리려면 `python3 src/build/make_covers24.py`를 실행합니다.

## 5. 받은 그림 점검표

- [ ] 픽셀이 또렷한가(흐림·부드러운 그라데이션 없음)
- [ ] 배경이 흰 연구실인가
- [ ] 캐릭터 4인이 기본 그림과 같은 생김새인가(안경, 머리색, 겹눈, 주판)
- [ ] 왼쪽 40%가 비어 있는가(제목이 겹치지 않음)
- [ ] 그림 안에 글자·숫자·로고가 없는가
- [ ] 회차의 장면 소품이 보이는가(위 표)
