/* ===== 자연어 분석 연구실 실험 모듈 A (1~4회차) · 시드 고정 · 설명용 모형 ===== */
function chips(arr){return '<div class="toks">'+arr.map(function(t){return '<span class="tok '+(t.k||'')+'"'+(t.t?' title="'+esc(t.t)+'"':'')+'>'+esc(t.w)+(t.s!=null?'<small>'+t.s+'</small>':'')+'</span>'}).join('')+'</div>'}
function tbl(head,rows,min){return '<table class="tb"'+(min?' style="min-width:'+min+'px"':'')+'><tr>'+head.map(function(x){return '<th>'+x+'</th>'}).join('')+'</tr>'+rows.map(function(r){return '<tr'+(r.cls?' class="'+r.cls+'"':'')+'>'+r.c.map(function(x,i){return '<td'+(r.n&&r.n[i]?' class="n"':'')+'>'+x+'</td>'}).join('')+'</tr>'}).join('')+'</table>'}
function cosv(a,b){var d=0,na=0,nb=0;for(var i=0;i<a.length;i++){d+=a[i]*b[i];na+=a[i]*a[i];nb+=b[i]*b[i]}return na&&nb?d/Math.sqrt(na*nb):0}
function softmax(a,T){T=T||1;var m=Math.max.apply(null,a),e=a.map(function(v){return Math.exp((v-m)/T)}),s=e.reduce(function(x,y){return x+y},0);return e.map(function(v){return v/s})}
function hbars(ctx,x0,y0,w,items,rowh,fmt){var mx=Math.max.apply(null,items.map(function(t){return Math.abs(t.v)}).concat([1e-9]));items.forEach(function(t,i){var y=y0+i*rowh;txt(ctx,t.l,x0-8,y+rowh*.62,t.lc||COL.text,12,'right',t.b);ctx.fillStyle=COL.panel;ctx.fillRect(x0,y+3,w,rowh-8);ctx.fillStyle=t.c||COL.s;ctx.fillRect(x0,y+3,w*Math.max(0,t.v)/mx,rowh-8);txt(ctx,fmt?fmt(t.v):String(t.v),x0+w*Math.max(0,t.v)/mx+6,y+rowh*.62,COL.text,12,'left',true)})}

/* ---------- 1회차 ---------- */
/* 대출 신청자 데이터(설명용): 월소득(만 원)과 카드지출 비율(%) */
function loanData(n,seed){var r=rng(seed),d=[];for(var i=0;i<n;i++){var inc=150+r()*650,rat=10+r()*80,z=(inc-420)/70-(rat-52)/11+0.6*gauss(r),ok=z>0?1:0;d.push([inc,rat,ok])}return d}
function ruleAcc(d,T1,T2){var k=0;d.forEach(function(p){var ap=p[0]>=T1&&p[1]<=T2?1:0;if(ap===p[2])k++});return k/d.length}
function learnRule(d){var best=[-1,0,0];for(var a=150;a<=800;a+=25)for(var b=10;b<=90;b+=4){var s=ruleAcc(d,a,b);if(s>best[0]+1e-9)best=[s,a,b]}return best}
SIMS.rulevsml=function(el,cfg){var H=300,c=S0(el,cfg,H,'대출 신청자 산점도와 승인 영역'),row=ctrlRow(el),row2=ctrlRow(el),K=kpis(el,4),E=eqline(el),I=insight(el),T1=cfg.T1||300,T2=cfg.T2||60,mode='rule',train=loanData(200,11),test=loanData(1000,99),L=learnRule(train);
  var s1=slider(row,'전문가 기준 ① 월소득 이상',150,800,25,T1,function(v){return nf(v)+'만 원'},function(v){T1=v;draw()}),s2=slider(row,'전문가 기준 ② 카드지출 비율 이하',10,90,2,T2,function(v){return v+'%'},function(v){T2=v;draw()});
  buttons(row2,'승인 기준',[['rule','전문가가 정한 규칙'],['ml','데이터로 찾은 기준']],'rule',function(v){mode=v;draw()});
  function draw(){var W=fit(c,H),ctx=c.getContext('2d');ctx.clearRect(0,0,W,H);grid(ctx,W,H);var x0=56,y0=H-36,w=W-80,hh=H-64,X=function(v){return x0+w*(v-150)/650},Y=function(v){return y0-hh*(v-10)/80};
    var a=mode==='rule'?T1:L[1],b=mode==='rule'?T2:L[2];ctx.fillStyle='rgba(19,138,82,.09)';ctx.fillRect(X(a),Y(b),X(800)-X(a),y0-Y(b));ctx.strokeStyle=mode==='rule'?COL.fly:COL.robo;ctx.lineWidth=2;ctx.setLineDash([6,4]);ctx.strokeRect(X(a),Y(b),X(800)-X(a),y0-Y(b));ctx.setLineDash([]);
    train.forEach(function(p){var x=X(p[0]),y=Y(p[1]);if(p[2]){ctx.fillStyle=COL.g;ctx.beginPath();ctx.arc(x,y,3.4,0,7);ctx.fill()}else{ctx.strokeStyle=COL.r;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x-3,y-3);ctx.lineTo(x+3,y+3);ctx.moveTo(x+3,y-3);ctx.lineTo(x-3,y+3);ctx.stroke()}});
    ctx.strokeStyle=COL.rule;ctx.beginPath();ctx.moveTo(x0,y0-hh);ctx.lineTo(x0,y0);ctx.lineTo(x0+w,y0);ctx.stroke();[150,300,450,600,750].forEach(function(v){txt(ctx,v,X(v),y0+15,COL.muted,10,'center')});[10,30,50,70,90].forEach(function(v){txt(ctx,v+'%',x0-6,Y(v)+4,COL.muted,10,'right')});
    txt(ctx,'월소득(만 원) →',x0+w,H-6,COL.muted,11,'right');txt(ctx,'↑ 카드지출 비율',x0+4,16,COL.muted,11);txt(ctx,'● 제때 갚음  ✕ 연체',x0+120,16,COL.text,11);txt(ctx,'초록 칸 = 승인',x0+260,16,COL.g,11,'left',true);stamp(ctx,W,'설명용 모형 · 시드 고정');
    var ra=ruleAcc(test,T1,T2),ma=ruleAcc(test,L[1],L[2]);K([[pct(ra,1),'전문가 규칙 · 새 신청자 1,000명 정확도','i'],[pct(ma,1),'데이터 기준 · 같은 1,000명 정확도','g'],[nf(L[1])+'만 원 · '+L[2]+'%','지난 200건에서 찾은 기준','m'],[mode==='rule'?'규칙':'학습','지금 그림의 승인 칸','a']]);
    E('정확도 = 판정이 실제 결과와 맞은 사람 수 ÷ 전체 → 규칙 <b>'+pct(ra,1)+'</b>, 데이터로 찾은 기준 <em>'+pct(ma,1)+'</em>');
    I([[ma>=ra?'g':'a',ma>=ra?'과거 200건을 보고 기준을 찾으니 새 신청자에게도 잘 맞아요. 머신러닝은 "조건을 사람이 쓰지 않고 데이터에서 찾는 것"이에요.':'지금 전문가 기준이 데이터로 찾은 기준만큼 좋네요. 좋은 전문가 규칙은 여전히 쓸모가 있어요.'],['a','데이터로 찾은 기준은 과거 데이터를 닮아요. 과거 데이터가 적거나 치우치면 기준도 틀어집니다(아래 대결).']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* 텍스트를 쪼개는 단위 */
SIMS.units=function(el,cfg){var box=h('div',{class:'tw'}),row=ctrlRow(el),row2=ctrlRow(el),K=kpis(el,4),I=insight(el),si=0,lv='morph';el.insertBefore(box,row);
  buttons(row,'문장',cfg.sents.map(function(s,i){return [i,s.label]}),0,function(v){si=v;draw()});
  buttons(row2,'쪼개는 단위',[['sent','문장'],['eoj','어절(띄어쓰기)'],['morph','형태소'],['mean','의미 있는 조각만']],'morph',function(v){lv=v;draw()});
  function draw(){var S=cfg.sents[si],M=S.m.map(function(x){return {w:x[0],k:x[1]==='f'?'f':x[1]==='s'?'s':'m',t:x[2]}}),out;
    if(lv==='sent')out=[{w:S.text,k:'m'}];else if(lv==='eoj')out=S.text.replace(/[.!?]$/,'').split(' ').map(function(w){return {w:w,k:'m'}});else if(lv==='morph')out=M;else out=M.filter(function(t){return t.k!=='f'});
    var cnt={};M.filter(function(t){return t.k!=='f'}).forEach(function(t){cnt[t.w]=(cnt[t.w]||0)+1});
    box.innerHTML='<p class="muted" style="margin:0 0 6px">원문: <b>'+esc(S.text)+'</b></p>'+chips(out)+'<p class="muted" style="font-size:13px;margin:8px 0 4px">초록 = 뜻을 가진 조각 · 회색 = 문법 기능(조사·어미) · 주황 = 사전에 없을 수 있는 특수 표현</p>'+'<details class="more"><summary>표(정형 데이터)로 바꾸면</summary>'+tbl(['조각','나온 횟수'],Object.keys(cnt).map(function(k){return {c:[esc(k),cnt[k]],n:[0,1]}}),260)+'</details>';
    var nf_=M.filter(function(t){return t.k==='f'}).length;K([[S.text.replace(/ /g,'').length+'자','글자 수(띄어쓰기 제외)','i'],[S.text.split(' ').length+'개','어절','a'],[M.length+'개','형태소','m'],[(M.length-nf_)+'개','의미 있는 조각','g']]);
    I([['g',S.note],['a','엑셀 표처럼 칸이 정해져 있지 않아서, 분석하려면 먼저 "어떤 단위로 자를지"를 정해야 해요. 이 일이 3회차의 형태소 분석입니다.']])}
  draw()};

/* 감성 사전(규칙)으로 리뷰 점수 매기기 */
SIMS.lexicon=function(el,cfg){var box=h('div',{class:'tw'}),row=ctrlRow(el),K=kpis(el,3),E=eqline(el),I=insight(el),neg=false,neo=false;el.insertBefore(box,row);
  var g=h('div',{class:'group'});g.appendChild(h('span',{class:'glabel'},'규칙 추가'));[['neg','부정어 처리("않·안·못"이면 앞 단어 점수 뒤집기)'],['neo','신조어 사전(대박·갓생·인정 등)']].forEach(function(o){var b=h('button',{class:'bt',type:'button','aria-pressed':'false'},o[1]);b.addEventListener('click',function(){if(o[0]==='neg')neg=!neg;else neo=!neo;b.setAttribute('aria-pressed',String(o[0]==='neg'?neg:neo));draw()});g.appendChild(b)});row.appendChild(g);
  function score(r){var s=0,last=0,parts=[];r.t.forEach(function(it){var v=0;if(it[1]==='NEG'){if(neg&&last){s-=2*last;parts.push('뒤집기('+esc(it[0])+')');last=0}return}if(it[1]==='NEW'){if(!neo)return;v=it[2]}else v=it[1];s+=v;last=v;parts.push(esc(it[0])+(v>0?'+':'')+v)});return {s:s,p:parts}}
  function draw(){var ok=0,rows=cfg.reviews.map(function(r){var o=score(r),pr=o.s>0?'긍정':o.s<0?'부정':'중립',hit=pr===r.y;if(hit)ok++;return {c:[esc(r.x),o.p.join(' ')||'—',(o.s>0?'+':'')+o.s,pr,r.y,hit?'✓':'✗'],n:[0,0,1,0,0,0],cls:hit?'':'miss'}});
    box.innerHTML=tbl(['리뷰','찾은 감성 단어','점수','판정','정답','맞음'],rows,640);var acc=ok/cfg.reviews.length;
    K([[ok+' / '+cfg.reviews.length,'맞힌 리뷰','g'],[pct(acc,0),'정확도','i'],[(neg?1:0)+(neo?1:0)+'개','추가한 규칙','a']]);E('리뷰 점수 = 찾은 긍정 단어(+) 와 부정 단어(−)의 합 → 0보다 크면 <b>긍정</b>, 작으면 <em>부정</em>, 0이면 중립');
    I([[acc>=.9?'g':'a',acc>=.9?'규칙을 둘 더하니 대부분 맞혀요. 그래도 남은 하나가 있죠?':'규칙(감성 사전)만으로는 "좋지 않아요", "대박" 같은 표현에서 틀려요. 규칙을 하나씩 더해 보세요.'],['r','"참 빨리도 오네요 ^^"는 비꼬는 말이라 규칙을 더해도 틀려요. 끝없이 규칙을 더하는 대신 데이터로 배우는 쪽(머신러닝)으로 넘어가는 이유예요.']])}
  draw()};

/* ---------- 2회차 ---------- */
SIMS.collect=function(el,cfg){var box=h('div',{class:'tw'}),row=ctrlRow(el),row2=ctrlRow(el),K=kpis(el,3),I=insight(el),si=0,fr=2;el.insertBefore(box,row);
  var FQ=['한 번만','월 1회','매일','매시간','실시간(분 단위)'];
  buttons(row,'상황',cfg.cases.map(function(s,i){return [i,s.name]}),0,function(v){si=v;draw()});
  slider(row2,'필요한 갱신 주기',0,4,1,2,function(v){return FQ[v]},function(v){fr=v;draw()});
  function draw(){var C=cfg.cases[si],M=cfg.methods.map(function(m){var s=m.base[si]+m.fresh*fr;return {m:m,s:s}}),best=M.slice().sort(function(a,b){return b.s-a.s})[0];
    box.innerHTML='<p style="margin:0 0 8px"><b>'+esc(C.name)+'</b> — '+esc(C.desc)+'</p>'+tbl(['방법','이 상황 점수','장점','주의할 점'],M.map(function(o){return {c:[(o===best?'★ ':'')+esc(o.m.name),o.s.toFixed(0),esc(o.m.good),esc(o.m.warn)],n:[0,1,0,0],cls:o===best?'best':''}}),620);
    K([[esc(best.m.name),'추천 수집 방법','g'],[FQ[fr],'갱신 주기','i'],[best.m.law?'확인 필요':'낮음','법·약관 검토 부담',best.m.law?'r':'a']]);
    I([['g',C.tip],['a','점수는 이 페이지가 정한 설명용 가중치예요. 실제로는 데이터의 출처·형식·양, 비용과 법적 조건을 함께 따집니다.']])}
  draw()};

SIMS.pipeline=function(el,cfg){var box=h('div',{class:'tw'}),row=ctrlRow(el),K=kpis(el,4),E=eqline(el),I=insight(el),st=0;el.insertBefore(box,row);
  var NAMES=['원본','① 검증(빈 행·중복·광고 제거)','② 정제(태그·주소·기호 제거)','③ 정규화(소문자·반복 줄이기)','④ 토큰화 + 불용어 제거'];
  slider(row,'전처리 단계',0,4,1,0,function(v){return NAMES[v]},function(v){st=v;draw()});
  function run(){var rows=cfg.raw.slice(),seen={};if(st>=1){rows=rows.filter(function(r){var k=r.trim();if(!k||/http|www\./.test(k)&&/광고|할인코드|클릭/.test(k)||seen[k])return false;seen[k]=1;return true})}
    if(st>=2)rows=rows.map(function(r){return r.replace(/<[^>]+>/g,' ').replace(/https?:\/\/\S+/g,' ').replace(/[!?.~^,]+/g,' ').replace(/\s+/g,' ').trim()});
    if(st>=3)rows=rows.map(function(r){return r.toLowerCase().replace(/(ㅋ|ㅎ)\1+/g,'$1$1').replace(/(.)\1{2,}/g,'$1$1')});
    var toks=rows.map(function(r){var t=r.split(/\s+/).filter(Boolean);if(st>=4){t=t.map(function(w){return w.replace(/(이|가|은|는|을|를|도|에|에서|요)$/,function(m,p,o,s){return s.length>2?'':m})}).filter(function(w){return w&&cfg.stop.indexOf(w)<0})}return t});return {rows:rows,toks:toks}}
  function draw(){var R=run(),all=[],cnt={};R.toks.forEach(function(t){t.forEach(function(w){all.push(w);cnt[w]=(cnt[w]||0)+1})});var top=Object.keys(cnt).sort(function(a,b){return cnt[b]-cnt[a]}).slice(0,3);
    box.innerHTML='<p class="muted" style="margin:0 0 6px">지금 단계: <b>'+NAMES[st]+'</b></p>'+tbl(['#',st>=4?'남은 토큰':'리뷰 내용'],R.rows.map(function(r,i){return {c:[i+1,st>=4?chips(R.toks[i].map(function(w){return {w:w,k:'m'}})):esc(r)||'<span class="muted">(빈 행)</span>']}}),420);
    K([[R.rows.length+' / '+cfg.raw.length,'남은 리뷰','i'],[nf(all.length),'토큰 수(띄어쓰기 기준)','a'],[Object.keys(cnt).length+'개','서로 다른 단어','m'],[top.map(esc).join(' · '),'가장 많은 단어 3개','g']]);
    E('수집 → <b>검증</b>(빈 행·중복·광고) → <b>정제</b>(태그·기호) → <b>정규화</b>(표기 통일) → <b>토큰화·불용어 제거</b> → 분석');
    I([[st<4?'a':'g',st<4?'단계를 올려 보세요. 가장 많은 단어 3개가 어떻게 바뀌는지가 핵심이에요.':'이제 가장 많은 단어가 "배송·좋아요" 같은 의미 있는 말이 되었어요. 분석은 여기서부터입니다.'],['a','이 실험의 조사 떼기는 끝 글자만 보는 단순한 규칙이에요. 한국어는 형태소 분석기가 필요합니다(3회차).']])}
  draw()};

SIMS.bigram=function(el,cfg){var c=S0(el,cfg,230,'다음 단어 확률 막대'),row=ctrlRow(el),row2=ctrlRow(el),K=kpis(el,4),E=eqline(el),I=insight(el),cur=cfg.start||'배송',sm=false,S=cfg.sents.map(function(s){return ('<s> '+s+' </s>').split(' ')}),V={},B={},U={};
  S.forEach(function(s){s.forEach(function(w,i){V[w]=1;U[w]=(U[w]||0)+1;if(i<s.length-1){var k=w+' '+s[i+1];B[k]=(B[k]||0)+1}})});var VOC=Object.keys(V).filter(function(w){return w!=='<s>'});
  buttons(row,'지금 단어',cfg.picks.map(function(w){return [w,w]}),cur,function(v){cur=v;draw()});
  buttons(row2,'처음 보는 단어 쌍',[[false,'그대로(0)'],[true,'1씩 더하기(평활)']],false,function(v){sm=v;draw()});
  function p(a,b){var n=B[a+' '+b]||0,d=0;for(var k in B)if(k.split(' ')[0]===a)d+=B[k];return sm?(n+1)/(d+VOC.length):(d?n/d:0)}
  function sp(t){var w=('<s> '+t+' </s>').split(' '),r=1;for(var i=0;i<w.length-1;i++)r*=p(w[i],w[i+1]);return r}
  function draw(){var W=fit(c,230),ctx=c.getContext('2d');ctx.clearRect(0,0,W,230);var it=VOC.map(function(w){return {l:w==='</s>'?'(문장 끝)':w,v:p(cur,w)}}).filter(function(t){return t.v>0}).sort(function(a,b){return b.v-a.v}).slice(0,6);it.forEach(function(t,i){t.c=i?COL.s:COL.g});
    txt(ctx,'"'+cur+'" 다음에 올 단어의 확률',16,20,COL.text,13,'left',true);hbars(ctx,120,32,W-200,it,30,function(v){return pct(v,1)});stamp(ctx,W,'예시 말뭉치 '+cfg.sents.length+'문장');
    var a=sp(cfg.cmp[0]),b=sp(cfg.cmp[1]);K([[esc(it[0].l),'가장 그럴듯한 다음 단어','g'],[pct(it[0].v,0),'그 확률','i'],[a.toExponential(1),'문장 A 확률: '+esc(cfg.cmp[0]),'a'],[b?b.toExponential(1):'0','문장 B 확률: '+esc(cfg.cmp[1]),'r']]);
    E('P(다음 | 지금) = (지금 → 다음이 함께 나온 횟수) ÷ (지금 단어 뒤에 무언가 나온 횟수)'+(sm?' · 평활: 분자 +1, 분모 + 어휘 수 '+VOC.length:''));
    I([[b?'a':'r',b?'평활을 켜면 처음 보는 단어 쌍도 아주 작은 확률을 받아요. 그래도 순서가 어색한 문장 B는 A보다 훨씬 낮습니다.':'문장 B에는 말뭉치에 한 번도 없던 단어 쌍이 있어 확률이 0이 돼요. 통계 기반 언어 모델의 "희소성 문제"입니다.'],['a','언어 모델은 "단어 순서에 확률을 매기는 모델"이에요. GPT도 같은 질문(다음 단어는?)을 훨씬 긴 문맥으로 풉니다(9회차).']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* ---------- 3회차 ---------- */
SIMS.tokenize=function(el,cfg){var box=h('div',{class:'tw'}),row=ctrlRow(el),row2=ctrlRow(el),K=kpis(el,4),I=insight(el),si=0,md='sp';el.insertBefore(box,row);
  buttons(row,'문장',cfg.sents.map(function(s,i){return [i,s.label]}),0,function(v){si=v;draw()});
  buttons(row2,'자르는 방법',[['sp','띄어쓰기(공백) 기준'],['an','분석기 기준(교안 결과)']],'sp',function(v){md=v;draw()});
  function draw(){var S=cfg.sents[si],T=md==='sp'?S.text.split(' ').map(function(w){return [w,'m']}):S.an,hit=T.filter(function(t){return t[0]===S.q}).length,fn=T.filter(function(t){return t[1]==='f'}).length;
    box.innerHTML='<p class="muted" style="margin:0 0 6px">원문: <b>'+esc(S.text)+'</b></p>'+chips(T.map(function(t){return {w:t[0],k:t[1]==='f'?'f':t[1]==='p'?'s':'m'}}))+'<p class="muted" style="font-size:13px;margin:8px 0 0">회색 = 조사·어미·축약 조각 · 주황 = 문장부호</p>';
    K([[T.length+'개','토큰 수','i'],[hit?'찾음 ('+hit+')':'못 찾음','"'+esc(S.q)+'" 검색 일치',hit?'g':'r'],[fn+'개','기능 조각(조사·어미 등)','m'],[S.lang,'언어','a']]);
    I([[hit?'g':'r',hit?'분석기로 자르니 "'+esc(S.q)+'"가 독립된 토큰이 되어 검색에 걸려요.':'공백으로만 자르면 "'+esc(S.q)+'"가 조사·어미나 문장부호와 붙어 있어 검색에서 놓쳐요.'],['a',S.note]])}
  draw()};

SIMS.stopneg=function(el,cfg){var box=h('div',{class:'tw'}),row=ctrlRow(el),row2=ctrlRow(el),K=kpis(el,4),I=insight(el),si=0,st=false,ng=false;el.insertBefore(box,row);
  buttons(row,'문장',cfg.sents.map(function(s,i){return [i,s.label]}),0,function(v){si=v;draw()});
  var g=h('div',{class:'group'});g.appendChild(h('span',{class:'glabel'},'불용어 목록'));[['st','기본 불용어 제거'],['ng','부정어(안·않·못·not)도 불용어로 취급']].forEach(function(o){var b=h('button',{class:'bt',type:'button','aria-pressed':'false'},o[1]);b.addEventListener('click',function(){if(o[0]==='st')st=!st;else ng=!ng;b.setAttribute('aria-pressed',String(o[0]==='st'?st:ng));draw()});g.appendChild(b)});row2.appendChild(g);
  function draw(){var S=cfg.sents[si],T=S.t.map(function(t){var off=(st&&t[1]==='stop')||(st&&ng&&t[1]==='neg');return {w:t[0],k:off?'off':t[1]==='neg'?'s':t[1]==='stop'?'f':'m',r:t[1],v:t[2]||0,d:t[3]||'p'}}),keep=T.filter(function(t){return t.k!=='off'}),s=0,last=0;
    var pend=false;keep.forEach(function(t){if(t.r==='neg'){if(t.d==='n')pend=true;else{s-=2*last;last=0}}else if(t.v){var v=pend?-t.v:t.v;pend=false;s+=v;last=v}});var pr=s>0?'긍정':s<0?'부정':'중립',ok=pr===S.y;
    box.innerHTML='<p class="muted" style="margin:0 0 6px">원문: <b>'+esc(S.text)+'</b> · 원래 뜻: <b>'+S.y+'</b></p>'+chips(T)+'<p class="muted" style="font-size:13px;margin:8px 0 0">회색 = 불용어 후보 · 주황 = 부정어 · 취소선 = 지금 제거됨</p>';
    K([[keep.length+' / '+T.length,'남은 토큰','i'],[pct(1-keep.length/T.length,0),'줄어든 양','a'],[pr,'단순 감성 판정',ok?'g':'r'],[ok?'일치':'뒤집힘','원래 뜻과 비교',ok?'g':'r']]);
    I([[ok?'g':'r',ok?'불용어를 빼도 뜻이 그대로예요. 분석할 양만 줄었습니다.':'부정어까지 지우니 뜻이 반대가 되었어요. NLTK 영어 기본 불용어 목록에도 not, no가 들어 있으니 그대로 쓰면 안 돼요.'],['a','감성 판정은 이 실험이 정한 작은 사전(좋·만족·빠르·happy +1)과 "부정어가 꾸미는 말의 점수 뒤집기"(않은 앞말, 안·not은 뒷말) 규칙으로 계산한 설명용 값이에요.']])}
  draw()};

SIMS.userdict=function(el,cfg){var box=h('div',{class:'tw'}),row=ctrlRow(el),K=kpis(el,3),I=insight(el),on={};el.insertBefore(box,row);
  var g=h('div',{class:'group'});g.appendChild(h('span',{class:'glabel'},'사용자 사전에 올리기'));cfg.dict.forEach(function(d){on[d.w]=false;var b=h('button',{class:'bt',type:'button','aria-pressed':'false'},d.w);b.addEventListener('click',function(){on[d.w]=!on[d.w];b.setAttribute('aria-pressed',String(on[d.w]));draw()});g.appendChild(b)});row.appendChild(g);
  function draw(){var T=[];cfg.tokens.forEach(function(t){if(typeof t==='string'){T.push({w:t,k:'m'});return}if(on[t.w])T.push({w:t.w,k:'m',t:'사용자 사전'});else t.split.forEach(function(p){T.push({w:p,k:'s',t:'미등록어를 잘못 자름'})})});
    var broken=cfg.dict.filter(function(d){return !on[d.w]}).length,good=T.filter(function(t){return t.k==='m'&&cfg.gold.indexOf(t.w)>=0}).length;
    box.innerHTML='<p class="muted" style="margin:0 0 6px">원문: <b>'+esc(cfg.text)+'</b></p>'+chips(T)+'<p class="muted" style="font-size:13px;margin:8px 0 0">주황 = 사전에 없어 잘못 잘린 조각(예시)</p>';
    K([[broken+'개','아직 잘리는 신조어','r'],[good+' / '+cfg.gold.length,'올바르게 뽑힌 명사','g'],[T.length+'개','토큰 수','i']]);
    I([[broken?'a':'g',broken?'신조어를 사용자 사전에 올리면 한 덩어리로 인식돼요. 버튼을 눌러 보세요.':'모든 신조어가 한 덩어리가 되었어요. 미등록어를 모아 사전을 주기적으로 고치는 것이 실무의 일상입니다.'],['a','"잘못 잘린 모양"은 사전이 없을 때 생기는 전형적인 모양을 보여 주는 예시이며, 분석기마다 실제 결과는 다릅니다.']])}
  draw()};

/* ---------- 4회차 ---------- */
SIMS.onehot=function(el,cfg){var H=250,c=S0(el,cfg,H,'원핫과 워드 벡터 비교'),row=ctrlRow(el),row2=ctrlRow(el),K=kpis(el,4),E=eqline(el),I=insight(el),lv=2,md='oh';
  slider(row,'어휘 수(로그 눈금)',0.5,5,0.1,2,function(v){return nf(Math.round(Math.pow(10,v)))+'개'},function(v){lv=v;draw()});
  buttons(row2,'단어 표현',[['oh','원핫 인코딩'],['wv','워드 벡터(300차원)']],'oh',function(v){md=v;draw()});
  function byt(b){return b>=1e9?(b/1e9).toFixed(1)+' GB':b>=1e6?(b/1e6).toFixed(1)+' MB':b>=1e3?(b/1e3).toFixed(1)+' KB':nf(b)+' B'}
  function draw(){var V=Math.max(3,Math.round(Math.pow(10,lv))),d=md==='oh'?V:300,W=fit(c,H),ctx=c.getContext('2d');ctx.clearRect(0,0,W,H);grid(ctx,W,H);
    var half=W/2,P=cfg.pts,names=Object.keys(P);txt(ctx,md==='oh'?'원핫: 모든 단어가 서로 직각(거리 같음)':'워드 벡터: 뜻이 가까우면 가까이',16,20,COL.text,13,'left',true);
    var cx=half/2+10,cy=H/2+16,R=Math.min(half/2-30,H/2-40);ctx.strokeStyle=COL.rule;ctx.beginPath();ctx.moveTo(cx-R,cy);ctx.lineTo(cx+R,cy);ctx.moveTo(cx,cy-R);ctx.lineTo(cx,cy+R);ctx.stroke();
    names.forEach(function(n,i){var v=md==='oh'?[[1,0],[0,1],[-0.71,-0.71]][i]:P[n],x=cx+R*v[0],y=cy-R*v[1];ctx.strokeStyle=[COL.g,COL.i,COL.r][i];ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(x,y);ctx.stroke();ctx.fillStyle=ctx.strokeStyle;ctx.beginPath();ctx.arc(x,y,4,0,7);ctx.fill();txt(ctx,n,x+(v[0]>=0?6:-6),y-6,ctx.strokeStyle,13,v[0]>=0?'left':'right',true)});
    if(md==='oh')txt(ctx,'(3차원을 평면에 그린 그림)',cx,H-8,COL.muted,10,'center');
    var mo=V*V*4,me=V*300*4,x0=half+70,w=half-100;txt(ctx,'모든 단어를 담는 데 드는 메모리',half+16,20,COL.text,13,'left',true);var it=[{l:'원핫',v:Math.log10(mo),c:md==='oh'?COL.r:'#e7b8b1'},{l:'워드 벡터',v:Math.log10(me),c:md==='wv'?COL.g:'#a9d4bd'}];hbars(ctx,x0,48,w,it,40,function(v){return byt(Math.pow(10,v))});txt(ctx,'막대 길이는 로그 눈금',x0,H-12,COL.muted,10);stamp(ctx,W,'예시 벡터');
    var cg=md==='oh'?0:cosv(P[names[0]],P[names[1]]),cc=md==='oh'?0:cosv(P[names[0]],P[names[2]]);
    K([[nf(d),'단어 하나의 벡터 길이','i'],[md==='oh'?pct((V-1)/V,V>1000?3:1):'0%','그중 0인 칸','a'],[cg.toFixed(2)+' / '+cc.toFixed(2),'코사인: '+names[0]+'–'+names[1]+' / '+names[0]+'–'+names[2],'g'],[byt(md==='oh'?mo:me),'전체 메모리(4바이트 실수)','m']]);
    E(md==='oh'?'원핫: 어휘가 <b>'+nf(V)+'</b>개면 벡터도 <b>'+nf(V)+'</b>칸, 그중 1칸만 1 → 전체 표 = '+nf(V)+' × '+nf(V)+' 칸':'워드 벡터: 어휘 <b>'+nf(V)+'</b>개 × <em>300</em>칸으로 고정 → 단어가 늘어도 칸 수(차원)는 그대로');
    I([[md==='oh'?'r':'g',md==='oh'?'원핫에서는 '+names[0]+'와 '+names[1]+'도, '+names[0]+'와 '+names[2]+'도 똑같이 무관(코사인 0)해요. 뜻의 가까움을 담지 못합니다.':'워드 벡터에서는 '+names[0]+'와 '+names[1]+'가 가깝고 '+names[2]+'는 멀어요. 숫자 몇백 개로 뜻의 관계를 담습니다.'],['a','그림의 2차원 좌표는 설명용 예시값이에요. 실제 워드 벡터는 보통 100~300차원입니다.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

SIMS.tfidf=function(el,cfg){var c=S0(el,cfg,220,'문서 안 단어의 TF-IDF 막대'),tw=h('div',{class:'tw'}),row=ctrlRow(el),row2=ctrlRow(el),K=kpis(el,4),E=eqline(el),I=insight(el),di=0,lb='10';el.insertBefore(tw,c.parentNode);
  var D=cfg.docs.map(function(d){return d.w.split(' ')}),N=D.length,df={};D.forEach(function(d){var u={};d.forEach(function(w){u[w]=1});Object.keys(u).forEach(function(w){df[w]=(df[w]||0)+1})});
  buttons(row,'문서',cfg.docs.map(function(d,i){return [i,'문서 '+(i+1)]}),0,function(v){di=v;draw()});
  buttons(row2,'로그의 밑',[['10','log₁₀ (교안 예시와 같음)'],['e','ln (scikit-learn 등 라이브러리)']],'10',function(v){lb=v;draw()});
  function lg(x){return lb==='10'?Math.log10(x):Math.log(x)}
  function draw(){var d=D[di],cnt={};d.forEach(function(w){cnt[w]=(cnt[w]||0)+1});var R=Object.keys(cnt).map(function(w){var tf=cnt[w]/d.length,idf=lg(N/df[w]);return {w:w,f:cnt[w],tf:tf,df:df[w],idf:idf,s:tf*idf}}).sort(function(a,b){return b.s-a.s});
    tw.innerHTML='<p class="muted" style="margin:0 0 6px">문서 '+(di+1)+': <b>'+esc(cfg.docs[di].x)+'</b> → 명사·형용사만 남긴 '+d.length+'개 단어</p>'+tbl(['단어','문서 안 횟수','TF','나온 문서 수 df','IDF','TF-IDF'],R.map(function(r){return {c:[esc(r.w),r.f,r.tf.toFixed(3),r.df+' / '+N,r.idf.toFixed(3),'<b>'+r.s.toFixed(3)+'</b>'],n:[0,1,1,1,1,1]}}),560);
    var W=fit(c,220),ctx=c.getContext('2d');ctx.clearRect(0,0,W,220);var it=R.slice(0,5).map(function(r,i){return {l:r.w,v:r.s,c:i?COL.s:COL.g}});txt(ctx,'TF-IDF 높은 단어',16,18,COL.text,13,'left',true);hbars(ctx,90,28,W-170,it,36,function(v){return v.toFixed(3)});stamp(ctx,W,'예시 리뷰 '+N+'개');
    var com=Object.keys(df).sort(function(a,b){return df[b]-df[a]})[0];K([[esc(R[0].w),'이 문서의 핵심 키워드','g'],[R[0].s.toFixed(3),'그 TF-IDF','i'],[esc(com)+' (df '+df[com]+')','가장 흔한 단어','a'],[lg(N/df[com]).toFixed(3),'그 단어의 IDF','r']]);
    E('TF-IDF = <b>TF</b>(문서 안 횟수 ÷ 문서 단어 수) × <em>IDF</em>(log(전체 문서 수 '+N+' ÷ 그 단어가 나온 문서 수))');
    I([['g','여러 문서에 두루 나오는 단어("'+esc(com)+'")는 IDF가 낮아 점수가 깎이고, 이 문서에만 나오는 단어가 위로 올라와요. 별도 불용어 목록 없이도 흔한 말이 뒤로 밀립니다.'],['a','로그의 밑을 바꾸면 점수의 크기는 달라지지만 단어의 순위는 그대로예요. 다만 숫자를 비교할 때는 같은 밑을 써야 합니다.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

SIMS.lda=function(el,cfg){var box=h('div',{class:'tw'}),c=S0(el,cfg,200,'토픽별 단어 수와 추정 비율'),row=ctrlRow(el),K=kpis(el,4),E=eqline(el),I=insight(el),th=.7,seed=3,L=cfg.len||40;el.insertBefore(box,c.parentNode);
  slider(row,'θ: 이 문서의 스포츠 비율',0,1,.05,.7,function(v){return pct(v,0)+' 스포츠 · '+pct(1-v,0)+' 경제'},function(v){th=v;draw()});action(row,'새 문서 쓰기(다시 뽑기)',function(){seed++;draw()},true);
  var T=cfg.topics,VW=Object.keys(T[0].phi);
  function pick(r,phi){var u=r(),a=0;for(var k in phi){a+=phi[k];if(u<=a)return k}return k}
  function draw(){var r=rng(seed*31+7),z=[],w=[];for(var i=0;i<L;i++){var t=r()<th?0:1;z.push(t);w.push(pick(r,T[t].phi))}
    var est=w.map(function(x){var a=th*(T[0].phi[x]||1e-4),b=(1-th)*(T[1].phi[x]||1e-4),a0=(T[0].phi[x]||1e-4),b0=(T[1].phi[x]||1e-4);return a0/(a0+b0)}),thh=mean(est),ns=z.filter(function(v){return v===0}).length,amb=w.filter(function(x){return (T[0].phi[x]||0)>=.05&&(T[1].phi[x]||0)>=.05}).length;
    box.innerHTML='<p class="muted" style="margin:0 0 6px">LDA가 상상하는 "글 쓰는 과정": 단어 자리마다 ① 토픽을 θ 비율로 고르고(z) ② 그 토픽의 단어 분포(φ)에서 단어를 뽑습니다(w).</p>'+chips(w.map(function(x,i){return {w:x,k:z[i]?'f2':'m',t:z[i]?'경제에서 뽑힘':'스포츠에서 뽑힘'}}))+'<p class="muted" style="font-size:13px;margin:8px 0 0">초록 = 스포츠 토픽에서 뽑힌 단어 · 파랑 = 경제 토픽에서 뽑힌 단어 (실제 분석에서는 이 색이 보이지 않아요)</p>';
    var W=fit(c,200),ctx=c.getContext('2d');ctx.clearRect(0,0,W,200);txt(ctx,'정답 비율과 "단어만 보고" 추정한 비율',16,18,COL.text,13,'left',true);hbars(ctx,150,30,W-230,[{l:'정답 θ(스포츠)',v:th,c:COL.g},{l:'뽑힌 결과(스포츠)',v:ns/L,c:COL.i},{l:'단어로 추정',v:thh,c:COL.m}],44,function(v){return pct(v,0)});stamp(ctx,W,'설명용 토픽 2개');
    K([[pct(th,0),'정답 θ(스포츠 비율)','g'],[ns+' / '+L,'스포츠에서 뽑힌 단어','i'],[pct(thh,0),'단어만 보고 추정한 비율','m'],[amb+'개','두 토픽에 다 있는 단어(연봉·구단 등)','a']]);
    E('문서 → <b>θ</b> ~ Dir(α) → 자리마다 <em>z</em> ~ θ → 단어 <i>w</i> ~ φ<sub>z</sub> · 분석은 이 과정을 거꾸로 추정');
    I([['g','LDA는 색이 없는 단어들만 보고 θ(문서의 토픽 비율)와 φ(토픽의 단어 분포)를 거꾸로 추정해요. 이 실험의 추정은 단어마다 "어느 토픽에서 왔을지"를 평균 낸 단순한 방법입니다.'],['a','"연봉·구단"처럼 두 토픽에 모두 있는 단어는 어느 쪽인지 애매해요. 실제 LDA는 문서 전체의 단어를 함께 보며 이 애매함을 반복해서 풉니다.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* ===== 대결 (1~4회차) ===== */
DUELS.rule_ml=function(){function run(n){var a=0,b=0,R=60;for(var k=0;k<R;k++){var tr=loanData(n,500+k),te=loanData(400,900+k),L=learnRule(tr);a+=ruleAcc(te,300,60);b+=ruleAcc(te,L[1],L[2])}return {fly:a/R,robo:b/R}}
  var A=run(300),B=run(12);A.label='가정 A: 지난 대출 기록이 300건 있다';B.label='가정 B: 지난 대출 기록이 12건뿐이다';
  return {cond:true,condA:A,condB:B,fly:A.fly,robo:A.robo,say:'새 신청자 400명 판정 정확도(60번 평균)는 기록 300건일 때 전문가 규칙 '+pct(A.fly,1)+', 데이터 기준 '+pct(A.robo,1)+'이고, 기록 12건일 때 전문가 규칙 '+pct(B.fly,1)+', 데이터 기준 '+pct(B.robo,1)+'예요.'}};
DUELS.prep_kw=function(cfg){function top(toks){var c={};toks.forEach(function(w){c[w]=(c[w]||0)+1});return Object.keys(c).sort(function(a,b){return c[b]-c[a]||(a<b?-1:1)}).slice(0,5)}
  var raw=[],cl=[];cfg.raw.forEach(function(r){r.split(/\s+/).forEach(function(w){if(w)raw.push(w)})});var seen={};cfg.raw.forEach(function(r){var k=r.trim();if(!k||seen[k]||/http/.test(k))return;seen[k]=1;k.replace(/<[^>]+>/g,' ').replace(/[!?.~^,]+/g,' ').replace(/(ㅋ|ㅎ){2,}/g,' ').split(/\s+/).forEach(function(w){w=w.replace(/(이|가|은|는|을|를|도|에|요)$/,function(m,p,o,s){return s.length>2?'':m});if(w&&cfg.stop.indexOf(w)<0)cl.push(w)})});
  var tr=top(raw),tc=top(cl),f=tc.filter(function(w){return cfg.gold.indexOf(w)>=0}).length,b=tr.filter(function(w){return cfg.gold.indexOf(w)>=0}).length;
  return {fly:f,robo:b,say:'상위 5개 단어 중 의미 있는 키워드는 초파리 쪽(전처리 후) '+f+'개 ['+tc.join(', ')+'], 주판봇 쪽(원본 그대로) '+b+'개 ['+tr.join(', ')+']예요.'}};
DUELS.morph_search=function(cfg){var rel=cfg.docs.filter(function(d){return d.rel}).length,f=0,b=0;cfg.docs.forEach(function(d){if(!d.rel)return;if(d.x.split(' ').indexOf(cfg.q)>=0)f++;if(d.m.indexOf(cfg.q)>=0)b++});
  return {fly:f/rel,robo:b/rel,say:'"'+cfg.q+'" 이야기를 하는 리뷰 '+rel+'개 중 찾아낸 비율(재현율)은 초파리 쪽(띄어쓰기로 자르기) '+f+'개('+pct(f/rel,0)+'), 주판봇 쪽(형태소 분석) '+b+'개('+pct(b/rel,0)+')예요.'}};
DUELS.tfidf_kw=function(cfg){var D=cfg.docs.map(function(d){return d.w.split(' ')}),N=D.length,df={};D.forEach(function(d){var u={};d.forEach(function(w){u[w]=1});Object.keys(u).forEach(function(w){df[w]=(df[w]||0)+1})});var f=0,b=0,lf=[],lb=[];
  D.forEach(function(d,i){var c={};d.forEach(function(w){c[w]=(c[w]||0)+1});var ks=Object.keys(c),rawTop=ks.sort(function(a,b){return c[b]-c[a]||(a<b?-1:1)})[0],tTop=ks.slice().sort(function(a,b){return c[b]*Math.log(N/df[b])-c[a]*Math.log(N/df[a])||(a<b?-1:1)})[0];if(tTop===cfg.docs[i].k)f++;if(rawTop===cfg.docs[i].k)b++;lf.push(tTop);lb.push(rawTop)});
  return {fly:f/N,robo:b/N,say:'리뷰 '+N+'개의 핵심어를 맞힌 비율은 초파리 쪽(TF-IDF 1위) '+f+'개 ['+lf.join(', ')+'], 주판봇 쪽(가장 많이 나온 단어) '+b+'개 ['+lb.join(', ')+']예요.'}};
