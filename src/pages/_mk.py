"""24쪽 확장판 페이지 생성 도우미."""
import os, copy, importlib.util
from _common import REF0, SRC0, LECT
D = os.path.dirname(os.path.abspath(__file__))

# (num, file, 짧은 제목, 원 강의 번호) — 순서가 곧 앞뒤 쪽 순서
SEQ = [
 ('1-1', '01-1_ai_models.html', 'AI 모델과 자연어 분석', 1), ('1-2', '01-2_nl_data_features.html', '자연어 데이터의 특징', 1), ('1-3', '01-3_business_cases.html', '비즈니스 활용 사례', 1),
 ('2-1', '02-1_analysis_process.html', '분석 프로세스', 2), ('2-2', '02-2_tools_environment.html', '개발환경과 도구', 2), ('2-3', '02-3_models_methods.html', '분석 모델과 방법론', 2),
 ('3-1', '03-1_morpheme_overview.html', '형태소 분석 개요', 3), ('3-2', '03-2_english_nltk.html', '영어 데이터 분석', 3), ('3-3', '03-3_korean_konlpy.html', '한국어 데이터 분석', 3),
 ('4-1', '04-1_embedding_overview.html', '워드 임베딩 개요', 4), ('4-2', '04-2_tf_idf.html', '빈도 분석과 TF-IDF', 4), ('4-3', '04-3_topic_lda.html', '토픽 기반 임베딩', 4),
 ('5', '05_midterm_review.html', '중간 요약정리 및 퀴즈', 0),
 ('6-1', '06-1_word2vec_overview.html', 'Word2Vec 개요', 5), ('6-2', '06-2_vector_visualization.html', '단어 벡터의 시각화', 5), ('6-3', '06-3_similarity.html', '단어의 유사도 측정', 5),
 ('7-1', '07-1_nlp_ai_models.html', '분류·회귀와 평가', 6), ('7-2', '07-2_rnn_lstm.html', 'RNN과 LSTM', 6), ('7-3', '07-3_seq2seq.html', 'Seq2Seq와 텍스트 생성', 6),
 ('8-1', '08-1_seq2seq_limits.html', 'Seq2Seq의 한계와 개선', 7), ('8-2', '08-2_attention.html', '어텐션 메커니즘', 7), ('8-3', '08-3_transformer.html', '트랜스포머', 7),
 ('9-1', '09-1_modern_lm_overview.html', '최신 언어모델 개요', 8), ('9-2', '09-2_transfer_prompt.html', '전이학습과 프롬프트', 8), ('9-3', '09-3_llm_rag.html', 'LLM과 RAG', 8),
 ('10', '10_final_review.html', '기말 요약정리 및 퀴즈', 0),
]
BY = {s[0]: s for s in SEQ}
_cache = {}
def _old(n):
    if n not in _cache:
        sp = importlib.util.spec_from_file_location('o' + n, os.path.join(D, f'_o{n}.py')); m = importlib.util.module_from_spec(sp); sp.loader.exec_module(m); _cache[n] = m.P
    return _cache[n]
def old(n, i):
    """기존 페이지 n(시리즈 번호 '01'..'09')의 i번째 칸(0부터)을 퀴즈·용어와 함께 가져온다."""
    P = _old(n); l = copy.deepcopy(P['levels'][i]); l['quiz'] = copy.deepcopy(P['quiz'].get(l['id'], []))
    l['_gloss'] = {k: v for k, v in P['gloss'].items() if len(v) > 5 and v[5] == i}
    return l
def old_duel(n): return copy.deepcopy(_old(n)['duel'])
def nav(num):
    i = [s[0] for s in SEQ].index(num)
    pv = SEQ[i - 1] if i > 0 else None; nx = SEQ[i + 1] if i + 1 < len(SEQ) else None
    lab = lambda s: (f'{s[0]}회차 {s[2]}' if '-' in s[0] else f'{s[0]}회 {s[2]}')
    return ((pv[1], lab(pv)) if pv else None), ((nx[1], lab(nx)) if nx else ('index.html', '목차'))

def L(id, short, title, tags, lead, key, node, limit_short, why, pair, talk, sim_title, sim, explain, quiz, math=None, bridge=None, code=None, code_src='orig', gloss=None, sim2=None):
    l = dict(id=id, short=short, title=title, tags=tags, lead=lead, key=key, node=node, limit_short=limit_short, limit_en='limitation of ' + node[3], why=why, pair=pair, talk=talk, sim_title=sim_title, sim=sim, explain=explain, quiz=quiz, _gloss=gloss or {})
    if math: l['math'] = math
    if bridge: l['bridge'] = bridge
    if code: l['code'] = code; l['code_src'] = code_src
    if sim2: l['sim2_title'], l['sim2'] = sim2
    return l

import re as _re
CIRC = '①②③④⑤⑥⑦⑧⑨⑩'
def _num(text):
    """90자 넘는 나열문을 줄로 끊는다(수포자 감사 P3): 이미 ①이 있으면 번호 앞에서, 화살표 흐름은 → 앞에서, 쉼표 나열은 ①②③로."""
    if not isinstance(text, str): return text
    out = []
    for sent in _re.split(r'(?<=[.요다])\s', text):
        plain = _re.sub('<[^>]+>', '', sent)
        if len(plain) > 90 and '<br>' not in sent:
            if '①' in sent:
                sent = _re.sub(r'\s*([②③④⑤⑥⑦⑧⑨])', r'<br>\1', sent).replace('①', '<br>①', 1) if sent.count('①') == 1 else sent
            elif sent.count('→') >= 2:
                sent = _re.sub(r'\s*→\s*', '<br>→ ', sent)
            else:
                m = _re.match(r'^(.{2,40}?)[:：]\s(.+)$', sent)
                head, body = (m.group(1) + ':', m.group(2)) if m else ('', sent)
                end = body.endswith('.'); body = body.rstrip('.')
                parts = _re.split(r',\s(?![^()]*\))', body)
                if 3 <= len(parts) <= 10:
                    sent = head + ''.join(f'<br>{CIRC[k]} {p}' for k, p in enumerate(parts)) + ('.' if end else '')
                    if not head: sent = sent[4:]
        out.append(sent)
    return ' '.join(out)
def _tidy(l):
    for k in ('left', 'right'): l['pair'][k] = _num(l['pair'][k])
    for k in ('problem', 'limit', 'solve'): l['why'][k] = _num(l['why'][k])
    l['lead'] = _num(l['lead'])
    l['explain']['steps'] = [_num(x) for x in l['explain']['steps']]
    return l
TOK = ['START', 'END', 'PAD', 'UNK', 'SOS', 'EOS', 'MASK', 'CLS', 'SEP']
def _fix(o):
    """<START> 같은 특수 토큰이 HTML 태그로 읽히지 않게 〈START〉로 바꾼다."""
    if isinstance(o, str):
        for t in TOK: o = o.replace(f'<{t}>', f'〈{t}〉')
        return o
    if isinstance(o, list): return [_fix(x) for x in o]
    if isinstance(o, tuple): return tuple(_fix(x) for x in o)
    if isinstance(o, dict): return {k: _fix(v) for k, v in o.items()}
    return o

def mk(num, title, eyebrow, question, intro, kpis, three, levels, outro, next_q, changes=None, duel=None, dash=None, abbr=None, examples=None, refs=None, sources=None, hero=None, doc_line=None, extra_gloss=None):
    lec = BY[num][3]; prev, nxt = nav(num)
    levels = _fix(levels)
    from _bridge import B as _BR
    for i, l in enumerate(levels):
        if not l.get('bridge') and (num, i) in _BR: l['bridge'] = dict(gen=_BR[(num, i)][0], gen_lim=_BR[(num, i)][1])
        _tidy(l)
    for i, l in enumerate(levels):
        oid = l['id']; l['id'] = f'lv{i+1}'
        if l.get('math') and 'try_' in l['math']: l['math']['try'] = l['math'].pop('try_')
    gloss = {}
    for i, l in enumerate(levels):
        for k, v in l.pop('_gloss', {}).items():
            v = list(v[:5]) + [i]; gloss[k] = v
    if extra_gloss: gloss.update(extra_gloss)
    quiz = {l['id']: l.pop('quiz') for l in levels}
    sh = [l['short'] for l in levels]
    P = dict(num=num, file=BY[num][1], short_title=BY[num][2], title=title, eyebrow=eyebrow, question=question, question_en=f'{num}: ' + levels[0]['node'][3],
      desc=f'{title} — ' + ' · '.join(sh) + '를 직접 해 보는 비전공자용 연구실 해설(강의 「인공지능과 자연어 데이터 분석」).',
      intro=intro, kpis=kpis,
      hero_talk=hero or [('doc', 'front', f'이번 쪽은 ① {sh[0]} ② {sh[1]} ③ {sh[2]}, 세 칸이에요.'), ('asst', 'smile', '칸마다 실험과 확인 퀴즈를 준비했어요. 수식은 제가 대신 물어볼게요.'), ('fly', 'point', '결과가 나오면 늘 물어봐. 어디서 왔고, 무엇과 비교했지?'), ('robo', 'coin', '새롭고 큰 쪽이 이긴다니까! 얼른 시작하자.')],
      three=three, abbr=abbr or [],
      why_steps=[(l['short'], l['why']['problem']) for l in levels],
      big_lead=' → '.join(sh) + ' → 다음 쪽.',
      big=[(f'{"①②③"[i]} {l["short"]}', l['key']) for i, l in enumerate(levels)] + [('④ 다음 쪽', next_q)],
      levels=levels, duel=duel, dash=dash,
      summary=dict(table=[(f'{"①②③"[i]} {l["short"]}', l['key'], l['limit_short']) for i, l in enumerate(levels)],
                   terms=[(v[0], v[2]) for v in list(gloss.values())[:3]], analogy_limits=[],
                   doc_line=doc_line or levels[-1]['key']),
      next_q=next_q, outro=outro, gloss=gloss, core=list(gloss.keys())[:12], quiz=quiz,
      facts=[dict(id=f'F0{i+1}', ko=l['key'], work=f'ahn2025nlp{lec:02d}', loc=l['title'], anchor=f'#{l["id"]}', lv=i, conf='mid') for i, l in enumerate(levels)],
      refs=[REF0(lec)] + (refs or []), sources=[SRC0(lec) + (f' 이 시리즈의 {num.split("-")[0]}회차는 원 강의의 {lec}회차입니다.' if int(num.split('-')[0]) != lec else '')] + (sources or []),
      examples=examples or ['실험의 데이터와 확률은 시드를 고정한 설명용 예시값이며 실제 데이터가 아닙니다.'],
      changes=changes or [], prev=prev, next=nxt, family='nlp', domain=['ai-nlp'], lecture=lec)
    return _fix(P)

def Q(q, o, a, why, hint='', kind='개념'):
    return dict(q=q, o=o, a=a, why=why, hint=hint, kind=kind)
def G(term, cat, d, en, gid):
    """칸 용어 하나: {용어: [표시, 분류, 뜻, 영문, id]} — 칸 번호는 mk가 붙인다."""
    return {term: [term, cat, d, en, gid]}
def gl(*gs):
    o = {}
    for g in gs: o.update(g)
    return o
