# -*- coding: utf-8 -*-
"""픽셀풍(16비트 RPG 픽셀아트) 표지: 534x300 저해상도 캔버스에 안티앨리어싱 없이 그린 뒤 3배 최근접 확대 → 1600x900.
캐릭터 그림(fruitfly-lab-expressions)도 최근접 축소로 픽셀을 살린다."""
import os, random
from PIL import Image, ImageDraw, ImageFont
import make_covers as MC

S = 3; LW, LH = 534, 300
PAL = dict(ink=(29, 32, 48), mute=(93, 98, 120), line=(232, 236, 244), panel=(246, 247, 251), edge=(200, 206, 222), white=(255, 255, 255))
def F(sz, bold=True): return ImageFont.truetype(MC.F if bold else MC.FM, sz, index=1)

def box(d, x0, y0, x1, y1, fill, edge, shadow=(214, 219, 232)):
    """계단식 모서리 상자 + 한 픽셀 그림자(픽셀 UI 창)."""
    d.rectangle([x0 + 2, y1 + 1, x1 + 2, y1 + 2], fill=shadow); d.rectangle([x1 + 1, y0 + 2, x1 + 2, y1 + 2], fill=shadow)
    d.rectangle([x0 + 1, y0, x1 - 1, y1], fill=fill); d.rectangle([x0, y0 + 1, x1, y1 - 1], fill=fill)
    d.line([(x0 + 1, y0), (x1 - 1, y0)], fill=edge); d.line([(x0 + 1, y1), (x1 - 1, y1)], fill=edge)
    d.line([(x0, y0 + 1), (x0, y1 - 1)], fill=edge); d.line([(x1, y0 + 1), (x1, y1 - 1)], fill=edge)

def shade(c, k): return tuple(max(0, min(255, int(v * k))) for v in c)

def sprite(who, mood, h):
    f = os.path.join(MC.CH, who, mood + '.png')
    if not os.path.exists(f): f = os.path.join(MC.CH, who, 'E01_joy.png')
    ch = MC.cut(Image.open(f)); bb = ch.getbbox(); ch = ch.crop(bb)
    r = h / ch.height; ch = ch.resize((max(1, int(ch.width * r)), h), Image.NEAREST)
    a = ch.split()[3].point(lambda v: 255 if v > 110 else 0); ch.putalpha(a)  # 반투명 가장자리 제거 → 픽셀 윤곽
    return ch

def make(p):
    key, badge, title, sub, col, words, moods, floor = p
    c = MC.hexrgb(col); im = Image.new('RGB', (LW, LH), PAL['white']); d = ImageDraw.Draw(im); d.fontmode = '1'
    for x in range(0, LW, 12): d.line([(x, 0), (x, LH)], fill=PAL['line'])          # 모눈 벽
    for y in range(0, LH, 12): d.line([(0, y), (LW, y)], fill=PAL['line'])
    d.rectangle([0, 0, LW, 4], fill=c); d.rectangle([0, 5, LW, 5], fill=shade(c, .7))
    # 바닥 타일(체크)
    fy = LH - 34
    for x in range(0, LW, 10):
        for y in range(fy, LH, 10):
            d.rectangle([x, y, x + 9, y + 9], fill=(236, 239, 246) if ((x // 10 + y // 10) % 2) else (226, 230, 240))
    d.rectangle([0, fy - 2, LW, fy - 1], fill=PAL['edge'])
    # 책장(오른쪽 위 벽)
    bx, by = 300, 20
    box(d, bx, by, bx + 220, by + 46, (247, 241, 230), (196, 170, 128), (226, 214, 196))
    rnd = random.Random(int(str(key).replace('-', '')) * 13 + 5); x = bx + 6
    while x < bx + 212:
        w = rnd.randint(4, 7); h = rnd.randint(26, 38); cc = rnd.choice([c, shade(c, .75), (183, 120, 0), (19, 138, 82), (210, 63, 44), (37, 99, 201), (168, 50, 159)])
        d.rectangle([x, by + 42 - h, x + w - 1, by + 42], fill=cc); d.rectangle([x, by + 42 - h, x + w - 1, by + 42 - h], fill=shade(cc, 1.25)); x += w + 1
    d.rectangle([bx + 2, by + 43, bx + 218, by + 44], fill=(196, 170, 128))
    # 시리즈 띠·배지·제목
    box(d, 22, 16, 22 + 190, 16 + 16, PAL['panel'], PAL['edge']); d.text((28, 18), '자연어 분석 연구실 · 연구실 해설', font=F(10, False), fill=PAL['mute'])
    box(d, 22, 44, 22 + 58, 44 + 58, c, shade(c, .6), shade(c, .45))
    bf = F(28 if len(badge) <= 2 else 21); tw = d.textlength(badge, font=bf); d.text((22 + 29 - tw / 2, 44 + 29 - (19 if len(badge) <= 2 else 15)), badge, font=bf, fill=PAL['white'])
    tf = F(26); lines = []; cur = ''
    for w_ in title.split(' '):
        t = (cur + ' ' + w_).strip()
        if d.textlength(t, font=tf) > 250 and cur: lines.append(cur); cur = w_
        else: cur = t
    lines.append(cur); y = 116
    for ln in lines[:3]:
        d.text((24, y + 1), ln, font=tf, fill=PAL['edge']); d.text((23, y), ln, font=tf, fill=PAL['ink']); y += 33
    sf = F(12, False); st = sub
    while d.textlength(st, font=sf) > 260 and len(st) > 4: st = st[:-2] + '…'
    d.text((24, y + 3), st, font=sf, fill=c)
    # 단어 칩(픽셀 말풍선)
    cf = F(11); spots = [(300, 76), (382, 72), (456, 80), (312, 102), (392, 104), (462, 108), (320, 130), (400, 134)]
    kinds = [((238, 248, 242), (120, 190, 150), (15, 92, 55)), ((242, 243, 247), (190, 196, 212), (93, 98, 120)), ((255, 246, 230), (220, 180, 110), (138, 90, 0)), ((234, 241, 253), (150, 180, 235), (29, 79, 158))]
    for (x, y_), wd in zip(spots, words):
        tw = d.textlength(wd, font=cf); x = min(x + rnd.randint(-6, 6), LW - 10 - tw - 12); y_ += rnd.randint(-3, 3)
        fill, edge, txt = rnd.choice(kinds); box(d, x, y_, int(x + tw + 12), y_ + 17, fill, edge); d.text((x + 6, y_ + 2), wd, font=cf, fill=txt)
    d.text((24, LH - 24), '말귀 타워 · ' + floor, font=F(10, False), fill=PAL['mute'])
    # 캐릭터 넷(최근접 축소) + 한 픽셀 그림자
    x = 250
    for who, mood in zip(MC.WHO, moods):
        ch = sprite(who, mood, 84); yb = LH - 14
        d.ellipse([x + 8, yb - 3, x + ch.width - 8, yb + 3], fill=(214, 219, 232))
        im.paste(ch, (x, yb - ch.height), ch); x += int(ch.width * .80)
    big = im.resize((LW * S, LH * S), Image.NEAREST).crop((0, 0, 1600, 900))
    return big
