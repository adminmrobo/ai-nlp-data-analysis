# 표지 그림 프롬프트 — 픽셀풍(16비트 RPG 픽셀아트)

연구실 해설 페이지의 표지·장면 그림은 **픽셀풍(16비트 RPG 픽셀아트)**이 지침입니다. 지금 표지는 `src/build/pixel_cover.py`가 만든 픽셀풍 자동 표지입니다(534×300 저해상도 캔버스에 안티앨리어싱 없이 그린 뒤 3배 최근접 확대, 캐릭터 팩 그림도 최근접 축소). 생성 그림으로 바꾸려면 아래 프롬프트로 1600×900을 만든 뒤 `src/build/covers/cover_<쪽>.webp`로 저장하고 다시 빌드하세요. 목차 표지(00)를 먼저 받아 그림체를 확인한 뒤 나머지에 참고 그림으로 함께 올리세요. 캐릭터 기본 그림 4장(박사·조수 하루·초파리 연구원·주판봇)을 함께 첨부합니다.

공통: `16-bit RPG pixel art (SNES era), crisp square pixels, no anti-aliasing, limited palette, bright daytime research lab with clean white walls and checker floor tiles, characters drawn as pixel sprites matching the attached reference sheet (doctor with glasses and lab coat, pink-and-navy haired assistant Haru, fruit-fly researcher in lab coat, boxy abacus robot "AbaBot"), 16:9, no text, no logos`

| 쪽 | 장면 |
|---|---|
| 00 자연어 분석 연구실 | a tall pixel "speech tower" building behind the four characters; floating word cards turning into numbers |
| 1-1 AI 모델과 자연어 분석 | characters at a pixel workbench working on three stations labeled by icons for: judgment and recognition, rule-based approach vs machine learning, deep-learning-based natural language analysis |
| 1-2 자연어 데이터의 특징 | characters at a pixel workbench working on three stations labeled by icons for: structured vs unstructured data, natural language data, linguistic diversity and language change |
| 1-3 비즈니스 활용 사례 | characters at a pixel workbench working on three stations labeled by icons for: news and public opinion analysis, lexicon-based sentiment analysis, large language models at work |
| 2-1 분석 프로세스 | characters at a pixel workbench working on three stations labeled by icons for: text data collection, data validation, text validation and preprocessing |
| 2-2 개발환경과 도구 | characters at a pixel workbench working on three stations labeled by icons for: Python NLP libraries, R text analysis packages, IDEs and BI visualization tools |
| 2-3 분석 모델과 방법론 | characters at a pixel workbench working on three stations labeled by icons for: evolution of NLP models, language model, statistical vs neural language models |
| 3-1 형태소 분석 개요 | characters at a pixel workbench working on three stations labeled by icons for: disciplinary foundations of NLP, tokenization, stop-word removal and stemming/lemmatization |
| 3-2 영어 데이터 분석 | characters at a pixel workbench working on three stations labeled by icons for: Natural Language Toolkit, English text preprocessing, part-of-speech tagging and frequency analysis |
| 3-3 한국어 데이터 분석 | characters at a pixel workbench working on three stations labeled by icons for: agglutinative features of Korean, Korean morphological analyzers, corpus and user dictionary |
| 4-1 워드 임베딩 개요 | characters at a pixel workbench working on three stations labeled by icons for: word embedding, sparse vs dense word representations, word embedding pipeline |
| 4-2 빈도 분석과 TF-IDF | characters at a pixel workbench working on three stations labeled by icons for: term frequency analysis, term frequency-inverse document frequency, TF-IDF weighting variants |
| 4-3 토픽 기반 임베딩 | characters at a pixel workbench working on three stations labeled by icons for: history of word embeddings, latent Dirichlet allocation, interpreting LDA results |
| 5 중간 요약정리 및 퀴즈 | a cozy pixel lounge with a quiz scoreboard and summary cards pinned to a corkboard |
| 6-1 Word2Vec 개요 | characters at a pixel workbench working on three stations labeled by icons for: Word2Vec, Word2Vec training efficiency techniques, word vector arithmetic and visualization |
| 6-2 단어 벡터의 시각화 | characters at a pixel workbench working on three stations labeled by icons for: word embedding space, principal component analysis (PCA), t-distributed stochastic neighbor embedding (t-SNE) |
| 6-3 단어의 유사도 측정 | characters at a pixel workbench working on three stations labeled by icons for: applications of word similarity, cosine similarity, other similarity measures and Word2Vec limitations |
| 7-1 분류·회귀와 평가 | characters at a pixel workbench working on three stations labeled by icons for: classification vs regression, text vectorization and logistic regression, classification evaluation metrics |
| 7-2 RNN과 LSTM | characters at a pixel workbench working on three stations labeled by icons for: artificial neuron and activation function, recurrent neural network and vanishing gradients, recurrent neural network and LSTM |
| 7-3 Seq2Seq와 텍스트 생성 | characters at a pixel workbench working on three stations labeled by icons for: sequence-to-sequence encoder-decoder architecture, sequence-to-sequence encoder-decoder, teacher forcing and BLEU score |
| 8-1 Seq2Seq의 한계와 개선 | characters at a pixel workbench working on three stations labeled by icons for: evolution from Seq2Seq to Transformer, beam search and seq2seq improvements, Seq2Seq improvement techniques |
| 8-2 어텐션 메커니즘 | characters at a pixel workbench working on three stations labeled by icons for: query-key-value attention, attention mechanism, evaluating attention and reading heatmaps |
| 8-3 트랜스포머 | characters at a pixel workbench working on three stations labeled by icons for: Transformer architecture, transformer and self-attention, sinusoidal positional encoding |
| 9-1 최신 언어모델 개요 | characters at a pixel workbench working on three stations labeled by icons for: evolution and scaling of language models, GPT and BERT, family of modern language models |
| 9-2 전이학습과 프롬프트 | characters at a pixel workbench working on three stations labeled by icons for: transfer learning, Hugging Face Transformers library and Model Hub, transfer learning and prompt engineering |
| 9-3 LLM과 RAG | characters at a pixel workbench working on three stations labeled by icons for: characteristics of large language models, domain-specific models and progressive fine-tuning, large language models and retrieval-augmented generation |
| 10 기말 요약정리 및 퀴즈 | a pixel rooftop deck in daylight, characters holding summary cards over a tiny pixel city |
