/* ===== 자연어 분석 연구실 실험 모듈 B (6~9회차) · 시드 고정 · 설명용 모형 ===== */

/* ---------- 6회차 ---------- */
function ctxVecs(sents,win){var S=sents.map(function(s){return s.split(' ')}),V={};S.forEach(function(s){s.forEach(function(w){V[w]=1})});var voc=Object.keys(V),ix={};voc.forEach(function(w,i){ix[w]=i});var M={};voc.forEach(function(w){M[w]=new Array(voc.length).fill(0)});
  S.forEach(function(s){s.forEach(function(w,i){for(var j=Math.max(0,i-win);j<=Math.min(s.length-1,i+win);j++)if(j!==i)M[w][ix[s[j]]]++})});return {voc:voc,M:M}}
SIMS.context=function(el,cfg){var c=S0(el,cfg,230,'고른 단어와 문맥이 비슷한 단어'),tw=h('div',{class:'tw'}),row=ctrlRow(el),row2=ctrlRow(el),K=kpis(el,3),E=eqline(el),I=insight(el),cur=cfg.picks[0],win=1;el.insertBefore(tw,c.parentNode);
  buttons(row,'단어',cfg.picks.map(function(w){return [w,w]}),cur,function(v){cur=v;draw()});
  slider(row2,'문맥 창(앞뒤 몇 단어까지)',1,2,1,1,function(v){return '앞뒤 '+v+'단어'},function(v){win=v;draw()});
  function draw(){var C=ctxVecs(cfg.sents,win),v=C.M[cur],ctxw=C.voc.filter(function(w,i){return v[i]>0}),R=C.voc.filter(function(w){return w!==cur&&cfg.content.indexOf(w)>=0}).map(function(w){return {l:w,v:cosv(v,C.M[w])}}).sort(function(a,b){return b.v-a.v}).slice(0,5);R.forEach(function(t,i){t.c=i?COL.s:COL.g});
    tw.innerHTML='<p class="muted" style="margin:0 0 6px">예시 문장 '+cfg.sents.length+'개 · "'+esc(cur)+'" 주변에 나온 단어(문맥)</p>'+chips(ctxw.map(function(w){return {w:w,k:'m',s:v[C.voc.indexOf(w)]}}));
    var W=fit(c,230),ctx=c.getContext('2d');ctx.clearRect(0,0,W,230);txt(ctx,'"'+cur+'"와 문맥이 비슷한 단어(코사인 유사도)',16,18,COL.text,13,'left',true);hbars(ctx,110,30,W-180,R,38,function(x){return x.toFixed(2)});stamp(ctx,W,'예시 문장 '+cfg.sents.length+'개');
    K([[esc(R[0].l),'가장 가까운 단어','g'],[R[0].v.toFixed(2),'그 코사인 유사도','i'],[ctxw.length+'개','문맥 단어 종류','a']]);
    E('단어 벡터 = 주변 단어가 몇 번 나왔는지 센 칸들 → 두 단어 벡터의 <b>코사인 유사도</b>가 높으면 "비슷한 문맥 = 비슷한 뜻"');
    I([['g','"강아지"와 "고양이"처럼 같은 자리에 들어가는 단어는 문맥 칸이 비슷해져 가까워져요. 분포 가설 그대로입니다.'],['a','이 실험은 주변 단어를 직접 세는 방식이에요. Word2Vec은 세는 대신 "주변 단어 맞히기"를 학습하며 100~300칸의 촘촘한 벡터를 얻습니다.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

SIMS.analogy=function(el,cfg){var H=300,c=S0(el,cfg,H,'단어 벡터 덧셈·뺄셈 그림'),row=ctrlRow(el),K=kpis(el,3),E=eqline(el),I=insight(el),pi=0;
  buttons(row,'연산',cfg.sets.map(function(s,i){return [i,s.q.join(' − ').replace(/ − ([^−]+)$/,' + $1')]}),0,function(v){pi=v;draw()});
  function draw(){var S=cfg.sets[pi],P=S.pts,a=P[S.q[0]],b=P[S.q[1]],cc=P[S.q[2]],r=[a[0]-b[0]+cc[0],a[1]-b[1]+cc[1]],cand=Object.keys(P).filter(function(w){return S.q.indexOf(w)<0}).map(function(w){var d=Math.hypot(P[w][0]-r[0],P[w][1]-r[1]);return {w:w,d:d}}).sort(function(x,y){return x.d-y.d});
    var W=fit(c,H),ctx=c.getContext('2d');ctx.clearRect(0,0,W,H);grid(ctx,W,H);var xs=Object.keys(P).map(function(k){return P[k][0]}).concat([r[0]]),ys=Object.keys(P).map(function(k){return P[k][1]}).concat([r[1]]),lx=Math.min.apply(null,xs)-1,hx=Math.max.apply(null,xs)+1,ly=Math.min.apply(null,ys)-1,hy=Math.max.apply(null,ys)+1,X=function(v){return 30+(W-60)*(v-lx)/(hx-lx)},Y=function(v){return H-24-(H-50)*(v-ly)/(hy-ly)};
    function arrow(p,q,col){ctx.strokeStyle=col;ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(X(p[0]),Y(p[1]));ctx.lineTo(X(q[0]),Y(q[1]));ctx.stroke();var ang=Math.atan2(Y(q[1])-Y(p[1]),X(q[0])-X(p[0]));ctx.beginPath();ctx.moveTo(X(q[0]),Y(q[1]));ctx.lineTo(X(q[0])-9*Math.cos(ang-.4),Y(q[1])-9*Math.sin(ang-.4));ctx.lineTo(X(q[0])-9*Math.cos(ang+.4),Y(q[1])-9*Math.sin(ang+.4));ctx.closePath();ctx.fillStyle=col;ctx.fill()}
    arrow(b,a,COL.m);arrow(cc,r,COL.m);Object.keys(P).forEach(function(w){var on=S.q.indexOf(w)>=0,best=w===cand[0].w;ctx.fillStyle=best?COL.g:on?COL.i:COL.muted;ctx.beginPath();ctx.arc(X(P[w][0]),Y(P[w][1]),best?7:5,0,7);ctx.fill();txt(ctx,w,X(P[w][0])+9,Y(P[w][1])-7,ctx.fillStyle,13,'left',on||best)});
    ctx.strokeStyle=COL.a;ctx.lineWidth=2;ctx.beginPath();ctx.arc(X(r[0]),Y(r[1]),10,0,7);ctx.stroke();txt(ctx,'계산 결과',X(r[0])+12,Y(r[1])+18,COL.a,11,'left',true);txt(ctx,'보라 화살표 두 개는 같은 "방향"(관계)이에요',16,18,COL.m,12,'left',true);stamp(ctx,W,'설명용 2차원 좌표');
    K([[esc(cand[0].w),'계산 결과와 가장 가까운 단어',S.bias?'r':'g'],[cand[0].d.toFixed(2),'거리',''],[esc(cand[1].w),'두 번째 후보','a']]);
    E('vec('+S.q[0]+') − vec('+S.q[1]+') + vec('+S.q[2]+') = (<b>'+r[0].toFixed(1)+'</b>, <em>'+r[1].toFixed(1)+'</em>) → 가장 가까운 단어 <i>'+esc(cand[0].w)+'</i>');
    I([[S.bias?'r':'g',S.note],['a','실제 벡터는 300차원이고, 그림처럼 2차원에 놓으려면 PCA·t-SNE 같은 차원 축소가 필요해요. 이 좌표는 관계를 보여 주려고 만든 예시값입니다.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

SIMS.simmeasure=function(el,cfg){var H=240,c=S0(el,cfg,H,'두 단어 벡터와 세 가지 유사도'),row=ctrlRow(el),K=kpis(el,4),E=eqline(el),I=insight(el),ang=25,len=1;
  slider(row,'두 벡터 사이 각도',0,180,5,25,function(v){return v+'°'},function(v){ang=v;draw()});slider(row,'B의 길이(자주 쓰는 단어일수록 길어지는 경향)',.5,4,.1,1,function(v){return '×'+v.toFixed(1)},function(v){len=v;draw()});
  function draw(){var a=[1.6,0],t=ang*Math.PI/180,b=[1.6*len*Math.cos(t),1.6*len*Math.sin(t)],eu=Math.hypot(a[0]-b[0],a[1]-b[1]),mh=Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1]),cs=cosv(a,b);
    var W=fit(c,H),ctx=c.getContext('2d');ctx.clearRect(0,0,W,H);grid(ctx,W,H);var cx=W/2-40,cy=H-40,sc=Math.min(50,(H-60)/6.6);ctx.strokeStyle=COL.rule;ctx.beginPath();ctx.moveTo(cx-sc*7,cy);ctx.lineTo(cx+sc*7,cy);ctx.stroke();
    [[a,COL.i,'A (기준 단어)'],[b,COL.robo,'B']].forEach(function(o){var x=cx+sc*o[0][0],y=cy-sc*o[0][1];ctx.strokeStyle=o[1];ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(x,y);ctx.stroke();ctx.fillStyle=o[1];ctx.beginPath();ctx.arc(x,y,4,0,7);ctx.fill();txt(ctx,o[2],x+6,y-6,o[1],12,'left',true)});
    ctx.setLineDash([4,3]);ctx.strokeStyle=COL.r;ctx.beginPath();ctx.moveTo(cx+sc*a[0],cy-sc*a[1]);ctx.lineTo(cx+sc*b[0],cy-sc*b[1]);ctx.stroke();ctx.setLineDash([]);ctx.strokeStyle=COL.a;ctx.beginPath();ctx.arc(cx,cy,26,-t,0);ctx.stroke();txt(ctx,'θ',cx+30,cy-8,COL.a,12,'left',true);stamp(ctx,W,'설명용 2차원');
    K([[cs.toFixed(2),'코사인 유사도(방향만)','g'],[eu.toFixed(2),'유클리드 거리(빨간 점선)','r'],[mh.toFixed(2),'맨해튼 거리','a'],[cs>=.7?'높은 유사도':cs>=.3?'중간':'낮음','교안 기준(0.7 이상 높음)',cs>=.7?'g':'a']]);
    E('cos θ = A·B ÷ (|A| × |B|) = <b>'+cs.toFixed(2)+'</b> · 유클리드 = √(Σ(a−b)²) = <em>'+eu.toFixed(2)+'</em>');
    I([['g','B의 길이를 바꿔 보세요. 코사인은 그대로인데 두 거리는 크게 변해요. 자주 쓰여 길어진 단어 벡터도 방향(뜻)만 보고 비교할 수 있어 단어 비교에 코사인을 많이 씁니다.'],['a','교안의 "0.7 이상이면 높은 유사도"는 경험적인 눈금이에요. 모델과 데이터마다 적당한 기준은 다를 수 있습니다.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* ---------- 7회차 ---------- */
SIMS.confusion=function(el,cfg){var H=230,c=S0(el,cfg,H,'스팸 점수 분포와 기준선'),tw=h('div',{class:'tw'}),row=ctrlRow(el),K=kpis(el,4),E=eqline(el),I=insight(el),rate=.1,th=.5;el.insertBefore(tw,row);
  slider(row,'스팸 비율',.02,.5,.01,.1,function(v){return pct(v,0)},function(v){rate=v;draw()});slider(row,'스팸 판정 기준(점수 이상이면 스팸)',.05,.95,.05,.5,function(v){return v.toFixed(2)},function(v){th=v;draw()});
  function data(){var r=rng(23),d=[];for(var i=0;i<2000;i++){var sp=r()<rate,s=clamp(sp?.68+.16*gauss(r):.32+.16*gauss(r),0,1);d.push([sp,s])}return d}
  function draw(){var d=data(),tp=0,fp=0,fn=0,tn=0;d.forEach(function(x){var p=x[1]>=th;if(p&&x[0])tp++;else if(p)fp++;else if(x[0])fn++;else tn++});var acc=(tp+tn)/d.length,pr=tp/Math.max(1,tp+fp),rc=tp/Math.max(1,tp+fn),f1=pr+rc?2*pr*rc/(pr+rc):0,lazy=(fp+tn)/d.length;
    var W=fit(c,H),ctx=c.getContext('2d');ctx.clearRect(0,0,W,H);grid(ctx,W,H);var x0=40,y0=H-30,w=W-60,hh=H-70;var hs=hist(ctx,x0,y0,w,hh,d.filter(function(x){return !x[0]}).map(function(x){return x[1]}),25,0,1,'rgba(37,99,201,.35)'),mx=Math.max.apply(null,hs);hist(ctx,x0,y0,w,hh,d.filter(function(x){return x[0]}).map(function(x){return x[1]}),25,0,1,'rgba(210,63,44,.55)',mx);
    ctx.strokeStyle=COL.text;ctx.lineWidth=2;ctx.setLineDash([5,4]);ctx.beginPath();ctx.moveTo(x0+w*th,y0-hh-6);ctx.lineTo(x0+w*th,y0);ctx.stroke();ctx.setLineDash([]);[0,.25,.5,.75,1].forEach(function(v){txt(ctx,v.toFixed(2),x0+w*v,y0+15,COL.muted,10,'center')});txt(ctx,'■ 정상 메일',x0,18,COL.i,12,'left',true);txt(ctx,'■ 스팸',x0+90,18,COL.r,12,'left',true);txt(ctx,'기준 '+th.toFixed(2)+' →',x0+w*th+4,y0-hh+4,COL.text,11);stamp(ctx,W,'메일 2,000통 · 시드 고정');
    tw.innerHTML=tbl(['','스팸이라고 판정','정상이라고 판정'],[{c:['<b>실제 스팸</b>','<b class="g">'+tp+'</b> (맞게 잡음)','<b class="r">'+fn+'</b> (놓침)'],n:[0,1,1]},{c:['<b>실제 정상</b>','<b class="r">'+fp+'</b> (잘못 막음)','<b class="g">'+tn+'</b> (맞게 통과)'],n:[0,1,1]}],420);
    K([[pct(acc,1),'정확도','i'],[pct(pr,1),'정밀도(스팸이라 한 것 중 진짜)','m'],[pct(rc,1),'재현율(진짜 스팸 중 잡은 것)','a'],[pct(f1,1),'F1 점수','g']]);
    E('정밀도 = '+tp+' ÷ ('+tp+' + '+fp+') · 재현율 = '+tp+' ÷ ('+tp+' + '+fn+') · F1 = 2 × 정밀도 × 재현율 ÷ (정밀도 + 재현율)');
    I([['r','"전부 정상"이라고 답하는 게으른 모델도 정확도가 '+pct(lazy,1)+'예요. 스팸이 드물수록(불균형) 정확도만 보면 속기 쉬워서 F1을 함께 봅니다.'],['a','기준을 낮추면 스팸을 더 잡지만(재현율↑) 정상 메일도 더 막아요(정밀도↓). 어느 쪽 실수가 더 비싼지가 기준을 정합니다.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

SIMS.memory=function(el,cfg){var H=240,c=S0(el,cfg,H,'첫 단어 정보가 남는 양'),row=ctrlRow(el),row2=ctrlRow(el),K=kpis(el,4),E=eqline(el),I=insight(el),n=20,w=.8,f=.97;
  slider(row,'문장 길이(단어 수)',5,50,1,20,function(v){return v+'단어'},function(v){n=v;draw()});slider(row2,'RNN이 한 걸음마다 남기는 비율 w',.5,.95,.01,.8,function(v){return v.toFixed(2)},function(v){w=v;draw()});slider(row2,'LSTM 망각 게이트 f(1에 가까울수록 기억)',.8,.995,.005,.97,function(v){return v.toFixed(3)},function(v){f=v;draw()});
  function draw(){var W=fit(c,H),ctx=c.getContext('2d');ctx.clearRect(0,0,W,H);grid(ctx,W,H);var x0=46,y0=H-30,ww=W-70,hh=H-70;axes(ctx,x0,y0,ww,hh,0,1,function(v){return pct(v,0)});
    [[w,COL.fly,'RNN'],[f,COL.robo,'LSTM 셀 상태']].forEach(function(s,si){ctx.strokeStyle=s[1];ctx.lineWidth=2.6;ctx.beginPath();for(var t=0;t<=n;t++){var x=x0+ww*t/n,y=y0-hh*Math.pow(s[0],t);t?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke();txt(ctx,'● '+s[2],x0+10+si*90,18,s[1],12,'left',true)});
    ctx.fillStyle='rgba(210,63,44,.08)';ctx.fillRect(x0,y0-hh*.05,ww,hh*.05);txt(ctx,'5% 아래 = 사실상 잊음',x0+ww-4,y0-hh*.05-4,COL.r,10,'right');for(var t=0;t<=n;t+=Math.max(1,Math.round(n/10)))txt(ctx,t,x0+ww*t/n,y0+15,COL.muted,10,'center');stamp(ctx,W,'단순화한 기억 모형');
    var rr=Math.pow(w,n),lr=Math.pow(f,n),k5=Math.ceil(Math.log(.05)/Math.log(w));K([[pct(rr,rr<.01?2:1),'RNN: '+n+'단어 뒤 첫 단어 정보','r'],[pct(lr,1),'LSTM: '+n+'단어 뒤','g'],[k5+'단어','RNN이 5% 아래로 잊기까지','a'],[n+'걸음','순서대로 처리해야 하는 걸음','i']]);
    E('RNN: h<sub>t</sub> = tanh(W<sub>h</sub>·h<sub>t−1</sub> + W<sub>x</sub>·x<sub>t</sub> + b) → 첫 정보 ≈ <b>w<sup>t</sup></b> = '+w.toFixed(2)+'<sup>'+n+'</sup> · LSTM: C<sub>t</sub> = f·C<sub>t−1</sub> + i·C̃ → ≈ <em>f<sup>t</sup></em>');
    I([[rr<.05?'r':'a','RNN은 걸음마다 정보를 조금씩 잃어 긴 문장의 앞부분을 잊어요. 학습할 때 거꾸로 전해지는 신호(기울기)도 같은 이유로 약해지는데, 이것이 기울기 소실입니다.'],['g','LSTM은 셀 상태라는 "고속도로"에 곱셈 대신 덧셈으로 정보를 실어 나르고, 망각 게이트가 1에 가까우면 오래 기억해요. 단, 이 그림은 원리를 보이려고 단순화한 모형입니다.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

SIMS.bottleneck=function(el,cfg){var box=h('div',{class:'tw'}),row=ctrlRow(el),row2=ctrlRow(el),K=kpis(el,3),I=insight(el),si=1,cap=6;el.insertBefore(box,row);
  buttons(row,'문장',cfg.sents.map(function(s,i){return [i,s.label]}),1,function(v){si=v;draw()});slider(row2,'고정 벡터가 담을 수 있는 양(단어 수로 환산)',2,16,1,6,function(v){return v+'단어어치'},function(v){cap=v;draw()});
  function draw(){var S=cfg.sents[si].w,n=S.length,keep=S.map(function(w,i){return i>=n-cap||i===0&&cap>=n});var T=S.map(function(w,i){return {w:w,k:keep[i]?'m':'off'}});
    box.innerHTML='<p class="muted" style="margin:0 0 6px">인코더가 읽은 문장 → <b>고정 크기 벡터 하나</b>로 압축 → 디코더가 풀어서 번역</p>'+chips(T)+'<p style="margin:10px 0 0"><b>디코더가 번역에 쓸 수 있는 정보:</b> '+S.filter(function(w,i){return keep[i]}).map(esc).join(' ')+'</p><p class="muted" style="font-size:13px;margin:6px 0 0">취소선 = 압축하다 흐려진 단어(이 모형에서는 앞부분부터 흐려진다고 단순화)</p>';
    var kept=keep.filter(Boolean).length;K([[kept+' / '+n,'번역에 남은 단어','i'],[pct(kept/n,0),'보존 비율',kept/n>.8?'g':'r'],[S.filter(function(w,i){return !keep[i]}).slice(0,3).map(esc).join(' · ')||'없음','잃은 앞부분','a']]);
    I([[kept<n?'r':'g',kept<n?'문장이 벡터 하나에 담을 양보다 길면 앞부분("어제", "친구와 함께")부터 흐려져요. 교안이 말한 정보 병목입니다.':'짧은 문장은 벡터 하나에 다 담겨요. 문제는 긴 문장이에요.'],['a','벡터를 키우면 조금 나아지지만 계산량이 크게 늘어요. 근본 해결은 디코더가 원문 전체를 다시 들여다보는 어텐션(8회차)입니다.']])}
  draw()};

/* ---------- 8회차 ---------- */
SIMS.beam=function(el,cfg){var box=h('div',{class:'tw'}),row=ctrlRow(el),K=kpis(el,3),E=eqline(el),I=insight(el),B=1;el.insertBefore(box,row);
  slider(row,'빔 너비(단계마다 남기는 후보 수)',1,3,1,1,function(v){return v===1?'1 (탐욕적 = 매번 1등만)':v+'개'},function(v){B=v;draw()});
  function kids(path){var k=path.join('|');return cfg.tree[k]||[]}
  function run(){var beams=[{p:[],s:1}],log=[],evals=0;for(var step=0;step<cfg.depth;step++){var cand=[];beams.forEach(function(b){kids(b.p).forEach(function(o){evals++;cand.push({p:b.p.concat([o[0]]),s:b.s*o[1]})})});cand.sort(function(a,b){return b.s-a.s});log.push(cand.map(function(c,i){return {c:c,keep:i<B}}));beams=cand.slice(0,B)}return {best:beams[0],log:log,evals:evals}}
  function draw(){var R=run(),all=[];(function walk(p,s){var ks=kids(p);if(!ks.length){all.push({p:p,s:s});return}ks.forEach(function(o){walk(p.concat([o[0]]),s*o[1])})})([],1);all.sort(function(a,b){return b.s-a.s});
    box.innerHTML=R.log.map(function(L,i){return '<p style="margin:8px 0 4px"><b>'+(i+1)+'번째 단어 고르기</b></p>'+chips(L.map(function(o){return {w:o.c.p.join(' '),k:o.keep?'m':'off',s:o.c.s.toFixed(3)}}))}).join('')+'<p class="muted" style="font-size:13px;margin:8px 0 0">작은 숫자 = 지금까지 곱한 확률 · 취소선 = 이 단계에서 버린 후보</p>';
    K([[esc(R.best.p.join(' ')),'고른 번역',R.best.s>=all[0].s-1e-9?'g':'r'],[R.best.s.toFixed(3),'문장 전체 확률(곱)','i'],[R.evals+'번','계산한 후보 수','a']]);
    E('문장 확률 = P(1번째 단어) × P(2번째 | 1번째) × P(3번째 | 앞 두 단어) → 최고 경로 <b>'+esc(all[0].p.join(' '))+'</b> = '+all[0].s.toFixed(3));
    I([[R.best.s>=all[0].s-1e-9?'g':'r',R.best.s>=all[0].s-1e-9?'후보를 여러 개 남겨 두니 처음엔 2등이던 경로가 최종 1등이 되었어요.':'매번 그 순간 1등만 고르면(탐욕적), 처음 단어는 좋았지만 문장 전체로는 손해인 길을 가요.'],['a','빔 너비를 키울수록 계산이 늘어요. 실제 번역기는 보통 몇 개~열 개 정도를 남깁니다. 확률표는 설명용 예시값입니다.']])}
  draw()};

SIMS.attn=function(el,cfg){var H=300,c=S0(el,cfg,H,'어텐션 가중치 히트맵'),row=ctrlRow(el),row2=ctrlRow(el),K=kpis(el,3),E=eqline(el),I=insight(el),ti=0,T=1;
  buttons(row,'지금 만들고 있는 번역 단어(Query)',cfg.tgt.map(function(w,i){return [i,w]}),0,function(v){ti=v;draw()});slider(row2,'점수 나누기(스케일, 클수록 고르게)',.3,3,.1,1,function(v){return '÷ '+v.toFixed(1)},function(v){T=v;draw()});
  function draw(){var S=cfg.src,M=cfg.score.map(function(r){return softmax(r,T)}),wv=M[ti],W=fit(c,H),ctx=c.getContext('2d');ctx.clearRect(0,0,W,H);var x0=86,y0=74,cw=(W-x0-14)/S.length,ch=Math.min(24,(H-y0-10)/cfg.tgt.length);
    S.forEach(function(w,j){ctx.save();ctx.translate(x0+cw*(j+.5),y0-8);ctx.rotate(-Math.PI/4);txt(ctx,w,0,0,COL.muted,11,'left');ctx.restore()});
    M.forEach(function(r,i){txt(ctx,cfg.tgt[i],x0-8,y0+ch*(i+.68),i===ti?COL.text:COL.muted,12,'right',i===ti);r.forEach(function(v,j){ctx.fillStyle='rgba(168,50,159,'+(0.05+0.9*v)+')';ctx.fillRect(x0+cw*j+1,y0+ch*i+1,cw-2,ch-2)})});ctx.strokeStyle=COL.a;ctx.lineWidth=2;ctx.strokeRect(x0,y0+ch*ti,cw*S.length,ch);stamp(ctx,W,'예시 점수');
    var o=wv.map(function(v,j){return [v,j]}).sort(function(a,b){return b[0]-a[0]});K([[esc(S[o[0][1]]),'"'+esc(cfg.tgt[ti])+'"이(가) 가장 주목한 원문 단어','g'],[pct(o[0][0],0),'그 가중치','i'],[pct(o[0][0]+o[1][0],0),'상위 2단어 가중치 합','a']]);
    E('가중치 α = softmax(Q·K ÷ 스케일) · 문맥 벡터 c = Σ α × V → 원문 단어 '+S.length+'개의 가중치 합은 늘 100%');
    I([['g','번역 단어마다 다른 원문 단어에 주목해요. 디코더가 원문 전체를 다시 볼 수 있으니 긴 문장에서도 "열심히"·"토론" 같은 앞부분 정보를 잃지 않습니다.'],['a','스케일을 키우면 가중치가 고르게 퍼지고, 줄이면 한 단어에 몰려요. 트랜스포머는 점수를 √d(벡터 차원의 제곱근)로 나눠 지나치게 한쪽으로 쏠리는 것을 막습니다. 점수는 설명용 예시값이에요.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

SIMS.selfattn=function(el,cfg){var box=h('div',{class:'tw'}),c=S0(el,cfg,200,'"밤"이 주목한 단어'),row=ctrlRow(el),K=kpis(el,4),E=eqline(el),I=insight(el),ci=0;el.insertBefore(box,c.parentNode);
  buttons(row,'앞 문장(문맥)',cfg.ctx.map(function(x,i){return [i,x.label]}),0,function(v){ci=v;draw()});
  function draw(){var C=cfg.ctx[ci],words=C.w.concat(cfg.base),sc=C.s.concat(cfg.bs),wt=softmax(sc,1),night=0;words.forEach(function(w,i){night+=wt[i]*(cfg.vote[w]!=null?cfg.vote[w]:.5)});
    box.innerHTML='<p class="muted" style="margin:0 0 6px">문장: <b>'+esc(C.text?C.text+' ':'')+esc(cfg.sent)+'</b> — "밤"이 Query가 되어 문장 안 모든 단어(Key)를 봅니다(셀프 어텐션)</p>'+chips(words.map(function(w,i){return {w:w,k:w==='밤'?'s':'m',s:pct(wt[i],0)}}));
    var W=fit(c,200),ctx=c.getContext('2d');ctx.clearRect(0,0,W,200);txt(ctx,'"밤"의 뜻 판정(주목한 단어들의 표를 가중 평균)',16,18,COL.text,13,'left',true);hbars(ctx,130,30,W-200,[{l:'밤(night)',v:night,c:COL.i},{l:'밤(chestnut)',v:1-night,c:COL.a}],50,function(v){return pct(v,0)});stamp(ctx,W,'설명용 점수');
    var o=wt.map(function(v,j){return [v,j]}).filter(function(x){return words[x[1]]!=='밤'}).sort(function(a,b){return b[0]-a[0]});K([[night>.5?'night(낮과 밤)':'chestnut(먹는 밤)','판정',night>.5?'i':'a'],[pct(Math.max(night,1-night),0),'그 확신',''],[esc(words[o[0][1]]),'가장 주목한 단어','g'],[words.length+'개 → 1단계','RNN은 '+words.length+'걸음, 셀프 어텐션은 한 번에','m']]);
    E('셀프 어텐션: 문장의 모든 단어가 서로 Q·K로 점수를 매김 → 단어 '+words.length+'개면 점수 '+words.length+' × '+words.length+' = '+words.length*words.length+'칸을 한꺼번에(병렬로) 계산');
    I([[C.text?'g':'a',C.text?'앞 문장의 단서에 주목해 "밤"의 뜻을 정했어요. 같은 단어도 문맥에 따라 다른 벡터를 갖게 하는 것이 트랜스포머 이후 모델(BERT·GPT)의 힘입니다.':'문맥이 없으면 "밤"은 반반이에요. 앞 문장을 골라 보세요.'],['a','셀프 어텐션만으로는 단어 순서를 몰라서 위치 정보(포지셔널 인코딩)를 더해 줍니다. 점수와 표는 설명용 예시값이에요.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* ---------- 9회차 ---------- */
SIMS.gptbert=function(el,cfg){var box=h('div',{class:'tw'}),c=S0(el,cfg,210,'빈칸 후보 확률'),row=ctrlRow(el),K=kpis(el,3),I=insight(el),md='gpt';el.insertBefore(box,c.parentNode);
  buttons(row,'모델',[['gpt','GPT 방식(왼쪽 문맥만, 다음 단어 예측)'],['bert','BERT 방식(양쪽 문맥, 빈칸 맞히기)']],'gpt',function(v){md=v;draw()});
  function draw(){var L=cfg.left,R=cfg.right,P=cfg.p[md],seen=md==='gpt'?L.length:L.length+R.length;
    box.innerHTML=chips(L.map(function(w){return {w:w,k:'m'}}).concat([{w:'[ ? ]',k:'s'}]).concat(R.map(function(w){return {w:w,k:md==='gpt'?'off':'m'}})))+'<p class="muted" style="font-size:13px;margin:8px 0 0">'+(md==='gpt'?'GPT는 빈칸 오른쪽을 볼 수 없어요(마스크드 어텐션). 취소선 = 보지 못하는 단어':'BERT는 빈칸 앞뒤를 모두 보고 가운데 단어를 맞혀요(마스크 언어모델)')+'</p>';
    var it=Object.keys(P).map(function(w){return {l:w,v:P[w]}}).sort(function(a,b){return b.v-a.v});it.forEach(function(t,i){t.c=i?COL.s:COL.g});var W=fit(c,210),ctx=c.getContext('2d');ctx.clearRect(0,0,W,210);txt(ctx,'빈칸에 들어갈 단어 후보',16,18,COL.text,13,'left',true);hbars(ctx,90,28,W-160,it,34,function(v){return pct(v,0)});stamp(ctx,W,'설명용 확률');
    K([[esc(it[0].l),'1위 후보',md==='gpt'?'a':'g'],[pct(it[0].v,0),'그 확률','i'],[seen+'개','참고한 문맥 단어','m']]);
    I([[md==='gpt'?'a':'g',md==='gpt'?'"배송이" 뒤만 보면 "빨라서"도 그럴듯해요. GPT는 이렇게 앞에서부터 한 단어씩 이어 쓰는 생성에 강합니다.':'뒤의 "늦어서 화가 났다"까지 보니 "빨라서"는 거의 사라졌어요. BERT는 문장 전체를 이해하는 분류·개체명 인식·질의응답에 강합니다.'],['a','확률은 두 방식의 차이를 보이려는 설명용 값이에요. 실제 모델의 수치가 아닙니다.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

SIMS.prompt=function(el,cfg){var box=h('div',{class:'tw'}),row=ctrlRow(el),K=kpis(el,3),I=insight(el),on={};el.insertBefore(box,row);
  var g=h('div',{class:'group'});g.appendChild(h('span',{class:'glabel'},'프롬프트에 넣을 것'));cfg.parts.forEach(function(p){on[p.id]=false;var b=h('button',{class:'bt',type:'button','aria-pressed':'false'},p.name);b.addEventListener('click',function(){on[p.id]=!on[p.id];b.setAttribute('aria-pressed',String(on[p.id]));draw()});g.appendChild(b)});row.appendChild(g);
  function draw(){var lines=[];cfg.parts.forEach(function(p){if(on[p.id]&&p.pre)lines.push(p.text)});lines.push(on.fmt?cfg.taskFmt:cfg.task);cfg.parts.forEach(function(p){if(on[p.id]&&!p.pre)lines.push(p.text)});lines.push('리뷰: "'+cfg.review+'"');
    var n=cfg.parts.filter(function(p){return on[p.id]}).length,fmt=on.fmt,ans=fmt?(on.cot?cfg.ansCot:cfg.ansFmt):cfg.ansFree;
    box.innerHTML='<p style="margin:0 0 6px"><b>완성된 프롬프트</b></p><pre class="out" style="white-space:pre-wrap">'+esc(lines.join('\n'))+'</pre><p style="margin:10px 0 6px"><b>돌아올 응답의 모양(예시)</b></p><pre class="out" style="white-space:pre-wrap">'+esc(ans)+'</pre>';
    K([[n+' / '+cfg.parts.length,'넣은 요소','i'],[fmt?'정해진 라벨':'자유 문장','응답 형식',fmt?'g':'r'],[fmt?'적음':'많음','사람이 다시 정리할 일',fmt?'g':'a']]);
    I([[fmt?'g':'a',fmt?'출력 형식을 정해 주면 1만 건을 돌려도 표로 바로 모을 수 있어요. 예시(Few-shot)는 애매한 리뷰를 어떻게 다룰지 보여 줍니다.':'형식을 정하지 않으면 매번 다른 모양의 문장이 돌아와 집계가 어려워요. "출력 형식"부터 넣어 보세요.'],['a','"응답의 모양"은 형식의 차이를 보이려는 예시예요. 실제 응답은 모델과 시점마다 다르므로, 결과를 표본으로 사람이 확인하는 단계가 늘 필요합니다.']])}
  draw()};

SIMS.rag=function(el,cfg){var box=h('div',{class:'tw'}),row=ctrlRow(el),row2=ctrlRow(el),K=kpis(el,3),I=insight(el),qi=0,on=true,k=1;el.insertBefore(box,row);
  buttons(row,'질문',cfg.qs.map(function(q,i){return [i,q.q]}),0,function(v){qi=v;draw()});buttons(row2,'RAG',[[true,'켜기(문서 검색 후 답변)'],[false,'끄기(모델 기억만으로 답변)']],true,function(v){on=v;draw()});slider(row2,'가져올 문서 수 k',1,3,1,1,function(v){return v+'개'},function(v){k=v;draw()});
  function vec(ws){var o={};ws.forEach(function(w){o[w]=(o[w]||0)+1});return o}
  function cos(a,b){var d=0,na=0,nb=0;for(var x in a){na+=a[x]*a[x];if(b[x])d+=a[x]*b[x]}for(var y in b)nb+=b[y]*b[y];return na&&nb?d/Math.sqrt(na*nb):0}
  function draw(){var Q=cfg.qs[qi],qv=vec(Q.k),R=cfg.docs.map(function(d,i){return {d:d,s:cos(qv,vec(d.k))}}).sort(function(a,b){return b.s-a.s}),top=R.slice(0,k);
    box.innerHTML='<p style="margin:0 0 6px"><b>회사 문서 '+cfg.docs.length+'개와 질문의 유사도</b> <span class="muted">(키워드 벡터의 코사인)</span></p>'+tbl(['문서','유사도','가져옴'],R.map(function(r,i){return {c:[esc(r.d.t),r.s.toFixed(2),on&&i<k?'✓':''],n:[0,1,0],cls:on&&i<k?'best':''}}),420)+'<p style="margin:10px 0 6px"><b>답변(예시)</b></p><pre class="out" style="white-space:pre-wrap">'+esc(on?Q.rag.replace('{doc}',top[0].d.t):Q.norag)+'</pre>';
    K([[on?esc(top[0].d.t):'없음','근거 문서',on?'g':'r'],[on?top[0].s.toFixed(2):'—','질문과의 유사도','i'],[on?'있음':'없음','답에 근거 표시',on?'g':'r']]);
    I([[on?'g':'r',on?'질문과 가까운 회사 문서를 먼저 찾아 함께 넣으니, 답이 우리 회사 규정을 근거로 나와요.':'모델 기억만으로 답하면 그럴듯하지만 우리 회사 규정과 다를 수 있어요. 1회차의 착시효과(할루시네이션)입니다.'],['a','실제 RAG는 문서를 임베딩 벡터로 바꿔 벡터 데이터베이스에서 찾아요. 이 실험은 키워드 벡터로 단순화했고, 문서와 답변은 가상의 회사 "말귀몰"의 예시입니다.']])}
  draw()};

/* ===== 대결 (6~9회차) ===== */
DUELS.w2v_route=function(cfg){var V=cfg.vec,okF=0,okR=0,cat=Object.keys(cfg.cent);cfg.test.forEach(function(t){var kw=null;cat.forEach(function(c){cfg.kw[c].forEach(function(w){if(t.w.indexOf(w)>=0&&!kw)kw=c})});if((kw||'기타')===t.y)okF++;
    var v=[0,0,0],n=0;t.w.forEach(function(w){if(V[w]){v=v.map(function(x,i){return x+V[w][i]});n++}});var best=null,bs=-2;if(n)cat.forEach(function(c){var s=cosv(v,cfg.cent[c]);if(s>bs){bs=s;best=c}});if(best===t.y)okR++});
  var N=cfg.test.length;return {fly:okF/N,robo:okR/N,say:'고객 문의 '+N+'건의 담당 팀 배정 정확도는 초파리 쪽(키워드가 정확히 있어야 배정) '+okF+'건, 주판봇 쪽(단어 벡터 코사인 유사도) '+okR+'건이에요.'}};
DUELS.lstm_mem=function(){var r=rng(71),M=3000,f=0,b=0;for(var i=0;i<M;i++){var n=5+Math.floor(r()*26),s=r()<.5?1:-1,noise=.06*gauss(r),rn=s*Math.pow(.8,n)+noise,ls=s*Math.pow(.97,n)+noise;if(Math.sign(ls)===s)f++;if(Math.sign(rn)===s)b++}
  return {fly:f/M,robo:b/M,say:'첫 단어의 감성을 5~30단어 뒤까지 기억해 맞힌 비율(3,000문장)은 초파리 쪽(LSTM, f = 0.97) '+pct(f/M,1)+', 주판봇 쪽(RNN, w = 0.8) '+pct(b/M,1)+'예요.'}};
DUELS.attn_long=function(){var r=rng(83),n=30,R=400,f=0,b=0;for(var k=0;k<R;k++)for(var i=0;i<n;i++){var dist=n-1-i;if(r()<Math.exp(-dist/16))f++;if(r()<.95)b++}
  return {fly:f/(R*n),robo:b/(R*n),say:'30단어 문장에서 번역에 제대로 쓰인 원문 단어 비율(400문장)은 초파리 쪽(고정 벡터 크기 2배) '+pct(f/(R*n),1)+', 주판봇 쪽(어텐션) '+pct(b/(R*n),1)+'예요.'}};
DUELS.fewshot_ft=function(){function ft(n){return .95-.5*Math.pow(n,-.3)}function evalAcc(p,seed){var r=rng(seed),k=0;for(var i=0;i<500;i++)if(r()<p)k++;return k/500}
  var A={fly:evalAcc(ft(50),3),robo:evalAcc(.86,4),label:'가정 A: 라벨 붙인 리뷰가 50건뿐이다'},B={fly:evalAcc(ft(5000),5),robo:evalAcc(.86,6),label:'가정 B: 라벨 붙인 리뷰가 5,000건 있다'};
  return {cond:true,condA:A,condB:B,fly:A.fly,robo:A.robo,say:'시험 리뷰 500건 정확도는 라벨 50건일 때 초파리 쪽(작은 모델 파인튜닝) '+pct(A.fly,1)+', 주판봇 쪽(큰 모델 + Few-shot 프롬프트) '+pct(A.robo,1)+'이고, 라벨 5,000건일 때 '+pct(B.fly,1)+'와 '+pct(B.robo,1)+'예요. 학습 곡선은 가정한 설명용 모형입니다.'}};
