# 「말귀 마을」 픽셀풍 썸네일·표지 프롬프트

> 시리즈: 인공지능과 자연어 데이터 분석 · 저장소 ai-nlp-data-analysis · 2026-11-20
> 바꾸는 이유: 26층 타워는 너무 높고, 다른 시리즈(베이지안 본사 타워 등)의 건물과 같아 보인다. 대신 **RPG 게임의 마을**로 꾸민다.
> 그림체: **16비트 RPG 픽셀아트**(SNES 시대 마을 맵 느낌), 흰 바탕 지침은 "밝은 낮·흰 여백"으로 지킨다.

---

## 1. 마을 설정 — 한 회차 = 한 구역, 한 쪽 = 건물 하나

말을 알아듣는 법을 배우는 작은 마을 **「말귀 마을」**. 여행자(독자)는 마을 입구에서 출발해 길을 따라 여덟 구역을 돌고, 중간에 광장(5회)에서, 마지막에 언덕 전망대(10회)에서 시험을 본다.

| 위치 | 회차 | 구역 이름 | 건물 3채(쪽) |
|---|---|---|---|
| 마을 입구 | 목차 | 말귀 마을 입구 | 안내판·지도 |
| 1구역 | 1회차 | 첫걸음 거리 | 1-1 판단·인식 길드 / 1-2 편지 분류소 / 1-3 소문 게시판 주점 |
| 2구역 | 2회차 | 공방 거리 | 2-1 재료 손질 공방 / 2-2 도구 대장간 / 2-3 예언의 탑(작은 망루) |
| 3구역 | 3회차 | 쪼개기 골목 | 3-1 말 자르는 목공소 / 3-2 영어 서점 / 3-3 한글 조각 공방 |
| 4구역 | 4회차 | 숫자 바꾸는 시장 | 4-1 환전소 / 4-2 저울 상점 / 4-3 주제별 바구니 가게 |
| 중앙 광장 | 5회 | 중간 점검 광장 | 분수대·퀴즈 게시판 |
| 5구역 | 6회차 | 별자리 언덕 | 6-1 이웃 실 잇는 집 / 6-2 그림자 극장 / 6-3 측량소 |
| 6구역 | 7회차 | 물길 마을 | 7-1 우체국 / 7-2 물레방아와 수문 / 7-3 통역관의 집 |
| 7구역 | 8회차 | 등불 거리 | 8-1 계단 등대 / 8-2 탐조등 번역소 / 8-3 원탁 회의장 |
| 8구역 | 9회차 | 거인들의 항구 | 9-1 로봇 가족 여관 / 9-2 수습 요리 학교 / 9-3 거대 도서관 |
| 언덕 위 | 10회 | 기말 전망대 | 망원경·노을 |

등장인물(첨부 기본 그림과 같은 생김새를 픽셀 스프라이트로): 박사(안경·흰 가운), 조수 하루(분홍·남색 머리, 보라 후드), 초파리 연구원(빨간 겹눈·흰 가운), 주판봇(베이지 네모 몸통·주판). 요약 쪽에는 인턴 시아·모아.

---

## 2. 공통 규칙

| 항목 | 규칙 |
|---|---|
| 스타일 | 16-bit RPG pixel art, top-down 3/4 view village (SNES-era town map), crisp square pixels, **no anti-aliasing, no blur, no gradients**, limited ~32-color palette |
| 분위기 | 밝은 낮, 연한 크림·흰 하늘 여백, 따뜻한 색 지붕, 돌길·꽃밭·나무 |
| 구도 | 16:9. **왼쪽 40%는 하늘·잔디 여백**(제목 자리), 건물과 캐릭터는 오른쪽 60% |
| 금지 | 그림 안 글자·숫자·간판 글씨·로고·워터마크, 실존 인물·브랜드, 고층 빌딩·타워 |
| 크기 | 표지 1600×900(썸네일은 빌드가 800×450으로 줄임) |
| 일관성 | 모든 그림이 **같은 마을**의 다른 장소처럼 보이게: 같은 지붕 색 체계, 같은 돌길, 같은 나무 모양 |

**공통 프롬프트 (모든 요청 맨 앞에 붙이기)**

```
16-bit RPG pixel art, SNES-era top-down 3/4 view fantasy village, crisp square pixels,
no anti-aliasing, no blur, no gradients, limited 32-color palette, bright daytime,
pale cream sky and soft white margins, cobblestone paths, flower beds, round pixel trees,
small cozy buildings with warm red, teal and mustard roofs, no tall towers, no skyscrapers,
four characters as small pixel sprites matching the attached reference sheet
(doctor with glasses and white lab coat; assistant Haru with pink-and-navy hair and purple hoodie;
fruit-fly researcher with big red compound eyes in a white coat; boxy beige robot "AbaBot" holding an abacus),
16:9, keep the left 40% of the frame as empty sky and grass for a title,
no text, no letters, no numbers, no signs with writing, no logos
```

---

## 3. 장면 프롬프트 27장 (공통 프롬프트 뒤에 붙임)

저장 이름: `src/build/covers/cover_<쪽>.webp`

**목차·요약**

| 저장 이름 | 장면 |
|---|---|
| cover_00 | `the village entrance gate with a big wooden notice board (blank) and a hand-drawn village map on a stand; the four characters stand at the gate ready to start a journey; a winding path leads into a small village with eight tiny districts, a central plaza fountain and a hill with a lookout in the distance` |
| cover_5 | `the central village plaza with a stone fountain, a quiz bulletin board with blank paper slips, bunting flags; interns Sia and Moa in maid-style intern outfits hold small flags as referees; villagers gather` |
| cover_10 | `a grassy hilltop lookout at golden hour with a brass telescope, the whole village visible below with its eight districts and plaza; characters hold rolled summary scrolls and celebrate` |

**1회차 · 첫걸음 거리**

| 저장 이름 | 장면 |
|---|---|
| cover_1-1 | `a small guild hall with two doors marked only by icons (an umbrella and an eye); the doctor holds an umbrella deciding, Haru points at a pedestrian crossing a tiny cart road; a chihuahua and a muffin on a market table look alike` |
| cover_1-2 | `a letter sorting office: neat stacked crates with grid labels on one side, a messy pile of letters, speech bubbles and cassette tapes on the other; the fruit fly sorts them into two bins` |
| cover_1-3 | `a cozy tavern with a rumor bulletin board covered in blank notes, a mailbox overflowing with cards showing happy and sad pixel faces, AbaBot chatting with a glowing speech-bubble crystal` |

**2회차 · 공방 거리**

| 저장 이름 | 장면 |
|---|---|
| cover_2-1 | `a raw-material workshop: baskets of messy scroll pieces come in by cart, a character checks them with a magnifier and tosses blank and duplicate pieces away, clean wooden word blocks stacked in a crate` |
| cover_2-2 | `a blacksmith street: three tool racks (a snake-patterned toolbox, an R-shaped toolbox, an easel with bar-chart drawings without text), AbaBot tries different hammers` |
| cover_2-3 | `a small stone lookout with five carved steps, each step with a different icon (rule book, dice, map pins, linked chains, spotlight); Haru lines up dominoes in pairs on a table` |

**3회차 · 쪼개기 골목**

| 저장 이름 | 장면 |
|---|---|
| cover_3-1 | `a carpentry shop where Haru saws a long wooden word plank into small blocks; the doctor pins blocks onto four boards with icons (book, gear, dice, brain); sawdust pixels` |
| cover_3-2 | `a tiny bookshop with lowercase stamp tools, scissors cutting a sentence ribbon, a small trash basket catching tiny chips, a tally chalkboard with tick marks only` |
| cover_3-3 | `a craft workshop where the fruit fly uses tweezers to separate a word block into a root piece and colorful bead suffixes; five different knives hang on the wall; a thick dictionary bristling with sticky notes` |

**4회차 · 숫자 바꾸는 시장**

| 저장 이름 | 장면 |
|---|---|
| cover_4-1 | `a money-exchange stall: on one side a huge wall of grid tiles with one lit tile each, on the other a compact glowing constellation of dots in a jar; AbaBot struggles carrying a heavy grid sheet` |
| cover_4-2 | `a scale shop: a thin booklet and a thick book on a balance scale, a magnifier over a three-step podium of word tokens, a big volume knob on the wall` |
| cover_4-3 | `a basket shop: Haru sorts review cards into colored baskets, a round table map with colored circles of different sizes, a wooden slider lever on the counter` |

**6회차 · 별자리 언덕**

| 저장 이름 | 장면 |
|---|---|
| cover_6-1 | `a hillside cottage garden where word tokens stand as little pins connected by red threads to their neighbors; a signpost tree with yes/no arrow branches` |
| cover_6-2 | `a shadow-puppet theater: a lantern casts the shadow of a long 3D sculpture onto a white screen; next to it a small neighborhood map board with tight clusters of dots` |
| cover_6-3 | `a surveyor's hut: a protractor between two arrows on a table, a long measuring tape, two overlapping rope rings (Venn), customer note cards paired on a line` |

**7회차 · 물길 마을**

| 저장 이름 | 장면 |
|---|---|
| cover_7-1 | `a post office with a mail sorting machine that drops letters into two trays and a dial gauge on the front; a small board with four colored lamps beside it` |
| cover_7-2 | `a canal with a chain of wooden water tanks where the water grows paler (memory fading) beside a pipe with three valves keeping the water bright blue; a water wheel; a small glowing neuron lamp on a dock` |
| cover_7-3 | `an interpreter's house: one character listens with big headphones and writes a single note card, another reads it aloud word by word to visitors; a scoring stamp on the desk` |

**8회차 · 등불 거리**

| 저장 이름 | 장면 |
|---|---|
| cover_8-1 | `a street of five stone steps with a lantern on each step, each lantern brighter than the last; a repair kit open on a bench with four tools (spotlight, small bridge, spirit level, branching tree)` |
| cover_8-2 | `a translation office with a spotlight shining on parts of a long sentence ribbon, a grid of glowing tiles like a heatmap on the wall, a magnifier, luggage tags and boxes on the desk` |
| cover_8-3 | `a round meeting hall where word-token villagers sit around a round table and all look at each other at once, several colored spotlights from the ceiling, each seat with a wave-patterned badge` |

**9회차 · 거인들의 항구**

| 저장 이름 | 장면 |
|---|---|
| cover_9-1 | `a harbor inn with a family portrait wall of friendly robots in growing sizes, a writer robot and a reader robot sitting side by side, a robot with a camera and a paint palette` |
| cover_9-2 | `a cooking school by the harbor: a veteran chef robot studies a new recipe card, a big shared shelf full of labeled-by-icon boxes, instruction cards on the table` |
| cover_9-3 | `a giant friendly robot reading in a huge library while the fruit fly fetches scrolls from a filing cabinet; doctor, judge and banker hats hang on wall hooks` |

---

## 4. 요청 순서와 점검

1. 캐릭터 기본 그림 4장(`fruitfly-lab-expressions/images/{doctor,haru,fruitfly,jupanbot}/E01_joy.png`)을 첨부한다.
2. **cover_00(마을 입구)을 먼저** 받아 마을 그림체·지붕 색·돌길을 확정한다.
3. 확정된 cover_00을 참고 그림으로 함께 올리고 나머지를 회차별 3장씩 요청한다(같은 구역끼리 지붕 색을 맞추라고 한 줄 덧붙인다).

점검표
- [ ] 픽셀이 또렷한가(흐림·그라데이션 없음)
- [ ] 높은 건물·타워가 없는가
- [ ] 왼쪽 40%가 비어 있는가
- [ ] 그림 안에 글자·숫자·간판 글씨가 없는가
- [ ] 캐릭터 4인이 기본 그림과 같은가
- [ ] 27장이 같은 마을처럼 보이는가

---

## 5. 페이지 안의 3D 타워와의 관계 (결정 필요)

이 프롬프트는 **표지·썸네일 그림**용이다. 페이지 첫 화면의 3D 「말귀 타워」(26층)는 그대로 남아 있으므로, 표지만 바꾸면 "마을 표지 + 타워 첫 화면"이 섞인다. 맞추려면 첫 화면도 **픽셀풍 마을 지도**(구역 8개 + 광장 + 언덕, 건물을 누르면 그 쪽으로 이동)로 바꾸는 작업이 필요하다.
