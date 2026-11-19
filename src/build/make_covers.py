# -*- coding: utf-8 -*-
"""회차 표지(1600x900 WebP)와 공유 미리보기(JPG) 만들기 — 흰 배경, 단어 칩, 연구실 식구 넷.
캐릭터 그림: adminmrobo/fruitfly-lab-expressions (images/*). 생성 그림으로 바꾸려면 docs/COVER_PROMPTS_series.md 참고."""
import os, sys, random
from PIL import Image, ImageDraw, ImageFont, ImageFilter
B = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(B))
CH = sys.argv[1] if len(sys.argv) > 1 else '/home/claude/chars/images'
F = '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'; FM = '/usr/share/fonts/opentype/noto/NotoSansCJK-Medium.ttc'
def font(sz, bold=True): return ImageFont.truetype(F if bold else FM, sz, index=1)
PAGES = [
 ('00', '목차', '인공지능과 자연어 데이터 분석', '말을 "듣는" 기계에서 "알아듣는" 기계로', '#5d6278', ['토큰', 'TF-IDF', 'Word2Vec', 'LSTM', '어텐션', 'GPT', 'BERT', 'RAG'], ['E07_explaining', 'E01_joy', 'E08_guiding', 'E16_proud'], 'L 로비 · 안내 데스크'),
 ('01', '01', '인공지능과 자연어 데이터 분석', '규칙과 학습 · 자연어 데이터 · 감성 분석', '#3f5fa8', ['판단', '인식', '비정형', '형태소', '긍정', '부정', '중립', 'VOC'], ['E07_explaining', 'E01_joy', 'E08_guiding', 'E16_proud'], '1F 고객의 소리(VOC) 접수센터'),
 ('02', '02', '자연어 데이터 분석 프로세스', '수집 · 검증·전처리 · 언어 모델', '#138a52', ['CSV', 'API', '크롤링', '정제', '정규화', '불용어', 'N-gram', 'P(다음|지금)'], ['E08_guiding', 'E07_explaining', 'E09_thinking', 'E12_cheering'], '2F 데이터 수집·파이프라인실'),
 ('03', '03', '형태소와 말뭉치', '토큰화 · 불용어와 원형 · 사용자 사전', '#d23f2c', ['영화', '를', '먹', '었', '습니다', 'not', '갓생', 'KoNLPy'], ['E09_thinking', 'E19_sparkle_eyes', 'E07_explaining', 'E01_joy'], '3F 형태소 분석실'),
 ('04', '04', '워드 임베딩 알아보기', '원핫과 워드 벡터 · TF-IDF · LDA 토픽', '#2563c9', ['원핫', '[0,0,1,0]', 'TF', 'IDF', 'log', 'θ', 'φ', '토픽'], ['E07_explaining', 'E10_confirming', 'E08_guiding', 'E16_proud'], '4F 키워드·토픽 분석팀'),
 ('05', '중간', '중간 요약정리 및 퀴즈', '1~4회차 점검 라운지', '#138a52', ['요약', '퀴즈', '계산', '70%', '1회', '2회', '3회', '4회'], ['E12_cheering', 'E01_joy', 'E10_confirming', 'E19_sparkle_eyes'], '5F 중간 점검 라운지'),
 ('06', '06', 'Word2Vec 활용', '분포 가설 · 벡터 연산 · 유사도', '#a8329f', ['왕', '− 남자', '+ 여자', '≈ 여왕', '코사인', '0.91', '빨라요', '신속해요'], ['E07_explaining', 'E19_sparkle_eyes', 'E08_guiding', 'E01_joy'], '6F 의미 지도실'),
 ('07', '07', '텍스트 생성: 기본', '분류와 평가 · RNN과 LSTM · Seq2Seq', '#b77800', ['정밀도', '재현율', 'F1', 'h(t)', '망각 게이트', '인코더', '디코더', '<END>'], ['E09_thinking', 'E07_explaining', 'E08_guiding', 'E14_sheepish'], '7F 문맥 기억팀'),
 ('08', '08', '텍스트 생성: 고급', '빔 서치 · 어텐션 Q·K·V · 트랜스포머', '#14899a', ['Query', 'Key', 'Value', 'softmax', '√d', '빔 서치', '셀프 어텐션', '밤?'], ['E07_explaining', 'E19_sparkle_eyes', 'E09_thinking', 'E16_proud'], '8F 주목·번역센터'),
 ('09', '09', '최신 인공지능 언어모델', 'GPT와 BERT · 전이학습과 프롬프트 · RAG', '#7a45d6', ['GPT', 'BERT', '[MASK]', 'Few-shot', 'CoT', '파인튜닝', '벡터 DB', 'RAG'], ['E08_guiding', 'E01_joy', 'E09_thinking', 'E12_cheering'], '9F LLM 혁신본부'),
 ('10', '기말', '기말 요약정리 및 퀴즈', '6~9회차 점검 · 옥상 전망대', '#138a52', ['요약', '퀴즈', '계산', '70%', '6회', '7회', '8회', '9회'], ['E16_proud', 'E12_cheering', 'E10_confirming', 'E19_sparkle_eyes'], '10F 옥상 전망대'),
]
WHO = ['doctor', 'haru', 'fruitfly', 'jupanbot']
def cut(im):
    im = im.convert('RGBA'); w, h = im.size; px = im.load(); bg = px[2, 2]
    from collections import deque
    seen = set(); q = deque([(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)])
    def near(c): return abs(c[0] - bg[0]) + abs(c[1] - bg[1]) + abs(c[2] - bg[2]) < 60
    while q:
        x, y = q.popleft()
        if (x, y) in seen or x < 0 or y < 0 or x >= w or y >= h: continue
        seen.add((x, y))
        if not near(px[x, y]): continue
        px[x, y] = (255, 255, 255, 0)
        q.extend([(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)])
    return im
def hexrgb(h): h = h.lstrip('#'); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
def make(p):
    key, badge, title, sub, col, words, moods, floor = p
    W, H = 1600, 900; im = Image.new('RGB', (W, H), 'white'); d = ImageDraw.Draw(im); c = hexrgb(col)
    for x in range(0, W, 40): d.line([(x, 0), (x, H)], fill=(240, 243, 249))
    for y in range(0, H, 40): d.line([(0, y), (W, y)], fill=(240, 243, 249))
    d.rectangle([0, 0, W, 14], fill=c)
    d.rounded_rectangle([70, 64, 70 + 560, 64 + 46], 23, fill=(246, 247, 251), outline=(221, 225, 236))
    d.text((92, 70), '자연어 분석 연구실 · 연구실 해설 시리즈', font=font(24, False), fill=(93, 98, 120))
    d.rounded_rectangle([70, 140, 70 + 170, 140 + 170], 34, fill=c)
    bf = font(84 if len(badge) <= 2 else 60); tw = d.textlength(badge, font=bf); d.text((70 + 85 - tw / 2, 140 + 85 - (52 if len(badge) <= 2 else 40)), badge, font=bf, fill='white')
    tf = font(76); lines = []; cur = ''
    for w_ in title.split(' '):
        t = (cur + ' ' + w_).strip()
        if d.textlength(t, font=tf) > 780 and cur: lines.append(cur); cur = w_
        else: cur = t
    lines.append(cur)
    y = 350
    for ln in lines: d.text((70, y), ln, font=tf, fill=(29, 32, 48)); y += 100
    d.text((72, y + 6), sub, font=font(34, False), fill=c); y += 70
    d.text((72, H - 78), '말귀 타워 · ' + floor, font=font(26, False), fill=(93, 98, 120))
    rnd = random.Random(int(str(key).replace('-', '')) + 7); cf = font(30)
    spots = [(900, 120), (1150, 90), (1380, 150), (960, 230), (1230, 210), (1440, 270), (880, 330), (1150, 330)]
    for (x, y_), wd in zip(spots, words):
        x += rnd.randint(-20, 20); y_ += rnd.randint(-12, 12); tw = d.textlength(wd, font=cf)
        x = min(x, W - 40 - tw - 44); kind = rnd.choice(['g', 'f', 's', 'b'])
        fill, edge, txt = {'g': ((238, 248, 242), (191, 224, 205), (15, 92, 55)), 'f': ((242, 243, 247), (221, 225, 236), (93, 98, 120)), 's': ((255, 246, 230), (240, 211, 154), (138, 90, 0)), 'b': ((234, 241, 253), (188, 208, 243), (29, 79, 158))}[kind]
        d.rounded_rectangle([x, y_, x + tw + 44, y_ + 58], 29, fill=fill, outline=edge, width=2); d.text((x + 22, y_ + 8), wd, font=cf, fill=txt)
    hgt = 250; x = 760
    for who, mood in zip(WHO, moods):
        f = os.path.join(CH, who, mood + '.png')
        if not os.path.exists(f): f = os.path.join(CH, who, 'E01_joy.png')
        ch = cut(Image.open(f)); r = hgt / ch.height; ch = ch.resize((int(ch.width * r), hgt), Image.LANCZOS)
        sh = Image.new('RGBA', (ch.width, 30), (0, 0, 0, 0)); ImageDraw.Draw(sh).ellipse([20, 4, ch.width - 20, 26], fill=(29, 32, 48, 40)); sh = sh.filter(ImageFilter.GaussianBlur(4))
        im.paste(sh, (x, H - 70), sh); im.paste(ch, (x, H - 60 - hgt), ch); x += int(ch.width * 0.86)
    return im
if __name__ == '__main__':
    og = os.path.join(ROOT, 'assets', 'og'); os.makedirs(og, exist_ok=True)
    for p in PAGES:
        im = make(p); k = p[0]
        im.save(os.path.join(B, 'covers', f'cover_{k}.webp'), 'WEBP', quality=82, method=6)
        im.convert('RGB').resize((1200, 675), Image.LANCZOS).save(os.path.join(og, f'cover_{k}.jpg'), 'JPEG', quality=84)
        if k == '00': im.convert('RGB').resize((1200, 675), Image.LANCZOS).save(os.path.join(ROOT, 'assets', 'og_series.jpg'), 'JPEG', quality=84)
        print(k, os.path.getsize(os.path.join(B, 'covers', f'cover_{k}.webp')) // 1024, 'KB')
