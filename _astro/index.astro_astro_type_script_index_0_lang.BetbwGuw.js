const p=JSON.parse(document.getElementById("notes-data").textContent);document.getElementById("notes-data").remove();const f=p.days,b=p.pageSize,$=p.avatar,E=p.author;let u="all",i=1;function x(){return u==="all"?f:f.map(t=>({...t,notes:t.notes.filter(e=>e.tags.includes(u))})).filter(t=>t.notes.length>0)}function y(t){const e=[];for(let a=0;a<t.length;a+=b)e.push(t.slice(a,a+b));return e}function d(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function L(t){return`
      <div class="moment-card" data-tags="${d(t.tags.join(","))}">
        <div class="moment-left">
          <div class="avatar">
            <img src="${d($)}" alt="avatar" />
          </div>
        </div>
        <div class="moment-body">
          <div class="moment-header">
            <span class="moment-name">${d(E)}</span>
            <span class="moment-time">${d(t.time)}</span>
          </div>
          ${t.content?`
            <div class="moment-text-wrap">
              <div class="moment-text collapse-text">${t.content}</div>
              <button class="expand-btn" aria-label="展开">展开</button>
            </div>`:""}
          ${t.images.length>0?`
            <div class="moment-images img-grid-${t.images.length===1?1:t.images.length===2?2:t.images.length===3?3:t.images.length===4?4:"multi"}">
              ${t.images.map(e=>`
                <div class="img-wrapper">
                  <img src="${d(e)}" alt="" loading="lazy" />
                </div>`).join("")}
            </div>`:""}
          ${t.tags.length>0?`
            <div class="moment-tags">
              ${t.tags.map(e=>`<span class="note-tag" data-tag="${d(e)}">#${d(e)}</span>`).join("")}
            </div>`:""}
        </div>
        <div class="moment-actions">
          <button class="copy-btn" title="复制" data-content="${d(t.content)}">
            <svg width="1em" height="1em" viewBox="0 0 24 24" class="text-[0.85rem]" data-icon="material-symbols:content-copy-outline-rounded"><path fill="currentColor" d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m0 16H8V7h11z"/></svg>
          </button>
        </div>
      </div>`}function B(t){return`
      <div class="day-section" id="day-${t.date}">
        <div class="day-divider">
          <span class="day-badge">${d(w(t.date))} ${d(t.weekday)}</span>
        </div>
        ${t.notes.map(L).join("")}
      </div>`}function m(){const t=x(),e=y(t);i>e.length&&(i=Math.max(1,e.length));const a=document.getElementById("notes-stream");document.getElementById("notes-pagination");const l=document.getElementById("date-nav-list");e.length===0?a.innerHTML=`<div class="card-base empty-state py-12">
        <svg width="3rem" height="3rem" viewBox="0 0 24 24" class="text-[3rem] opacity-30" data-icon="material-symbols:note-add"><path fill="currentColor" d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3zm-6 12q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h6v2H5v14h14v-8h2v8q0 .825-.587 1.413T19 21z"/></svg>
        <p class="text-50 mt-2">还没有笔记</p>
      </div>`:a.innerHTML=e[i-1].map(B).join("");const g=e[i-1]||[];l.innerHTML=g.map(s=>`<a href="#day-${s.date}" class="date-link" data-date="${s.date}">
         <span>${d(w(s.date))} ${d(s.weekday)}</span>
       </a>`).join(""),I(e.length),q(),A()}function I(t){const e=document.getElementById("notes-pagination");if(t<=1){e.innerHTML="";return}const a=-1,g=2*2+1;let s=1,r=i,o=i;for(;0<r-1&&o+1<=t&&s+2<=g;)s+=2,r--,o++;for(;0<r-1&&s<g;)s++,r--;for(;o+1<=t&&s<g;)s++,o++;const n=[];r>1&&n.push(1),r===3&&n.push(2),r>3&&n.push(a);for(let c=r;c<=o;c++)n.push(c);o<t-2&&n.push(a),o===t-2&&n.push(t-1),o<t&&n.push(t);const v=i===1?"disabled":"",h=i===t?"disabled":"",T=c=>c===i?`<div class="h-11 w-11 rounded-lg bg-[#00a2e8] flex items-center justify-center font-bold text-white">${c}</div>`:`<button type="button" data-page="${c}" aria-label="第 ${c} 页" class="transition flex items-center justify-center w-11 h-11 rounded-lg overflow-hidden active:scale-[0.85] hover:bg-[var(--btn-card-bg-hover)] active:bg-[var(--btn-card-bg-active)] text-black/75 dark:text-white/75 font-bold">${c}</button>`;e.innerHTML=`
      <button type="button" id="page-prev" class="btn-card overflow-hidden rounded-lg text-[#00a2e8] w-11 h-11 ${v}" aria-label="上一页">
        <svg width="1em" height="1em" viewBox="0 0 24 24" class="text-[1.75rem]" data-icon="material-symbols:chevron-left-rounded"><path fill="currentColor" d="m10.8 12l3.9 3.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275l-4.6-4.6q-.15-.15-.212-.325T8.425 12t.063-.375t.212-.325l4.6-4.6q.275-.275.7-.275t.7.275t.275.7t-.275.7z"/></svg>
      </button>
      <div class="bg-[var(--card-bg)] flex flex-row rounded-lg items-center text-neutral-700 dark:text-neutral-300 font-bold" style="backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);">
        ${n.map(c=>c===a?'<svg width="1em" height="1em" viewBox="0 0 24 24" class="mx-1" data-icon="material-symbols:more-horiz"><path fill="currentColor" d="M6 14q-.825 0-1.412-.587T4 12t.588-1.412T6 10t1.413.588T8 12t-.587 1.413T6 14m6 0q-.825 0-1.412-.587T10 12t.588-1.412T12 10t1.413.588T14 12t-.587 1.413T12 14m6 0q-.825 0-1.412-.587T16 12t.588-1.412T18 10t1.413.588T20 12t-.587 1.413T18 14"/></svg>':T(c)).join("")}
      </div>
      <button type="button" id="page-next" class="btn-card overflow-hidden rounded-lg text-[#00a2e8] w-11 h-11 ${h}" aria-label="下一页">
        <svg width="1em" height="1em" viewBox="0 0 24 24" class="text-[1.75rem]" data-icon="material-symbols:chevron-right-rounded"><path fill="currentColor" d="M12.6 12L8.7 8.1q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.6 4.6q.15.15.213.325t.062.375t-.062.375t-.213.325l-4.6 4.6q-.275-.275-.7.275t-.7-.275t-.275-.7t.275-.7z"/></svg>
      </button>`}function w(t){const e=new Date(t+"T00:00:00");return e.getMonth()+1+"月"+e.getDate()+"日"}function q(){document.querySelectorAll(".moment-text.collapse-text").forEach(function(t){t.scrollHeight>t.clientHeight+2&&t.parentElement.querySelector(".expand-btn").classList.add("show")})}function A(){var t=document.getElementById("date-nav-toggle"),e=document.getElementById("date-nav-panel");if(!(!t||!e)){var a=t.cloneNode(!0);t.parentNode.replaceChild(a,t),t=a,t.addEventListener("click",function(l){l.stopPropagation();var g=e.classList.toggle("open");t.classList.toggle("active",g)}),document.addEventListener("click",function(l){!e.contains(l.target)&&l.target!==t&&(e.classList.remove("open"),t.classList.remove("active"))}),e.querySelectorAll(".date-link").forEach(function(l){l.addEventListener("click",function(){e.classList.remove("open"),t.classList.remove("active")})})}}document.addEventListener("click",function(t){const e=t.target.closest("[data-page]");if(e){i=parseInt(e.getAttribute("data-page"),10),m(),window.scrollTo({top:0,behavior:"smooth"});return}if(t.target.closest("#page-prev")){i>1&&(i--,m(),window.scrollTo({top:0,behavior:"smooth"}));return}if(t.target.closest("#page-next")){const n=y(x());i<n.length&&(i++,m(),window.scrollTo({top:0,behavior:"smooth"}));return}const a=t.target.closest(".tag-pill");if(a){u=a.getAttribute("data-filter")||"all",i=1,document.querySelectorAll(".tag-pill").forEach(n=>n.classList.toggle("active",n===a)),m();return}const l=t.target.closest(".note-tag");if(l){u=l.getAttribute("data-tag")||"all",i=1,document.querySelectorAll(".tag-pill").forEach(n=>n.classList.toggle("active",n.getAttribute("data-filter")===u)),m();return}const g=t.target.closest(".img-wrapper");if(g){const n=g.querySelector("img");if(n){const v=document.getElementById("note-lightbox"),h=document.getElementById("note-lightbox-img");h.src=n.src,v.classList.add("open")}return}const s=document.getElementById("note-lightbox");if(s&&s.classList.contains("open")){s.classList.remove("open");return}const r=t.target.closest(".expand-btn");if(r){const n=r.previousElementSibling;n&&(n.classList.toggle("expanded"),r.textContent=n.classList.contains("expanded")?"收起":"展开");return}const o=t.target.closest(".copy-btn");if(o){const n=o.getAttribute("data-content");n&&navigator.clipboard.writeText(n).then(function(){o.classList.add("copied"),setTimeout(function(){o.classList.remove("copied")},1500)})}});m();
