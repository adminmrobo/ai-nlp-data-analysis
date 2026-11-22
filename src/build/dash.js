
/* 동적 대시보드: 회차마다 한 화면(조절기 · 숫자 카드 4개 · 그림 2개 · 해석), 목차에서는 탭으로 8개 */
var DASHES={};
function niceTicks(lo,hi,n){var span=hi-lo||1,step=Math.pow(10,Math.floor(Math.log10(span/n))),e=span/n/step;step*=e>=5?10:e>=2?5:e>=1?2:1;var t=[],s=Math.ceil(lo/step)*step;for(var v=s;v<=hi+step*1e-6;v+=step)t.push(+v.toFixed(10));return t}
function dChart(c,spec,H){var W=fit(c,H),ctx=c.getContext('2d');ctx.clearRect(0,0,W,H);
  var L=52,R=14,T=30,B=40,pw=W-L-R,ph=H-T-B;txt(ctx,spec.title,L,18,COL.text,13,'left',true);
  if(spec.t==='bar'){var n=spec.vals.length,mx=spec.ymax||Math.max.apply(null,spec.vals.concat([1e-9]))*1.18,bw=pw/n;ctx.strokeStyle=COL.rule;ctx.beginPath();ctx.moveTo(L,T+ph+.5);ctx.lineTo(L+pw,T+ph+.5);ctx.stroke();
    if(spec.hline!=null){var hy=T+ph-spec.hline/mx*ph;ctx.save();ctx.setLineDash([5,4]);ctx.strokeStyle=COL.a;ctx.beginPath();ctx.moveTo(L,hy);ctx.lineTo(L+pw,hy);ctx.stroke();ctx.restore();txt(ctx,spec.hlabel||'',L+2,hy-5,COL.a,11,'left',true)}
    spec.vals.forEach(function(v,i){var bh=Math.max(0,v)/mx*ph,x=L+i*bw+bw*.2;ctx.fillStyle=(spec.cols&&spec.cols[i])||COL.s;ctx.fillRect(x,T+ph-bh,bw*.6,bh);txt(ctx,(spec.fy||String)(v),x+bw*.3,T+ph-bh-6,COL.text,bw<44?10:12,'center',true);txt(ctx,spec.labels[i],x+(spec.pair?bw*.8:bw*.3),T+ph+16,COL.muted,11,'center')});return}
  if(spec.t==='hist'){var bins=spec.bins||30,cnt=new Array(bins).fill(0),lo=spec.lo,hi=spec.hi;spec.vals.forEach(function(v){var k=Math.floor((v-lo)/(hi-lo)*bins);if(k>=0&&k<bins)cnt[k]++});var m=Math.max.apply(null,cnt)||1;
    ctx.fillStyle=spec.c||'rgba(63,95,168,.55)';cnt.forEach(function(k,i){var bh=k/m*ph;ctx.fillRect(L+i*pw/bins+1,T+ph-bh,pw/bins-2,bh)});
    ctx.strokeStyle=COL.rule;ctx.beginPath();ctx.moveTo(L,T+ph+.5);ctx.lineTo(L+pw,T+ph+.5);ctx.stroke();niceTicks(lo,hi,5).forEach(function(t){var x=L+(t-lo)/(hi-lo)*pw;txt(ctx,(spec.fx||String)(t),x,T+ph+16,COL.muted,11,'center')});
    (spec.marks||[]).forEach(function(mk,i){var x=L+(mk.x-lo)/(hi-lo)*pw;if(x<L||x>L+pw)return;ctx.save();ctx.strokeStyle=mk.c||COL.r;ctx.setLineDash([4,3]);ctx.beginPath();ctx.moveTo(x,T);ctx.lineTo(x,T+ph);ctx.stroke();ctx.restore();txt(ctx,mk.l,x+(i%2?-4:4),T+10+(i%3)*13,mk.c||COL.r,11,i%2?'right':'left',true)});
    if(spec.xl)txt(ctx,spec.xl,L+pw,H-6,COL.muted,11,'right');return}
  /* line */
  var xs=spec.xs,x0=xs[0],x1=xs[xs.length-1],ylo=spec.ymin,yhi=spec.ymax;if(ylo==null||yhi==null){var all=[];spec.ys.forEach(function(s){s.d.forEach(function(v){if(isFinite(v))all.push(v)})});if(ylo==null)ylo=Math.min.apply(null,all);if(yhi==null)yhi=Math.max.apply(null,all);if(yhi===ylo)yhi=ylo+1;var pad=(yhi-ylo)*.08;if(spec.ymin==null)ylo-=pad;if(spec.ymax==null)yhi+=pad}
  function X(v){return spec.logx?L+(Math.log(v)-Math.log(x0))/(Math.log(x1)-Math.log(x0))*pw:L+(v-x0)/(x1-x0)*pw}function Y(v){return T+ph-(v-ylo)/(yhi-ylo)*ph}
  ctx.strokeStyle=COL.rule;ctx.lineWidth=1;niceTicks(ylo,yhi,4).forEach(function(t){var y=Y(t);ctx.beginPath();ctx.moveTo(L,y+.5);ctx.lineTo(L+pw,y+.5);ctx.stroke();txt(ctx,(spec.fy||String)(t),L-6,y+4,COL.muted,11,'right')});
  var xt=spec.logx?[1,3,10,30,100,300,1000,3000,10000,30000,100000].filter(function(v){return v>=x0&&v<=x1}):niceTicks(x0,x1,5);xt.forEach(function(t){txt(ctx,(spec.fx||String)(t),X(t),T+ph+16,COL.muted,11,'center')});
  if(spec.band){ctx.fillStyle='rgba(19,138,82,.08)';var b=spec.band,b0=clamp(X(b[0]),L,L+pw),b1=clamp(X(b[1]),L,L+pw);if(b1>b0)ctx.fillRect(b0,T,b1-b0,ph)}
  if(spec.hline!=null){ctx.save();ctx.setLineDash([5,4]);ctx.strokeStyle=COL.a;ctx.beginPath();ctx.moveTo(L,Y(spec.hline));ctx.lineTo(L+pw,Y(spec.hline));ctx.stroke();ctx.restore();txt(ctx,spec.hlabel||'',L+pw-2,Y(spec.hline)<T+16?Y(spec.hline)+14:Y(spec.hline)-5,COL.a,11,'right',true)}
  var lx=L+pw;spec.ys.forEach(function(s,si){ctx.save();ctx.strokeStyle=s.c;ctx.lineWidth=s.w||2.2;if(s.dash)ctx.setLineDash(s.dash);ctx.beginPath();var st=false;s.d.forEach(function(v,i){if(!isFinite(v)){st=false;return}var px=X(xs[i]),py=Y(clamp(v,ylo,yhi));if(!st){ctx.moveTo(px,py);st=true}else ctx.lineTo(px,py)});ctx.stroke();if(s.fill){ctx.lineTo(X(x1),Y(ylo));ctx.lineTo(X(x0),Y(ylo));ctx.closePath();ctx.globalAlpha=.12;ctx.fillStyle=s.c;ctx.fill()}ctx.restore();
    if(s.n&&spec.ys.length>1){ctx.save();ctx.font='700 11px "IBM Plex Sans KR",system-ui,sans-serif';var tw=ctx.measureText('● '+s.n).width;ctx.restore();lx-=tw+12;txt(ctx,'● '+s.n,lx+12,18,s.c,11,'left',true)}});
  if(spec.mark&&X(spec.mark.x)>=L-1&&X(spec.mark.x)<=L+pw+1){var mx_=X(spec.mark.x);ctx.save();ctx.strokeStyle=COL.r;ctx.setLineDash([4,3]);ctx.beginPath();ctx.moveTo(mx_,T);ctx.lineTo(mx_,T+ph);ctx.stroke();ctx.restore();if(spec.mark.y!=null){ctx.fillStyle=COL.r;ctx.beginPath();ctx.arc(mx_,Y(clamp(spec.mark.y,ylo,yhi)),5,0,7);ctx.fill()}if(spec.mark.l)txt(ctx,spec.mark.l,mx_+(mx_>L+pw*.7?-6:6),T+ph-8,COL.r,11,mx_>L+pw*.7?'right':'left',true)}
  if(spec.xl)txt(ctx,spec.xl,L+pw,H-4,COL.muted,11,'right');if(spec.yl)txt(ctx,spec.yl,4,T-10+0,COL.muted,11,'left')}

function Dash(el,key){var D=DASHES[key];if(!D){el.innerHTML='';return}el.innerHTML='';var p={},seed=1,ctl={},playing=false;
  var head=h('div',{class:'dhead'});head.innerHTML='<div><span class="eyebrow">동적 대시보드 · '+esc(D.tag||'')+'</span><h3>'+D.title+'</h3><p class="muted" style="font-size:14px">'+(D.sub||'')+'</p></div>';var hb=h('div',{class:'dbtns'});head.appendChild(hb);el.appendChild(head);
  var row=ctrlRow(el);var K=kpis(el,4);var g=h('div',{class:'dgrid'});el.appendChild(g);var c1=mkCanvas(g,240,D.title+' 그림 1'),c2=mkCanvas(g,240,D.title+' 그림 2');var I=insight(el);
  D.params.forEach(function(q){p[q[0]]=q[5];ctl[q[0]]=slider(row,q[1],q[2],q[3],q[4],q[5],q[6],function(v){p[q[0]]=v;draw()})});
  var pb=action(hb,'▶ 재생: '+(D.playLabel||'천천히 바꿔 보기'),function(){if(playing){playing=false;return}var q=D.params.filter(function(x){return x[0]===D.play})[0];if(!q)return;if(reduce){ctl[q[0]].set(q[3]);return}playing=true;pb.textContent='■ 멈춤';var t0=null,from=q[2],to=q[3];function step(ts){if(!playing){pb.textContent='▶ 재생: '+(D.playLabel||'천천히 바꿔 보기');return}if(!t0)t0=ts;var u=Math.min(1,(ts-t0)/4500),v=from+(to-from)*(D.playLog?(Math.pow(to/from,u)*from-from)/(to-from):u);v=Math.round(v/q[4])*q[4];ctl[q[0]].set(+v.toFixed(6));if(u<1)requestAnimationFrame(step);else{playing=false;pb.textContent='▶ 재생: '+(D.playLabel||'천천히 바꿔 보기')}}requestAnimationFrame(step)},true);
  if(D.random)action(hb,'↻ 다시 뽑기',function(){seed++;draw()});
  action(hb,'처음 값',function(){playing=false;D.params.forEach(function(q){ctl[q[0]].set(q[5])})});
  function draw(){var o=D.f(p,rng(seed*7919+13));K(o.k);dChart(c1,o.c[0],240);dChart(c2,o.c[1],240);I(o.note);c1._spec=o.c[0];c2._spec=o.c[1]}
  addMod(c1,function(dt){if(!dt&&c1._spec){dChart(c1,c1._spec,240);dChart(c2,c2._spec,240)}});draw();return {stop:function(){playing=false}}}
function initDash(){var el=$('.dash[data-dash]');if(el)Dash(el,el.dataset.dash);var tabs=$('.dtabs');if(tabs){var box=$('#dashbox'),cur=null;$$('button',tabs).forEach(function(b){b.addEventListener('click',function(){$$('button',tabs).forEach(function(x){x.setAttribute('aria-pressed','false')});b.setAttribute('aria-pressed','true');if(cur)cur.stop();cur=Dash(box,b.dataset.k);var a=$('#dashlink');if(a){a.href=b.dataset.f+'#dash';a.textContent=b.textContent+'쪽 해설 페이지에서 자세히 보기 →'}})});var f=$('button',tabs);if(f)f.click()}}

function rng0(){return 0}
function seqv(a,b,n){var o=[];for(var i=0;i<n;i++)o.push(a+(b-a)*i/(n-1));return o}
function logseq(a,b,n){var o=[];for(var i=0;i<n;i++)o.push(a*Math.pow(b/a,i/(n-1)));return o}
function lgam(x){var c=[76.18009172947146,-86.50532032941677,24.01409824083091,-1.231739572450155,.1208650973866179e-2,-.5395239384953e-5],y=x,t=x+5.5;t-=(x+.5)*Math.log(t);var s=1.000000000190015;for(var j=0;j<6;j++)s+=c[j]/++y;return -t+Math.log(2.5066282746310005*s/x)}
function betaPdf(x,a,b){if(x<=0||x>=1)return 0;return Math.exp((a-1)*Math.log(x)+(b-1)*Math.log(1-x)+lgam(a+b)-lgam(a)-lgam(b))}
function normCdf(z){var t=1/(1+.2316419*Math.abs(z)),d=.3989423*Math.exp(-z*z/2),p=d*t*(.3193815+t*(-.3565638+t*(1.781478+t*(-1.821256+t*1.330274))));return z>0?1-p:p}
function P1(v){return (v*100).toFixed(1)+'%'}function P0(v){return Math.round(v*100)+'%'}
function won(v){return Math.abs(v)>=1e8?(v/1e8).toFixed(1)+'억':Math.abs(v)>=1e4?nf(Math.round(v/1e4))+'만':nf(Math.round(v))}


/* 1회차 — 규칙 대 학습: 지난 기록이 얼마나 있어야 데이터 기준이 이길까 */
DASHES['01']={tag:'1회차',title:'규칙 대 학습 대시보드',sub:'지난 대출 기록 수에 따라 "데이터로 찾은 기준"과 "전문가 규칙"의 정확도가 어떻게 바뀌나 (설명용 모형)',play:'n',playLog:true,playLabel:'지난 기록을 10건→1,000건으로',random:true,
  params:[['n','지난 대출 기록 수',10,1000,10,200,function(v){return nf(v)+'건'}],['t1','전문가 기준: 월소득 이상',200,600,25,300,function(v){return v+'만 원'}]],
  f:function(q,r){var te=loanData(500,777),ex=ruleAcc(te,q.t1,60),reps=8,ml=0,lr=null;for(var k=0;k<reps;k++){var L=learnRule(loanData(q.n,Math.floor(r()*1e6)));ml+=ruleAcc(te,L[1],L[2]);if(!k)lr=L}ml/=reps;
    var ns=[10,20,40,80,150,300,600,1000],curve=DASHES['01']._c||(DASHES['01']._c=ns.map(function(n,i){var s=0;for(var k=0;k<4;k++){var L=learnRule(loanData(n,3000+i*10+k));s+=ruleAcc(te,L[1],L[2])}return s/4*100}));
    return {k:[[pct(ml,1),'데이터 기준 정확도(새 신청자 500명)','g'],[pct(ex,1),'전문가 규칙 정확도','i'],[nf(lr[1])+'만 원 · '+lr[2]+'%','찾은 기준(한 번의 예)','m'],[ml>ex?'데이터 기준':'전문가 규칙','지금 더 나은 쪽',ml>ex?'g':'a']],
      c:[{t:'line',title:'지난 기록 수에 따른 정확도',xs:ns,logx:true,ys:[{n:'데이터 기준',c:COL.g,d:curve},{n:'전문가 규칙',c:COL.i,d:ns.map(function(){return ex*100}),dash:[5,4]}],ymin:50,ymax:100,fy:function(v){return v+'%'},fx:function(v){return nf(v)},mark:{x:q.n,y:ml*100,l:'지금 '+nf(q.n)+'건'},xl:'지난 기록 수(로그 눈금)'},
        {t:'bar',title:'지금 설정의 정확도',labels:['데이터 기준','전문가 규칙'],vals:[ml*100,ex*100],cols:[COL.g,COL.i],ymax:100,fy:function(v){return v.toFixed(1)+'%'}}],
      note:[['g','기록이 쌓일수록 데이터로 찾은 기준이 좋아져요. 머신러닝에서 "데이터가 중요해진다"는 말의 뜻입니다.'],['a','기록이 아주 적으면 우연한 몇 건에 기준이 휘둘려요. 이때는 경험 많은 전문가 규칙이 더 안전할 수 있습니다.']]}}};

/* 2회차 — 통계 언어 모델의 희소성 */
DASHES['02']={tag:'2회차',title:'통계 언어 모델 희소성 대시보드',sub:'말뭉치가 작으면 "처음 보는 단어 쌍"이 많아 문장 확률이 0이 된다 — 평활(+k)로 얼마나 메울까 (설명용 모형)',play:'m',playLog:true,playLabel:'말뭉치를 1천→100만 단어로',
  params:[['m','말뭉치 크기(단어 수)',1000,1000000,1000,10000,function(v){return nf(v)+'단어'}],['v','어휘 수(서로 다른 단어)',500,20000,500,5000,function(v){return nf(v)+'개'}],['k','평활 상수 k',0,2,.1,1,function(v){return v.toFixed(1)}]],
  f:function(q){function unseen(m){var pairs=q.v*q.v*0.002;return Math.exp(-m/(pairs*3))}var u=unseen(q.m),ms=logseq(1000,1000000,40),c=50,d=c*0+3,pM=(3+q.k)/(c+q.k*q.v),p0=q.k/(c+q.k*q.v);
    return {k:[[pct(u,1),'시험 문장 속 처음 보는 단어 쌍 비율(추정)','r'],[(1-Math.pow(1-u,6)).toFixed(2),'6단어 문장이 확률 0이 될 가능성(평활 없음)','a'],[p0?p0.toExponential(1):'0','처음 보는 쌍이 받는 확률(평활 후)','i'],[pM.toFixed(3),'3번 본 쌍의 확률(앞 단어 50번 기준)','g']],
      c:[{t:'line',title:'말뭉치 크기에 따른 "처음 보는 단어 쌍" 비율',xs:ms,logx:true,ys:[{n:'처음 보는 비율',c:COL.r,d:ms.map(function(m){return unseen(m)*100}),fill:1}],ymin:0,ymax:100,fy:function(v){return v+'%'},fx:function(v){return v>=1e6?'100만':v>=1e4?nf(v/1e4)+'만':nf(v)},mark:{x:q.m,y:u*100,l:'지금'},xl:'말뭉치 크기(로그 눈금)'},
        {t:'bar',title:'평활 뒤 확률(앞 단어가 50번 나왔을 때)',labels:['3번 본 쌍','1번 본 쌍','처음 보는 쌍'],vals:[(3+q.k)/(50+q.k*q.v),(1+q.k)/(50+q.k*q.v),p0],cols:[COL.g,COL.s,COL.r],fy:function(v){return v?v.toExponential(1):'0'}}],
      note:[['r','통계 기반 모델은 본 적 없는 단어 조합에 0을 줘요. 말뭉치를 아무리 키워도 새 조합은 계속 나옵니다.'],['a','평활(k를 더하기)은 0을 막지만, k가 크면 자주 본 쌍의 확률까지 깎아요. 이 한계가 딥러닝 언어 모델로 넘어간 이유 중 하나입니다. 곡선은 가정한 설명용 모형이에요.']]}}};

/* 3회차 — 띄어쓰기 대 형태소 분석: 검색 재현율 */
DASHES['03']={tag:'3회차',title:'형태소 분석 검색 대시보드',sub:'조사·어미가 붙은 어절과 신조어 비율에 따라 "단어 검색"이 얼마나 놓치나 (설명용 모형)',play:'a',playLabel:'조사가 붙은 비율을 0→90%로',
  params:[['a','조사·어미가 붙은 어절 비율',0,90,5,60,function(v){return v+'%'}],['z','신조어·미등록어 비율',0,40,1,10,function(v){return v+'%'}],['d','사용자 사전이 잡는 신조어',0,100,5,0,function(v){return v+'%'}]],
  f:function(q){var a=q.a/100,z=q.z/100,dc=q.d/100,sp=(1-a),mo=1-z*(1-dc)*.8,as=seqv(0,.9,30);
    return {k:[[pct(sp,0),'띄어쓰기 기준 검색 재현율','r'],[pct(mo,0),'형태소 분석 재현율','g'],[pct(z*(1-dc),0),'사전에 없어 잘릴 수 있는 신조어','a'],[mo>sp?'형태소 분석':'비슷함','더 나은 쪽',mo>sp?'g':'a']],
      c:[{t:'line',title:'조사가 붙은 비율에 따른 검색 재현율',xs:as.map(function(x){return x*100}),ys:[{n:'띄어쓰기',c:COL.r,d:as.map(function(x){return (1-x)*100})},{n:'형태소 분석',c:COL.g,d:as.map(function(){return mo*100})}],ymin:0,ymax:100,fy:function(v){return v+'%'},fx:function(v){return v+'%'},mark:{x:q.a,y:sp*100,l:'지금'},xl:'조사·어미가 붙은 어절 비율'},
        {t:'bar',title:'신조어 처리',labels:['사전으로 잡은 신조어','잘릴 수 있는 신조어'],vals:[z*dc*100,z*(1-dc)*100],cols:[COL.g,COL.r],fy:function(v){return v.toFixed(0)+'%'}}],
      note:[['g','한국어는 어절 대부분에 조사·어미가 붙어서 띄어쓰기로 자르면 같은 단어도 서로 다른 토큰이 돼요. 형태소 분석이 필수인 이유입니다.'],['a','형태소 분석기도 사전에 없는 신조어는 잘못 자를 수 있어요. 사용자 사전을 주기적으로 고쳐야 합니다. 비율은 가정한 설명용 값이에요.']]}}};

/* 4회차 — TF-IDF 계산기 */
DASHES['04']={tag:'4회차',title:'TF-IDF 계산 대시보드',sub:'처음 값은 교안 예시(문서 10개, "인공지능"이 한 문서에 5번·문서 단어 100개, 3개 문서에 등장 → 0.026, log₁₀)',play:'df',playLabel:'나온 문서 수를 1→전체로',
  params:[['N','전체 문서 수',2,1000,1,10,function(v){return nf(v)+'개'}],['df','단어가 나온 문서 수',1,1000,1,3,function(v){return nf(v)+'개'}],['f','문서 안 등장 횟수',1,50,1,5,function(v){return v+'번'}],['len','문서의 전체 단어 수',20,1000,10,100,function(v){return v+'개'}]],
  f:function(q){var df=Math.min(q.df,q.N),tf=q.f/q.len,idf=Math.log10(q.N/df),s=tf*idf,ds=[];for(var i=1;i<=q.N;i+=Math.max(1,Math.round(q.N/60)))ds.push(i);
    return {k:[[tf.toFixed(3),'TF = '+q.f+' ÷ '+q.len,'i'],[idf.toFixed(3),'IDF = log₁₀('+q.N+' ÷ '+df+')','a'],[s.toFixed(3),'TF-IDF','g'],[idf<.05?'흔한 말(점수 거의 0)':s>.02?'핵심어 후보':'보통','판정',idf<.05?'r':s>.02?'g':'a']],
      c:[{t:'line',title:'나온 문서 수가 많을수록 IDF는 떨어진다',xs:ds,ys:[{n:'IDF',c:COL.a,d:ds.map(function(d){return Math.log10(q.N/d)})}],ymin:0,fy:function(v){return v.toFixed(1)},fx:function(v){return nf(v)},mark:{x:df,y:idf,l:'지금 df = '+df},xl:'단어가 나온 문서 수 df'},
        {t:'bar',title:'같은 횟수라도 흔한 말은 점수가 낮다',labels:['이 단어','모든 문서에 나오는 말'],vals:[s,tf*Math.log10(q.N/q.N)],cols:[COL.g,COL.r],fy:function(v){return v.toFixed(3)}}],
      note:[['g','TF-IDF는 "이 문서에서는 많이, 다른 문서에서는 드물게" 나오는 단어에 높은 점수를 줘요. 별도 불용어 목록 없이도 흔한 말이 뒤로 밀립니다.'],['a','교안 예시의 0.52는 log₁₀ 기준이에요. 자연로그(ln)를 쓰면 1.20이 되어 TF-IDF는 0.060이 됩니다. 순위는 같지만 숫자를 비교할 때 밑을 맞춰야 해요.']]}}};

/* 6회차 — 코사인 유사도 */
DASHES['06']={tag:'6회차',title:'단어 유사도 대시보드',sub:'두 단어 벡터의 각도와 길이를 바꾸며 코사인 유사도 · 유클리드 · 맨해튼을 비교 (교안 기준: 코사인 0.7 이상 높은 유사도)',play:'ang',playLabel:'각도를 0°→180°로',
  params:[['ang','두 벡터 사이 각도',0,180,1,30,function(v){return v+'°'}],['len','B의 길이 배율',.5,4,.1,1,function(v){return '×'+v.toFixed(1)}]],
  f:function(q){var t=q.ang*Math.PI/180,a=[1,0],b=[q.len*Math.cos(t),q.len*Math.sin(t)],cs=Math.cos(t),eu=Math.hypot(a[0]-b[0],a[1]-b[1]),mh=Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1]),as=seqv(0,180,61),ls=seqv(.5,4,36);
    return {k:[[cs.toFixed(2),'코사인 유사도','g'],[eu.toFixed(2),'유클리드 거리','r'],[mh.toFixed(2),'맨해튼 거리','a'],[cs>=.7?'높음':cs>=.3?'중간':cs>-.3?'무관에 가까움':'반대 방향','해석',cs>=.7?'g':'a']],
      c:[{t:'line',title:'각도에 따른 코사인 유사도',xs:as,ys:[{n:'코사인',c:COL.g,d:as.map(function(x){return Math.cos(x*Math.PI/180)})}],ymin:-1,ymax:1,hline:.7,hlabel:'0.7 높은 유사도',fy:function(v){return v.toFixed(1)},fx:function(v){return v+'°'},mark:{x:q.ang,y:cs,l:'지금'},xl:'각도'},
        {t:'line',title:'B의 길이만 바꾸면? (각도 고정)',xs:ls,ys:[{n:'코사인',c:COL.g,d:ls.map(function(){return cs})},{n:'유클리드',c:COL.r,d:ls.map(function(L){return Math.hypot(1-L*Math.cos(t),L*Math.sin(t))})}],ymin:-1,fy:function(v){return v.toFixed(1)},fx:function(v){return '×'+v.toFixed(1)},mark:{x:q.len,l:'지금'},xl:'B의 길이 배율'}],
      note:[['g','코사인은 길이를 바꿔도 그대로예요. 자주 쓰여 벡터가 길어진 단어도 "방향(뜻)"만으로 비교할 수 있습니다.'],['a','유클리드 거리는 길이에 민감해 빈도가 다른 단어끼리 비교할 때 왜곡될 수 있어요(교안 비교표).']]}}};

/* 7회차 — 불균형 데이터와 평가 지표 */
DASHES['07']={tag:'7회차',title:'스팸 분류 평가 대시보드',sub:'스팸 비율과 판정 기준에 따라 정확도 · 정밀도 · 재현율 · F1이 어떻게 갈리나 (점수 분포는 설명용 모형)',play:'th',playLabel:'판정 기준을 0.1→0.9로',
  params:[['rate','스팸 비율',1,50,1,10,function(v){return v+'%'}],['th','스팸 판정 기준 점수',.1,.9,.01,.5,function(v){return v.toFixed(2)}],['sep','모델의 구별력(두 분포 거리)',.1,.6,.01,.36,function(v){return v.toFixed(2)}]],
  f:function(q){var r=q.rate/100,ms=.5+q.sep/2,mh=.5-q.sep/2,s=.16,tpr=1-normCdf((q.th-ms)/s),fpr=1-normCdf((q.th-mh)/s),tp=r*tpr,fp=(1-r)*fpr,fn=r-tp,tn=1-r-fp,acc=tp+tn,pr=tp/Math.max(1e-9,tp+fp),rc=tpr,f1=pr+rc?2*pr*rc/(pr+rc):0,xs=seqv(0,1,80);
    return {k:[[pct(acc,1),'정확도','i'],[pct(pr,1),'정밀도','m'],[pct(rc,1),'재현율','a'],[pct(f1,1),'F1 점수','g']],
      c:[{t:'line',title:'정상 메일과 스팸의 모델 점수 분포',xs:xs,ys:[{n:'정상',c:COL.i,d:xs.map(function(x){return (1-r)*Math.exp(-.5*Math.pow((x-mh)/s,2))}),fill:1},{n:'스팸',c:COL.r,d:xs.map(function(x){return r*Math.exp(-.5*Math.pow((x-ms)/s,2))}),fill:1}],ymin:0,fy:function(){return ''},fx:function(v){return v.toFixed(1)},mark:{x:q.th,l:'기준'},xl:'모델이 매긴 스팸 점수'},
        {t:'bar',title:'지표 비교 (게으른 모델 = 전부 정상)',labels:['정확도','정밀도','재현율','F1','게으른 모델 정확도'],vals:[acc*100,pr*100,rc*100,f1*100,(1-r)*100],cols:[COL.i,COL.m,COL.a,COL.g,COL.r],ymax:100,fy:function(v){return v.toFixed(0)+'%'}}],
      note:[['r','스팸이 '+q.rate+'%뿐이면 "전부 정상"이라고 답해도 정확도가 '+pct(1-r,0)+'예요. 불균형 데이터에서는 F1과 재현율을 함께 봐야 합니다.'],['a','기준을 내리면 재현율이 오르고 정밀도가 떨어져요. 놓치는 스팸과 잘못 막는 정상 메일 중 무엇이 더 비싼지로 정합니다.']]}}};

/* 8회차 — 어텐션 소프트맥스와 병렬 계산 */
DASHES['08']={tag:'8회차',title:'어텐션 가중치 대시보드',sub:'관련 단어와 나머지 단어의 점수 차, 문장 길이, 벡터 차원 d(√d로 나눔)에 따라 주목이 얼마나 모이나 (설명용 모형)',play:'n',playLabel:'문장을 5→60단어로',
  params:[['n','원문 단어 수',5,60,1,12,function(v){return v+'단어'}],['gap','관련 단어의 점수 차(Q·K)',0,16,.5,6,function(v){return v.toFixed(1)}],['d','벡터 차원 d',1,64,1,4,function(v){return v}]],
  f:function(q){var sc=Math.sqrt(q.d),w=Math.exp(q.gap/sc)/(Math.exp(q.gap/sc)+q.n-1),ns=seqv(5,60,56),ws=[];for(var i=0;i<Math.min(q.n,12);i++)ws.push(i===2?w:(1-w)/(q.n-1));
    return {k:[[pct(w,0),'관련 단어가 받는 가중치','g'],[pct((1-w)/(q.n-1),1),'나머지 단어 하나의 가중치','i'],[q.n+' 걸음 → 1번','RNN 순차 처리 대 셀프 어텐션','a'],[nf(q.n*q.n)+'개','셀프 어텐션 점수표 크기(n²)','m']],
      c:[{t:'bar',title:'원문 단어별 가중치(앞 12개까지)',labels:ws.map(function(v,i){return i===2?'관련':String(i+1)}),vals:ws.map(function(v){return v*100}),cols:ws.map(function(v,i){return i===2?COL.m:COL.s}),fy:function(v){return v.toFixed(0)+'%'}},
        {t:'line',title:'문장이 길어지면 관련 단어 가중치는?',xs:ns,ys:[{n:'관련 단어 가중치',c:COL.m,d:ns.map(function(n){return Math.exp(q.gap/sc)/(Math.exp(q.gap/sc)+n-1)*100})}],ymin:0,ymax:100,fy:function(v){return v+'%'},fx:function(v){return v},mark:{x:q.n,y:w*100,l:'지금'},xl:'원문 단어 수'}],
      note:[['g','점수 차가 크면 관련 단어 하나에 주목이 몰려요. 소프트맥스는 가중치 합을 늘 100%로 맞춥니다.'],['a','차원 d가 크면 점수 자체가 커지기 쉬워서 트랜스포머는 √d로 나눠요. 대신 문장 길이 n이 늘면 점수표가 n²로 커지는 비용이 있습니다.']]}}};

/* 9회차 — 프롬프트 대 파인튜닝 */
DASHES['09']={tag:'9회차',title:'Few-shot 프롬프트 대 파인튜닝 대시보드',sub:'라벨 붙인 데이터가 몇 건 있을 때 작은 모델 파인튜닝이 큰 모델 프롬프트를 앞지를까 (학습 곡선은 가정한 설명용 모형)',play:'n',playLog:true,playLabel:'라벨 데이터를 10→1만 건으로',
  params:[['n','라벨 붙인 데이터 수',10,10000,10,50,function(v){return nf(v)+'건'}],['p','큰 모델 + Few-shot 정확도(가정)',70,95,1,86,function(v){return v+'%'}],['cap','파인튜닝 최고 정확도(가정)',85,99,1,95,function(v){return v+'%'}]],
  f:function(q){function ft(n){return q.cap/100-.5*Math.pow(n,-.3)}var a=ft(q.n),pp=q.p/100,ns=logseq(10,10000,50),cross=null;for(var i=0;i<ns.length;i++)if(ft(ns[i])>=pp){cross=ns[i];break}
    return {k:[[pct(Math.max(0,a),1),'작은 모델 파인튜닝(예상)','g'],[pct(pp,0),'큰 모델 + Few-shot(가정)','i'],[cross?nf(Math.round(cross/10)*10)+'건':'1만 건 넘게','파인튜닝이 앞지르는 지점','a'],[a>pp?'파인튜닝':'프롬프트','지금 데이터라면',a>pp?'g':'i']],
      c:[{t:'line',title:'라벨 데이터 수에 따른 정확도',xs:ns,logx:true,ys:[{n:'파인튜닝',c:COL.g,d:ns.map(function(n){return ft(n)*100})},{n:'Few-shot',c:COL.i,d:ns.map(function(){return pp*100}),dash:[5,4]}],ymin:50,ymax:100,fy:function(v){return v+'%'},fx:function(v){return nf(v)},mark:{x:q.n,y:a*100,l:'지금'},xl:'라벨 데이터 수(로그 눈금)'},
        {t:'bar',title:'지금 설정',labels:['파인튜닝','Few-shot 프롬프트'],vals:[Math.max(0,a)*100,pp*100],cols:[COL.g,COL.i],ymax:100,fy:function(v){return v.toFixed(1)+'%'}}],
      note:[['g','라벨이 적을 때는 큰 사전훈련 모델에 예시 몇 개를 주는 쪽이, 많이 쌓이면 우리 데이터로 파인튜닝한 모델이 유리해지는 경향이 있어요(전이학습).'],['a','곡선의 모양과 숫자는 이 페이지가 가정한 설명용 모형이에요. 실제 갈림길은 과제·모델·비용에 따라 달라지므로 작은 시험으로 직접 확인하세요.']]}}};
