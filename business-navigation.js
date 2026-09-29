(()=>{
const biz=window.REPORT_BUSINESS;if(!biz)return;
const names={uwg:'Utah Water Gardens',icon:'Icon Dumpsters',tnt:'TNT Dumpsters'},files={uwg:'uwg-expanded-rankings.html',icon:'icon-rankings.html',tnt:'tnt-rankings.html'};
const main=document.querySelector('main');const old=[...main.children];
const style=document.createElement('style');style.textContent=`[hidden]{display:none!important}.report-header{display:flex;justify-content:space-between;align-items:flex-start;gap:20px;margin-bottom:20px}.report-header p{margin:5px 0;color:#627184}.report-menu{position:relative;margin:0}.report-menu summary{padding:9px 14px;border:1px solid #ccd6df;border-radius:7px;background:white}.report-menu div{position:absolute;right:0;z-index:30;width:225px;background:white;box-shadow:0 8px 30px #0002;padding:12px;border-radius:8px}.report-menu a{display:block;padding:9px;text-decoration:none}.report-nav{position:sticky;top:0;z-index:25;background:#f6f7f9;display:flex;gap:7px;flex-wrap:wrap;padding:12px 0;border-top:1px solid #dce3e9;border-bottom:1px solid #dce3e9;margin-bottom:20px}.report-nav button[aria-current=page]{background:#163c58;color:white}.report-panel>.detail:first-child{margin-top:0}.report-panel>footer{margin-top:15px}.report-panel .scroll{max-height:68vh}.report-panel #competitorSection{margin:0;padding:0;border:0;background:transparent}.report-panel #websiteChangeLog{margin-top:0}.report-panel>h2{margin-bottom:12px}@media(max-width:700px){.report-header{flex-direction:column}.report-nav button{flex:1}.report-menu div{left:0;right:auto}}`;
document.head.append(style);
const header=document.createElement('header');header.className='report-header';header.innerHTML=`<div><h1>${names[biz]}</h1><p>Organic rankings · Local competitors · Page analysis</p></div><details class="report-menu"><summary>Switch business</summary><div>${Object.entries(names).map(([id,name])=>`<a href="${files[id]}" ${id===biz?'aria-current="page"':''}>${name}</a>`).join('')}</div></details>`;
const nav=document.createElement('nav');nav.className='report-nav';nav.setAttribute('aria-label',names[biz]+' report sections');
const sections=[['rankings','Rankings'],['analysis','Flagged events'],['competitors','Competitors'],['changes','Website edits'],['research','Keyword research'],['method','Report notes']];
const panels={};for(const [id,label] of sections){const p=document.createElement('section');p.className='report-panel';p.id='view-'+id;p.setAttribute('aria-label',label);panels[id]=p;const button=document.createElement('button');button.textContent=label;button.dataset.view=id;button.onclick=()=>activate(id);nav.append(button);}
let contentStarted=false;
for(const node of old){
 if(node.tagName==='SCRIPT')continue;
 if(node.classList.contains('toolbar')||node.id==='schedule')contentStarted=true;
 if(!contentStarted){node.remove();continue;}
 if(node.id==='rankingEvents')panels.analysis.append(node);
 else if(node.id==='websiteChangeLog')panels.changes.append(node);
 else if(node.id==='competitorSection')panels.competitors.append(node);
 else if(node.tagName==='DETAILS'||node.tagName==='FOOTER'||node.id==='schedule'||node.classList.contains('note'))panels.method.append(node);
 else panels.rankings.append(node);
}
if(biz==='uwg'){
 panels.competitors.innerHTML='<h2>Local pond competitors</h2><p>Compare the same cities and keywords using the business selector in the ranking grid. All businesses use the organic results collected through position 40.</p>';
 const list=document.createElement('div');list.className='toolbar';for(const c of DATA.competitors.filter(c=>c.id!=='uwg')){const b=document.createElement('button');b.textContent=c.name;b.onclick=()=>{document.getElementById('business').value=c.id;document.getElementById('business').dispatchEvent(new Event('change'));activate('rankings',true);};list.append(b);}panels.competitors.append(list);
}else{
 // The report title already identifies the business; remove the redundant button.
 document.getElementById(biz)?.setAttribute('hidden','');
}
panels.research.innerHTML=`<h2>${names[biz]} · Keyword research</h2><p>Review keyword priorities, search demand and the proposed tracking cadence.</p><a href="${biz==='uwg'?'uwg-keyword-research.html':biz+'-keyword-research.html'}">Open ${names[biz]} keyword research →</a>`;
const notesTitle=document.createElement('h2');notesTitle.textContent='Report notes & collection details';panels.method.prepend(notesTitle);
const dates=document.createElement('p');dates.className='fine';const scanDates=[...new Set(DATA.rows.map(r=>r.current?.timestamp).filter(Boolean).map(t=>new Intl.DateTimeFormat('en-US',{timeZone:'America/Denver',month:'short',day:'numeric',year:'numeric'}).format(new Date(t.replace(' ','T').replace(/ ([+-])/,'$1')))))];dates.textContent='Observation dates: '+scanDates.join(' · ')+' (Mountain Time) · Google organic positions 1–40';panels.rankings.prepend(dates);
main.prepend(header,nav);for(const p of Object.values(panels))main.append(p);
function activate(id,keepCompany=false){if(!panels[id])id='rankings';for(const [k,p] of Object.entries(panels))p.hidden=k!==id;nav.querySelectorAll('button').forEach(b=>b.setAttribute('aria-current',b.dataset.view===id?'page':'false'));if(id==='rankings'&&biz==='uwg'&&!keepCompany){document.getElementById('business').value='uwg';document.getElementById('business').dispatchEvent(new Event('change'));}history.replaceState(null,'','#'+id);}
window.ReportNavigation={activate};
document.addEventListener('click',e=>{if(e.target.closest('[data-event]'))activate('rankings',true);});
const initial=location.hash.slice(1);activate(initial==='websiteChangeLog'?'changes':initial==='competitorSection'?'competitors':initial);
document.title=names[biz]+' · Organic ranking report';
})();

(()=>{const s=document.createElement("script");s.src="dashboard-experience.js";document.body.append(s)})();
