LECT = {1: '인공지능과 자연어 데이터 분석', 2: '자연어 데이터 분석 프로세스 및 모델', 3: '자연어 데이터 분석을 위한 전처리 과정: 형태소와 말뭉치',
        4: '자연어 처리를 위한 워드 임베딩 알아보기', 5: '인공지능 자연어 처리를 위한 Word2Vec 활용', 6: '인공지능 자연어 분석과 텍스트 생성: 기본',
        7: '인공지능 자연어 분석과 텍스트 생성: 고급', 8: '최신 인공지능 언어모델 엿보기'}


def REF0(n):
    """n = 원 강의 회차(1~8). 이 시리즈의 회차 번호와 다를 수 있다(5~8강 → 6~9회차)."""
    return {'id': f'ahn2025nlp{n:02d}', 'type': 'manuscript', 'title': f'인공지능 자연어 처리 {n}회차: {LECT[n]} (강의 스토리보드·원고)', 'author': [{'family': '안', 'given': '상선'}], 'issued': {'date-parts': [[2025]]},
            'lab': {'work': f'lab:work/ahn2025nlp{n:02d}', 'role': 'primary', 'verified': {'title': True, 'authors': True, 'year': True, 'venue': False}, 'checkedBy': '원고 PPTX 버전 정보(v1.0, 2025.08)', 'note': '온라인 강의 스토리보드·원고(내용전문가 안상선). 게재처 정보 없음'}}


def REF(id, typ, title, authors, year, venue='', role='background', note='', url=''):
    r = {'id': id, 'type': typ, 'title': title, 'author': authors, 'issued': {'date-parts': [[year]]}, 'lab': {'work': f'lab:work/{id}', 'role': role, 'verified': {'title': False, 'authors': False, 'year': False, 'venue': False, 'doi': False}, 'checkedBy': '미확인 — 원문 대조 필요', 'note': note}}
    if venue:
        r['container-title'] = venue
    if url:
        r['URL'] = url
    return r


def SRC0(n):
    return f'안상선 (2025). 인공지능 자연어 처리 {n}회차 「{LECT[n]}」 강의 스토리보드·원고 v1.0. 이 페이지의 주 자료.'


A = lambda fam, giv: {'family': fam, 'given': giv}
