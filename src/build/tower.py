# -*- coding: utf-8 -*-
"""P&E 글로벌 본사 타워 — 3D 첫 화면(건물 안내)

목차(index)는 건물 전체를, 회차 쪽은 그 회차가 들어 있는 층을 3D로 보여 주고
층 평면(방 = 이 쪽의 부분)과 둘러보는 순서를 안내한다.

- build.py / build_extra.py 가 nav 바로 뒤, 표지 그림 앞에 tower_html(key)를 넣는다.
- 이미 빌드된 HTML에는 add_tower.py 로 같은 블록을 넣거나 갈아 끼운다(표식 <!--tower:start--> … <!--tower:end-->).
- three.js 는 CDN(jsdelivr)에서 불러온다. 불러오지 못하면 오른쪽 안내판만으로 쓸 수 있다.
"""
import os, json, html

B = os.path.dirname(os.path.abspath(__file__))
CSS = open(os.path.join(B, 'tower.css'), encoding='utf-8').read()
JS = open(os.path.join(B, 'tower.js'), encoding='utf-8').read()
THREE_VER = '0.170.0'

COMPANY = dict(ko='말귀 타워', en='Malgwi Tower · Words & Context Lab', hq='말귀 연구소',
               motto='사람의 말을 "듣는" 데서 그치지 않고 "알아듣는" 기계를 만드는 연구소',
               note='가상의 연구소 건물입니다. 층마다 한 팀이 있고, 팀마다 그 회차의 자연어 처리 도구로 고객의 말(리뷰·문의·뉴스)을 다룹니다.')

CLOCKS = [('서울', 'Asia/Seoul'), ('도쿄', 'Asia/Tokyo'), ('런던', 'Europe/London'), ('샌프란시스코', 'America/Los_Angeles')]

PAL = ['#3f5fa8', '#138a52', '#d23f2c', '#2563c9', '#a8329f', '#b77800', '#14899a', '#7a45d6']

def LES(a, b, c, sa, sb, sc):
    return [('three', '안내 데스크', '3줄 요약'), ('cast', '팀 라운지', '연구실 식구'), ('lv1', a, '부분 ① ' + sa), ('lv2', b, '부분 ② ' + sb), ('lv3', c, '부분 ③ ' + sc),
            ('dash', '상황실', '한눈에 보는 대시보드'), ('duel', '대결 홀', '초파리 대 주판봇 대결'), ('sum', '정리 데스크', '정리'), ('kg', '자료실', '지식 색인 · 꾸러미')]

REV = [('three', '안내 데스크', '3줄 요약'), ('cast', '팀 라운지', '연구실 식구'), ('summary', '요약 갤러리', '1부 요약'), ('orig', '교안 문제 시험장', '2부 교안 문제'),
       ('calc', '업무 계산실', '3부 업무 계산'), ('score', '점수판', '회차별 점수'), ('kg', '자료실', '지식 색인 · 꾸러미')]

IDX = [('three', '안내 데스크', '3줄 요약'), ('map', '층별 안내판', '회차 지도'), ('keys', '한 줄 핵심 게시판', '한 줄 핵심 모음'), ('dash', '종합 상황실', '종합 대시보드'),
       ('path', '개념 계단', '개념 흐름'), ('how', '식구 라운지', '식구 · 사용법'), ('about', '자료 보관실', '자료와 원칙')]

# 아래에서 위로: 로비 → 강의 1~4회차(3쪽씩) → 5회 중간 점검 라운지 → 강의 6~9회차(3쪽씩) → 10회 옥상 전망대
import sys as _s; _s.path.insert(0, os.path.join(os.path.dirname(B), 'pages'))
from _mk import SEQ as _SEQ
DASHP = {'1-1', '2-3', '3-3', '4-2', '6-3', '7-1', '8-2', '9-2'}
DUELP = {'1-1', '2-1', '3-3', '4-2', '6-3', '7-2', '8-3', '9-2'}
LECTN = {1: '인공지능과 자연어 데이터 분석', 2: '자연어 데이터 분석 프로세스 및 모델', 3: '전처리: 형태소와 말뭉치', 4: '워드 임베딩', 5: 'Word2Vec 활용', 6: '텍스트 생성: 기본', 7: '텍스트 생성: 고급', 8: '최신 인공지능 언어모델'}
def _rooms(num):
    r = [('three', '안내 데스크', '3줄 요약'), ('cast', '팀 라운지', '연구실 식구'), ('lv1', '작업실 ①', '부분 ①'), ('lv2', '작업실 ②', '부분 ②'), ('lv3', '작업실 ③', '부분 ③')]
    if num in DASHP: r.append(('dash', '상황실', '한눈에 보는 대시보드'))
    if num in DUELP: r.append(('duel', '대결 홀', '초파리 대 주판봇 대결'))
    return r + [('sum', '정리 데스크', '정리'), ('kg', '자료실', '지식 색인 · 꾸러미')]
FLOORS = [dict(key='00', label='L', file='index.html', dept='로비 · 안내 데스크', en='Lobby & Directory', branch='말귀 연구소', title='목차 — 인공지능과 자연어 데이터 분석', ep='목차', biz='말귀 타워의 로비입니다. 층별 안내판에서 팀(쪽)을 고르면 그 층으로 올라갑니다.', rooms=IDX)]
for _i, (_n, _f, _t, _l) in enumerate(_SEQ):
    if _l == 0:
        FLOORS.append(dict(key=_n, label=f'{_i+1}F', file=_f, dept='중간 점검 라운지' if _n == '5' else '옥상 전망대', en='Review Lounge' if _n == '5' else 'Rooftop Review Deck', branch='모든 팀 공용 공간', title=_t + (' — 1~4회차' if _n == '5' else ' — 6~9회차'), ep=f'{_n}회', biz='아래층들을 돌아본 연구원들이 요약을 보고, 교안 문제와 업무 계산으로 점검하는 곳이에요.', rooms=REV))
    else:
        FLOORS.append(dict(key=_n, label=f'{_i+1}F', file=_f, dept=_t, en=f'Session {_n}', branch=f'원 강의 {_l}회차 · {LECTN[_l]}', title=_t, ep=f'{_n}회차', biz=f'원 강의 {_l}회차 「{LECTN[_l]}」의 학습 내용 하나를 부분 세 개로 나눠 다루는 팀이에요.', rooms=_rooms(_n)))
for i, f in enumerate(FLOORS):
    f['color'] = '#5d6278' if f['key'] in ('00',) else ('#138a52' if f['key'] in ('5', '10') else PAL[(i - 1) % len(PAL)])
KEYS = [f['key'] for f in FLOORS]
BYKEY = {f['key']: f for f in FLOORS}

e = lambda s: html.escape(str(s), quote=True)

def floor_name(f):
    return f'{f["label"]} {f["dept"]}'

def _data(cur):
    fl = [dict(key=f['key'], label=f['label'], dept=f['dept'], en=f['en'], branch=f['branch'], title=f['title'], ep=f['ep'], file=f['file'],
               biz=f['biz'], color=f['color'], rooms=[dict(id=a, name=b, sec=c) for a, b, c in f['rooms']]) for f in FLOORS]
    return dict(cur=cur, company=COMPANY, floors=fl)

def _route_items(f):
    o = []
    for i, (a, b, c) in enumerate(f['rooms']):
        tag = 'EV' if i == 0 else str(i)
        o.append(f'<li data-i="{i}"><a href="#{a}"><i>{tag}</i><b>{e(b)}</b><span>{e(c)}</span></a></li>')
    return ''.join(o)

def _panel_floor(f):
    i = KEYS.index(f['key'])
    dn = FLOORS[i - 1] if i > 1 else None          # 1F의 아래는 로비(목차)
    up = FLOORS[i + 1] if i + 1 < len(FLOORS) else None
    el = []
    el.append(f'<a class="dn" href="{dn["file"]}" title="{e(dn["title"])}">▼ {e(floor_name(dn))}</a>' if dn else '<span class="dn off">▼ 아래층 없음</span>')
    el.append('<a class="lob" href="index.html">로비 · 목차</a>')
    el.append(f'<a class="up" href="{up["file"]}" title="{e(up["title"])}">▲ {e(floor_name(up))}</a>' if up else '<span class="up off">▲ 옥상이 맨 위층</span>')
    first = '엘리베이터에서 내리면 안내 데스크(3줄 요약)부터 들러요. 걷는 사람 표시가 둘러보는 순서를 따라 움직입니다.'
    return f'''<aside class="tw-panel" aria-label="{e(f["label"])} 층 안내">
<p class="tw-co"><b>{e(COMPANY["ko"])}</b> {e(COMPANY["hq"])} · <span>{e(COMPANY["en"])}</span></p>
<div class="tw-fl"><span class="tw-badge" style="--c:{f["color"]}">{e(f["label"])}</span><div><h2>{e(f["dept"])}</h2><p class="tw-en">{e(f["en"])} · {e(f["branch"])}</p></div></div>
<p class="tw-ep"><b>{e(f["ep"])}</b> {e(f["title"])}</p>
<p class="tw-biz">{e(f["biz"])}</p>
<h3>이 층 둘러보는 순서</h3>
<p class="tw-tip">{first}</p>
<ol class="tw-route">{_route_items(f)}</ol>
<nav class="tw-elev" aria-label="엘리베이터 — 층 이동">{"".join(el)}</nav>
</aside>'''

def _panel_index(f):
    rows = []
    for g in reversed(FLOORS[1:]):
        rows.append(f'<li data-k="{g["key"]}"><a href="{g["file"]}"><span class="tw-badge" style="--c:{g["color"]}">{e(g["label"])}</span><b>{e(g["dept"])}</b><span>{e(g["ep"])} · {e(g["title"])}</span></a></li>')
    rows.append(f'<li data-k="00" class="here"><a href="#three"><span class="tw-badge" style="--c:{f["color"]}">L</span><b>로비 · 안내 데스크</b><span>지금 계신 곳 · 이 목차 쪽</span></a></li>')
    clocks = ''.join(f'<span data-tz="{tz}"><b>{c}</b><i>--:--</i></span>' for c, tz in CLOCKS)
    return f'''<aside class="tw-panel" aria-label="층별 안내판">
<p class="tw-co"><b>{e(COMPANY["ko"])}</b> {e(COMPANY["hq"])} · <span>{e(COMPANY["en"])}</span></p>
<h2>층별 안내판</h2>
<p class="tw-biz">{e(COMPANY["motto"])}. 스물네 팀이 한 층씩 쓰고, 13층 라운지와 26층 옥상 전망대에서 요약정리와 퀴즈를 봅니다. 건물의 층을 누르거나 아래 안내판에서 골라 올라가세요.</p>
<div class="tw-clock" aria-label="세계 지사 시각">{clocks}</div>
<ol class="tw-dir">{"".join(rows)}</ol>
<p class="tw-note">{e(COMPANY["note"])}</p>
</aside>'''

def tower_html(key):
    f = BYKEY[key]
    idx = key == '00'
    panel = _panel_index(f) if idx else _panel_floor(f)
    tools = ('<button type="button" data-v="b" class="on">건물 전체</button><button type="button" data-v="spin" aria-pressed="true">자동 회전</button>' if idx else
             '<button type="button" data-v="b">건물 전체</button><button type="button" data-v="p" class="on">이 층 평면</button>')
    hint = '드래그로 돌려 보고 층을 누르면 안내 카드가 열려요' if idx else '방을 누르면 그 부분으로 내려갑니다 · 드래그로 돌려 보기'
    cap = (f'{COMPANY["ko"]} 3D 모형: 로비부터 26층 전망대까지 27개 층, 층마다 한 팀(회차)' if idx else
           f'{COMPANY["ko"]} 3D 모형에서 {f["label"]} {f["dept"]}을(를) 건물 밖으로 꺼내 보여 주는 층 평면')
    data = json.dumps(_data(key), ensure_ascii=False).replace('</', '<\\/')
    imap = json.dumps({'imports': {'three': f'https://cdn.jsdelivr.net/npm/three@{THREE_VER}/build/three.module.js',
                                   'three/addons/': f'https://cdn.jsdelivr.net/npm/three@{THREE_VER}/examples/jsm/'}})
    return f'''<!--tower:start-->
<style>
{CSS}
</style>
<section class="tower{' tw-idx' if idx else ''}" id="tower" data-floor="{key}" aria-label="{e(COMPANY['ko'])} — 건물 안내">
<div class="tw-stage" role="img" aria-label="{e(cap)}">
<div class="tw-cv" aria-hidden="true"></div><div class="tw-labels" aria-hidden="true"></div>
<div class="tw-tools">{tools}</div>
<p class="tw-hint">{hint}</p>
<div class="tw-card" hidden></div>
<div class="tw-err" hidden>3D 건물을 불러오지 못했습니다(인터넷 연결 · WebGL 확인). 오른쪽 안내판으로 그대로 이동할 수 있어요.</div>
<div class="tw-load">건물을 짓는 중…</div>
</div>
{panel}
</section>
<script type="application/json" id="towerData">{data}</script>
<script type="importmap">{imap}</script>
<script type="module">
{JS}
</script>
<!--tower:end-->
'''

NAV_LINK = '<a href="#tower">건물 안내</a>'
