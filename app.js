(()=>{
const $=s=>document.querySelector(s), N=11, KEY="gong-su-11-page-v1";
const blank=()=>Array.from({length:N},(_,i)=>({name:`멤버 ${i+1}`,photo:"",value:5,comment:""}));
let data={page:0,brand:"&TEAM",entries:blank()};
try{const old=JSON.parse(localStorage.getItem(KEY));if(old&&Array.isArray(old.entries)){data={...data,...old};data.entries=Array.from({length:N},(_,i)=>old.entries[i]||blank()[i]);}}catch(e){}
let busy=false;
function save(){try{localStorage.setItem(KEY,JSON.stringify(data));$("#saveNote").textContent="✓ 자동 저장됨";}catch(e){$("#saveNote").textContent="저장 공간이 부족합니다. 사진 크기를 줄여주세요.";}}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function current(){return data.entries[data.page];}
function valueText(v){return v<3?"L 취향":v<5?"L 쪽":v===5?"중간":v<8?"R 쪽":"R 취향";}
function fillBar(v){return Array.from({length:11},(_,i)=>`<i class="${i<=v?'on':''}"></i>`).join("");}
function render(){
 const e=current();$("#brandName").value=data.brand;$("#memberName").value=e.name;$("#comment").value=e.comment;$("#preference").value=e.value;
 $("#stepLabel").textContent=`PAGE ${String(data.page+1).padStart(2,"0")} / 11`;$("#progressPct").textContent=`${Math.round((data.page+1)/N*100)}%`;$("#progressFill").style.width=`${(data.page+1)/N*100}%`;
 $("#rangeValue").textContent=valueText(+e.value);$(".range-box").style.setProperty("--fill",`${(+e.value)/10*100}%`);
 $("#charCount").textContent=`${e.comment.length}/150`;$("#prevBtn").disabled=data.page===0;$("#nextBtn").innerHTML=data.page===N-1?'최종 결과 보기 <span>→</span>':'다음 페이지 <span>→</span>';
 $("#profilePreview").hidden=!e.photo;$("#profilePreview").src=e.photo||"";$("#avatarPlaceholder").hidden=!!e.photo;
 $("#writer").hidden=false;$("#result").hidden=true;
}
function updateField(k,v){current()[k]=v;save();}
$("#brandName").addEventListener("input",e=>{data.brand=e.target.value;save();});
$("#memberName").addEventListener("input",e=>updateField("name",e.target.value));
$("#comment").addEventListener("input",e=>{$("#charCount").textContent=`${e.target.value.length}/150`;updateField("comment",e.target.value);});
$("#preference").addEventListener("input",e=>{updateField("value",+e.target.value);$("#rangeValue").textContent=valueText(+e.target.value);$(".range-box").style.setProperty("--fill",`${(+e.target.value)/10*100}%`);});
$("#photoInput").addEventListener("change",e=>{const f=e.target.files?.[0];if(!f)return;if(!f.type.startsWith("image/"))return;const reader=new FileReader();reader.onload=()=>{const im=new Image();im.onload=()=>{const scale=Math.min(1,700/Math.max(im.width,im.height)),c=document.createElement("canvas");c.width=im.width*scale;c.height=im.height*scale;c.getContext("2d").drawImage(im,0,0,c.width,c.height);updateField("photo",c.toDataURL("image/jpeg",.82));render();};im.src=reader.result;};reader.readAsDataURL(f);e.target.value="";});
$("#prevBtn").addEventListener("click",()=>{if(data.page>0){data.page--;save();render();window.scrollTo({top:0,behavior:"smooth"});}});
$("#nextBtn").addEventListener("click",()=>{if(data.page<N-1){data.page++;save();render();window.scrollTo({top:0,behavior:"smooth"});}else showResult();});
function showResult(){
 $("#writer").hidden=true;$("#result").hidden=false;$("#resultBrand").textContent=data.brand||"&TEAM";
 $("#resultGrid").innerHTML=data.entries.map((e,i)=>`<article class="result-card">
 ${e.photo?`<img class="result-avatar" src="${e.photo}" alt="">`:`<div class="result-avatar result-placeholder">${esc((e.name||String(i+1)).slice(0,1))}</div>`}
 <div class="result-content"><div class="result-name">${esc(e.name||`멤버 ${i+1}`)}</div><div class="result-bar-label"><span>L</span><span>R</span></div><div class="result-bar">${fillBar(+e.value)}</div><div class="result-comment">${esc(e.comment||" ")}</div></div>
 </article>`).join("");
 window.scrollTo({top:0,behavior:"smooth"});
}
$("#editBtn").addEventListener("click",()=>{data.page=0;save();render();window.scrollTo({top:0,behavior:"smooth"});});
$("#pngBtn").addEventListener("click",async()=>{if(!window.html2canvas){alert("이미지 저장 라이브러리를 불러오지 못했습니다. 인터넷 연결을 확인해 주세요.");return;}try{const c=await html2canvas($("#result"),{scale:2,backgroundColor:"#ffffff",useCORS:true});const a=document.createElement("a");a.download="gong-su-preference-chart.png";a.href=c.toDataURL("image/png");a.click();}catch(e){alert("PNG 저장에 실패했습니다.");}});
render();
})();