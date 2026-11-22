"""26쪽 확장판 픽셀풍(16비트 RPG 픽셀아트) 표지: 쪽 데이터(제목·부분 이름·용어)로 make_covers.make()를 돌린다."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import make_covers as MC, build, tower, pixel_cover as PC
from PIL import Image
OLD = {p[0]: p for p in MC.PAGES}
FL = {f['key']: f for f in tower.FLOORS}
og = os.path.join(MC.ROOT, 'assets', 'og'); os.makedirs(og, exist_ok=True)
pd = os.path.join(build.ROOT, 'pages')
jobs = [OLD['00']]
for f in sorted(os.listdir(pd)):
    if not f.startswith('p') or not f.endswith('.py') or f == 'p00.py': continue
    P = build.load(os.path.join(pd, f)); n = P['num']
    if P.get('kind') == 'review':
        o = OLD['05' if n == '5' else '10']; jobs.append((n,) + o[1:]); continue
    w = n.split('-')[0].zfill(2); o = OLD[w]
    words = [k for k in P['gloss']][:8]
    while len(words) < 8: words.append(o[5][len(words)])
    sub = ' · '.join(l['short'] for l in P['levels'])
    fl = FL[n]
    jobs.append((n, n, P['short_title'], sub, o[4], words, o[6], f"{fl['label']} {fl['dept']}"))
for p in jobs:
    im = PC.make(p); k = p[0]
    im.save(os.path.join(MC.B, 'covers', f'cover_{k}.webp'), 'WEBP', quality=82, method=6)
    im.convert('RGB').resize((1200, 675), Image.NEAREST).save(os.path.join(og, f'cover_{k}.jpg'), 'JPEG', quality=84)
    if k == '00': im.convert('RGB').resize((1200, 675), Image.NEAREST).save(os.path.join(MC.ROOT, 'assets', 'og_series.jpg'), 'JPEG', quality=88)
    print(k, os.path.getsize(os.path.join(MC.B, 'covers', f'cover_{k}.webp')) // 1024, 'KB')
