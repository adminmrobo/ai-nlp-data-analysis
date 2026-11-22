/* ===== 범용 실험 모듈 C (24쪽 확장판) ===== */
function evx(expr,v){var k=Object.keys(v),f=new Function(k.concat(['log','ln','exp','sqrt','pow','min','max','abs','cos','sin','PI']).join(','),'return ('+expr+')');return f.apply(null,k.map(function(x){return v[x]}).concat([Math.log10,Math.log,Math.exp,Math.sqrt,Math.pow,Math.min,Math.max,Math.abs,Math.cos,Math.sin,Math.PI]))}
function fmtv(x,d){if(typeof x!=='number')return esc(String(x));if(!isFinite(x))return '—';if(typeof d==='string'&&d[0]==='%'){var pd=+d.slice(1)||1;return (x>0&&x<0.001)?(+(x*100).toPrecision(2))+'%':(x*100).toFixed(pd)+'%'}if(d==='e'){var u=[[1e16,'경'],[1e12,'조'],[1e8,'억'],[1e4,'만']];for(var i=0;i<u.length;i++)if(Math.abs(x)>=u[i][0]){var q=x/u[i][0];return (q>=100?nf(q,0):+q.toPrecision(3))+u[i][1]}return nf(x,0)}return nf(x,d==null?2:d)}

/* 분류해 보기: 카드마다 상자 고르기 */
SIMS.sorter=function(el,cfg){var box=h('div',{class:'tw'}),row=ctrlRow(el),K=kpis(el,3),I=insight(el),ans={},shown=false;el.appendChild(box);el.insertBefore(box,row);
  action(row,'정답 보기',function(){shown=!shown;draw()},true);action(row,'다시',function(){ans={};shown=false;draw()});
  function draw(){var ok=0,done=0;box.innerHTML='<p class="muted" style="margin:0 0 8px">'+esc(cfg.ask||'카드마다 알맞은 상자를 눌러 보세요.')+'</p><div class="sgrid">'+cfg.items.map(function(it,i){var a=ans[i];if(a!=null){done++;if(a===it.a)ok++}
      return '<div class="srow'+(a!=null?(a===it.a?' ok':' no'):'')+'"><p><b>'+esc(it.t)+'</b></p><div class="group">'+cfg.bins.map(function(b,j){return '<button class="bt" type="button" data-i="'+i+'" data-j="'+j+'" aria-pressed="'+(a===j)+'">'+esc(b)+'</button>'}).join('')+'</div>'+((a!=null||shown)?'<p class="muted" style="font-size:14px;margin:6px 0 0">'+(a!=null?(a===it.a?'✓ 맞아요. ':'✗ 정답은 "'+esc(cfg.bins[it.a])+'". '):'정답: '+esc(cfg.bins[it.a])+'. ')+esc(it.why||'')+'</p>':'')+'</div>'}).join('')+'</div>';
    $$('button[data-i]',box).forEach(function(b){b.addEventListener('click',function(){ans[+b.dataset.i]=+b.dataset.j;draw()})});
    K([[done+' / '+cfg.items.length,'고른 카드','i'],[ok+'개','맞힌 카드',ok===cfg.items.length?'g':'a'],[done?pct(ok/done,0):'—','정답률','m']]);
    I([[done===cfg.items.length?(ok===cfg.items.length?'g':'a'):'a',done===cfg.items.length?(cfg.done||'다 골랐어요. 틀린 카드의 설명을 읽어 보세요.'):(cfg.tip||'헷갈리면 "정답 보기"를 눌러도 돼요. 이 실험은 기록하지 않아요.')]])}
  draw()};

/* 비교표: 상황을 고르면 알맞은 행을 강조 */
SIMS.compare=function(el,cfg){var box=h('div',{class:'tw'}),row=ctrlRow(el),K=kpis(el,2),I=insight(el),si=0;el.insertBefore(box,row);
  if(cfg.scen&&cfg.scen.length)buttons(row,cfg.scenLabel||'이럴 때는?',cfg.scen.map(function(s,i){return [i,s.q]}),0,function(v){si=v;draw()});
  function draw(){var S=cfg.scen&&cfg.scen[si],pk=S?S.pick:-1;box.innerHTML=tbl(cfg.head,cfg.rows.map(function(r,i){return {c:r.map(function(x,j){return (j===0&&i===pk?'★ ':'')+x}),cls:i===pk?'best':''}}),cfg.min||560);
    if(S){K([[cfg.rows[pk][0],'이 상황에 알맞은 것','g'],[esc(S.q),'상황','i']]);I([['g',S.why]].concat(cfg.note?[['a',cfg.note]]:[]))}else{K([[cfg.rows.length+'개','비교한 항목','i'],[cfg.head.length-1+'가지','비교 기준','a']]);I(cfg.note?[['a',cfg.note]]:[])}}
  draw()};

/* 단계 넘기기: 공정·발전 과정 */
SIMS.steps=function(el,cfg){var box=h('div',{class:'tw'}),row=ctrlRow(el),K=kpis(el,2),I=insight(el),i=0,N=cfg.steps.length;el.insertBefore(box,row);
  action(row,'◀ 이전',function(){i=Math.max(0,i-1);draw()});action(row,'다음 ▶',function(){i=Math.min(N-1,i+1);draw()},true);
  function draw(){var S=cfg.steps[i];box.innerHTML='<div class="toks">'+cfg.steps.map(function(s,j){return '<span class="tok '+(j===i?'s':'')+'">'+(j+1)+'. '+esc(s.t)+'</span>'}).join('')+'</div><h4 style="margin:12px 0 6px">'+(i+1)+'단계 · '+esc(S.t)+'</h4><p style="margin:0 0 8px">'+S.d+'</p>'+(S.ex?'<pre class="out" style="white-space:pre-wrap">'+esc(S.ex)+'</pre>':'');
    K([[(i+1)+' / '+N,'지금 단계','i'],[esc(S.k||S.t),cfg.kLabel||'핵심','g']]);I([[i===N-1?'g':'a',i===N-1?(cfg.done||'마지막 단계예요. 앞 단계의 결과가 다음 단계의 입력이 된다는 점을 기억하세요.'):'"다음 ▶"을 눌러 한 단계씩 따라가 보세요.']])}
  draw()};

/* 단어 빈도와 워드 클라우드 */
SIMS.freq=function(el,cfg){var box=h('div',{class:'tw'}),c=S0(el,cfg,230,'단어 빈도 막대'),row=ctrlRow(el),K=kpis(el,3),I=insight(el),st=false;el.insertBefore(box,c.parentNode);
  buttons(row,'불용어',[[false,'그대로 세기'],[true,'불용어 빼고 세기']],false,function(v){st=v;draw()});
  function draw(){var all=[];cfg.texts.forEach(function(t){t.split(/\s+/).forEach(function(w){w=w.replace(/[.,!?]/g,'');if(w&&(!st||cfg.stop.indexOf(w)<0))all.push(w)})});var cnt={};all.forEach(function(w){cnt[w]=(cnt[w]||0)+1});var ks=Object.keys(cnt).sort(function(a,b){return cnt[b]-cnt[a]||(a<b?-1:1)}),mx=cnt[ks[0]]||1;
    box.innerHTML='<p class="muted" style="margin:0 0 6px">'+esc(cfg.label||'예시 글')+' '+cfg.texts.length+'개 · 워드 클라우드(많이 나온 단어일수록 크게)</p><div class="cloud">'+ks.slice(0,24).map(function(w){var s=cnt[w]/mx;return '<span style="font-size:'+(14+s*22).toFixed(0)+'px;color:'+(s>.6?COL.g:s>.3?COL.s:COL.muted)+'">'+esc(w)+'</span>'}).join(' ')+'</div>';
    var W=fit(c,230),ctx=c.getContext('2d');ctx.clearRect(0,0,W,230);txt(ctx,'가장 많이 나온 단어',16,18,COL.text,13,'left',true);hbars(ctx,110,28,W-180,ks.slice(0,6).map(function(w,i){return {l:w,v:cnt[w],c:i?COL.s:COL.g}}),32,function(v){return v+'번'});stamp(ctx,W,cfg.stamp||'예시 글');
    K([[nf(all.length),'단어(토큰) 수','i'],[ks.length+'개','서로 다른 단어','a'],[esc(ks[0])+' '+cnt[ks[0]]+'번','1위','g']]);
    I([[st?'g':'a',st?(cfg.msgOn||'불용어를 빼니 내용을 말해 주는 단어가 위로 올라와요.'):(cfg.msgOff||'그대로 세면 "정말·그리고" 같은 흔한 말이 위를 차지해요. 불용어를 빼 보세요.')],['a',cfg.note||'빈도는 "많이 나온 말"만 알려 줘요. 그 말이 칭찬인지 불만인지, 이 문서만의 말인지는 따로 봐야 해요.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* 수식 계산기: 슬라이더 → 결과 */
SIMS.calc=function(el,cfg){var c=cfg.bars?S0(el,cfg,200,'계산 결과 막대'):null,row=ctrlRow(el),K=kpis(el,Math.min(4,cfg.out.length)),E=eqline(el),I=insight(el),v={};
  if(cfg.pre){var p=h('div',{class:'tw'});p.innerHTML=cfg.pre;el.insertBefore(p,c?c.parentNode:row)}
  cfg.in.forEach(function(q){v[q[0]]=q[5];slider(row,q[1],q[2],q[3],q[4],q[5],function(x){return nf(x,q[7]!=null?q[7]:(q[4]<1?(q[4]<.1?2:1):0))+(q[6]||'')},function(x){v[q[0]]=x;draw()})});
  function draw(){var o=cfg.out.map(function(q){var x=evx(q[1],v);return [fmtv(x,q[2])+(q[4]||''),q[0],q[3]||'']});K(o);
    E(cfg.eq.replace(/\{\{(.+?)\}\}/g,function(m,ex){var p=ex.split('|');return '<b>'+fmtv(evx(p[0],v),p[1]==null?2:(/^[%e]/.test(p[1])?p[1]:+p[1]))+'</b>'}));
    if(c){var W=fit(c,200),ctx=c.getContext('2d');ctx.clearRect(0,0,W,200);txt(ctx,cfg.barTitle||'',16,18,COL.text,13,'left',true);hbars(ctx,140,28,W-210,cfg.bars.map(function(b,i){return {l:b[0],v:Math.max(0,evx(b[1],v)),c:[COL.g,COL.i,COL.a,COL.m,COL.r][i%5]}}),Math.min(40,160/cfg.bars.length),function(x){return fmtv(x,cfg.barDec==null?2:cfg.barDec)});stamp(ctx,W,cfg.stamp||'예시값')}
    I((cfg.notes||[]).map(function(n){return [n[0],typeof n[2]==='string'?(evx(n[2],v)?n[1]:n[3]):n[1]]}))}
  if(c)addMod(c,function(dt){if(!dt)draw()});draw()};

/* PCA: 투영 축 돌려 보기 */
SIMS.pca=function(el,cfg){var H=300,c=S0(el,cfg,H,'점과 투영 축'),row=ctrlRow(el),K=kpis(el,3),E=eqline(el),I=insight(el),ang=0,P=cfg.pts;
  var mx=mean(P.map(function(p){return p[0]})),my=mean(P.map(function(p){return p[1]})),Q=P.map(function(p){return [p[0]-mx,p[1]-my,p[2]]}),tot=Q.reduce(function(s,p){return s+p[0]*p[0]+p[1]*p[1]},0);
  function varAt(a){var cx=Math.cos(a),sy=Math.sin(a);return Q.reduce(function(s,p){var t=p[0]*cx+p[1]*sy;return s+t*t},0)}
  var best=0,bv=0;for(var d=0;d<180;d++){var vv=varAt(d*Math.PI/180);if(vv>bv){bv=vv;best=d}}
  var sl=slider(row,'투영 축의 방향',0,179,1,0,function(x){return x+'°'},function(x){ang=x;draw()});action(row,'주성분(분산이 가장 큰 축) 찾기',function(){sl.set(best)},true);
  function draw(){var a=ang*Math.PI/180,W=fit(c,H),ctx=c.getContext('2d');ctx.clearRect(0,0,W,H);grid(ctx,W,H);var sc=Math.min(W,H)/ (2*cfg.r)*0.85,cx=W/2,cy=H/2;
    ctx.strokeStyle=COL.a;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx-Math.cos(a)*W,cy+Math.sin(a)*W);ctx.lineTo(cx+Math.cos(a)*W,cy-Math.sin(a)*W);ctx.stroke();
    Q.forEach(function(p){var x=cx+p[0]*sc,y=cy-p[1]*sc,t=p[0]*Math.cos(a)+p[1]*Math.sin(a),px=cx+t*Math.cos(a)*sc,py=cy-t*Math.sin(a)*sc;ctx.strokeStyle='rgba(93,98,120,.35)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(px,py);ctx.stroke();ctx.fillStyle=COL.a;ctx.beginPath();ctx.arc(px,py,3,0,7);ctx.fill();ctx.fillStyle=COL.s;ctx.beginPath();ctx.arc(x,y,4.5,0,7);ctx.fill();if(p[2])txt(ctx,p[2],x+6,y-6,COL.text,11)});stamp(ctx,W,'설명용 2차원 점');
    var r=varAt(a)/tot;K([[pct(r,0),'이 축이 담은 분산(정보)',r>.85?'g':'a'],[best+'°','주성분 방향','i'],[pct(1-r,0),'버려진 분산','r']]);
    E('투영값 = x·cos θ + y·sin θ → 분산이 가장 큰 θ가 첫 번째 주성분(지금 담은 정보 <b>'+pct(r,0)+'</b>)');
    I([[r>.85?'g':'a',r>.85?'점들이 가장 길게 퍼진 방향으로 투영하니 정보를 거의 잃지 않아요. PCA가 찾는 축이 이것이에요.':'축을 돌려 보세요. 점들이 길게 퍼진 방향과 어긋나면 투영한 점(주황)들이 한데 몰려 정보를 잃어요.'],['a','실제로는 300차원에서 분산이 큰 축 2~3개를 차례로 골라요. 직선 축이라 휘어진 구조는 담기 어렵고, 그때는 t-SNE를 써요.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* LDA 결과 해석: 관련성 λ */
SIMS.relevance=function(el,cfg){var c=S0(el,cfg,250,'관련성 순위 막대'),row=ctrlRow(el),K=kpis(el,3),E=eqline(el),I=insight(el),lam=1;
  slider(row,'λ (1 = 주제 안 빈도 중시, 0 = 이 주제만의 특이성 중시)',0,1,.05,1,function(x){return x.toFixed(2)},function(x){lam=x;draw()});
  function draw(){var R=cfg.words.map(function(w){return {l:w[0],v:lam*Math.log(w[1])+(1-lam)*Math.log(w[1]/w[2])}}).sort(function(a,b){return b.v-a.v}),lo=Math.min.apply(null,R.map(function(r){return r.v}));R.forEach(function(r,i){r.s=r.v-lo+0.05;r.c=i?COL.s:COL.g});
    var W=fit(c,250),ctx=c.getContext('2d');ctx.clearRect(0,0,W,250);txt(ctx,'"'+cfg.topic+'" 주제의 상위 단어(관련성 순)',16,18,COL.text,13,'left',true);hbars(ctx,90,28,W-160,R.map(function(r){return {l:r.l,v:r.s,c:r.c}}),Math.min(34,210/R.length),function(){return ''});stamp(ctx,W,'설명용 확률');
    K([[esc(R[0].l),'1위 단어','g'],[lam.toFixed(2),'λ','i'],[esc(R.slice(0,3).map(function(r){return r.l}).join(' · ')),'상위 3개','a']]);
    E('관련성 = λ × log p(단어 | 주제) + (1 − λ) × log( p(단어 | 주제) ÷ p(단어) )');
    I([[lam>.6?'a':'g',lam>.6?'λ가 크면 이 주제에서 많이 나온 단어가 위로 와요. 다른 주제에도 흔한 말이 섞일 수 있어요.':'λ를 낮추면 다른 주제에는 드물고 이 주제에만 많은 단어가 위로 와요. 주제의 이름을 붙이기 좋은 단어들이에요.'],['a','교안의 LDA 시각화(주제 간 거리 지도 오른쪽 막대)에서 쓰는 λ와 같은 생각이에요. 확률값은 설명용 예시예요.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};
