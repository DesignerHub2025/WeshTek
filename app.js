'use strict';
// WeshTek catalogue — data grounded in the product photos supplied by the store.
// The only published price is the owner-confirmed Pack WeshTek: 4500 DZD.
// Individual prices, delivery costs and stock availability are not asserted.
const products = [
  {id:'ventouses', name:'Accessoires à ventouses colorés',category:'Gadgets', subtitle:'Plusieurs couleurs visibles sur la photo',short:'Plaquettes à ventouses · choix de couleurs',tags:['Multicolore','À confirmer'],photos:['grip.webp'],background:'silver',description:'Lot d’accessoires à ventouses souples en plusieurs couleurs, présenté sur la photo. L’usage exact, les dimensions et les couleurs disponibles sont à confirmer directement avec WeshTek.'},
  {id:'pack-weshtek',name:'Pack WeshTek — 4 essentiels',category:'Packs',subtitle:'1 câble HOCO + 1 coque Panda + 1 paire NG N75 + 1 accessoire à ventouses',short:'Le pack complet : coque, écouteurs Bluetooth, câble et accessoire arrière.',tags:['4 essentiels','Offre spéciale'],photos:['pack-weshtek-4500.webp','panda-blue.webp','earbuds.webp','lightning.webp','grip.webp'],background:'pack-bg',price:4500,isPromo:true,description:'Le pack comprend 1 coque Panda magnétique (modèle compatible à vérifier), 1 paire d’écouteurs sans fil NG N75, 1 câble de charge HOCO U129 (connexion USB-A vers iP ou USB-C selon le choix et la disponibilité) et 1 accessoire arrière à ventouses (couleur à confirmer). Le visuel est une composition promotionnelle : les couleurs et références exactes sont à valider lors de la commande. Prix du pack : 4 500 DA, hors éventuels frais de livraison.'},
  {id:'panda-choice',name:'Coques Panda · plusieurs modèles',category:'Protection',subtitle:'Choix de couleurs et modèles à confirmer',short:'Variantes photographiées · violet, bleu, foncé',tags:['Plusieurs couleurs','Selon modèle'],photos:['panda-range.webp','panda-blue.webp'],background:'lilac',description:'La photo présente plusieurs variantes Panda. Une boîte violette porte la mention iPhone 14 Pro Max et la boîte bleue iPhone 13 Pro. Les autres modèles, couleurs et stocks sont à confirmer avec WeshTek.'},
  {id:'ng-n75',name:'Écouteurs sans fil NG N75',category:'Audio',subtitle:'NG Electro · modèle N75',short:'Écouteurs sans fil avec boîtier de recharge',tags:['Sans fil','N75'],photos:['earbuds.webp'],background:'pearl',description:'Écouteurs sans fil NG Electro, modèle N75. La boîte mentionne des commandes tactiles. Autonomie, connectivité et autres spécifications à vérifier auprès de WeshTek.'},
  {id:'hoco-ip',name:'Câble HOCO U129 USB-A → iP',category:'Charge',subtitle:'1,2 m · 2,4 A indiqués sur la boîte',short:'Câble de charge tressé, connecteur iP',tags:['1,2 m','2,4 A'],photos:['lightning.webp'],background:'sky',description:'Câble HOCO U129 Crystal, USB-A vers connecteur iP (Lightning). Sur la boîte : longueur 1,2 m et 2,4 A. La compatibilité exacte et le stock sont à confirmer.'},
  {id:'hoco-usbc',name:'Câble HOCO U129 USB-C → USB-C',category:'Charge',subtitle:'1,2 m · 60 W indiqués sur la boîte',short:'Câble de charge tressé USB-C',tags:['1,2 m','60 W'],photos:['usbc.webp'],background:'amber',description:'Câble HOCO U129 Crystal, USB-C vers USB-C. L’emballage affiche 1,2 m et 60 W. La puissance réelle dépend aussi du chargeur et de l’appareil compatibles.'},
];
const categories=['Tous','Packs','Protection','Audio','Charge','Gadgets'];
const instagram='https://www.instagram.com/wesh.tek';
const money=n=>`${new Intl.NumberFormat('fr-FR',{maximumFractionDigits:0}).format(n).replace(/[\u00a0\u202f]/g,' ')} DA`;
const $=(id)=>document.getElementById(id);
let currentCategory='Tous';
let currentDetail=null;
let currentPhoto=0;
let cart=[];
try{const saved=JSON.parse(localStorage.getItem('weshtek-cart-v2')||'[]');if(Array.isArray(saved))cart=saved.filter(x=>x&&products.some(p=>p.id===x.id)&&Number.isInteger(x.qty)&&x.qty>0).map(x=>({id:x.id,qty:Math.min(99,x.qty)}));}catch(_){cart=[];}
// Convert old placeholder demo-cart ids neither to genuine products nor imaginary orders.
let toastTimer=null;
function toast(message){const el=$('toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3100)}
function photo(filename){return 'assets/products/'+filename}
function renderFilters(){ $('filterTabs').innerHTML=categories.map(c=>`<button type="button" class="filter-tab ${currentCategory===c?'active':''}" data-filter="${c}" aria-pressed="${currentCategory===c}">${c}</button>`).join('');}
function renderProducts(){
  const q=$('searchInput').value.toLocaleLowerCase('fr').trim();
  const list=products.filter(p=>(currentCategory==='Tous'||p.category===currentCategory)&&[p.name,p.subtitle,p.category,p.short,p.tags.join(' '),p.description].join(' ').toLocaleLowerCase('fr').includes(q));
  $('productCount').textContent=`${list.length} produit${list.length>1?'s':''}`;
  $('productGrid').innerHTML=list.map(p=>{
    const no=String(products.findIndex(x=>x.id===p.id)+1).padStart(2,'0');
    const price=Number.isFinite(p.price)?money(p.price):'Prix sur demande';
    const availability=p.price?'Choix et livraison à confirmer':'Disponibilité à confirmer';
    const imageLabel=p.isPromo?'VISUEL PROMO':'PHOTO RÉELLE';
    return `<article class="product-card ${p.isPromo?'pack-card':''}"><div class="product-image ${p.background}"><span class="product-index">${no} / ${String(products.length).padStart(2,'0')}</span><span class="photo-label ${p.isPromo?'promo-photo-label':''}">${imageLabel}</span><img src="${photo(p.photos[0])}" alt="${p.isPromo?'Composition du Pack WeshTek':p.name}" loading="lazy"></div><div class="product-body"><div class="product-category">${p.isPromo?'★ OFFRE DU MOMENT':p.category+' / WESHTEK'}</div><h3>${p.name}</h3><p>${p.short}</p><div class="product-chips">${p.tags.map(t=>`<span>${t}</span>`).join('')}</div><div class="product-price"><div><strong class="${p.isPromo?'featured-price':''}">${price}</strong><small>${availability}</small></div><div class="product-buttons"><button class="view-button" data-detail="${p.id}" type="button" aria-label="Voir les détails de ${p.name}">Voir</button><button class="add-button" data-add="${p.id}" type="button" aria-label="Ajouter ${p.name} au panier">+ Ajouter</button></div></div></div></article>`;
  }).join('')||'<div class="no-results">Aucun article trouvé. Essaie un autre mot ou une autre catégorie.</div>';
}
function setCategory(c){if(!categories.includes(c))return;currentCategory=c;renderFilters();renderProducts();}
function saveCart(){try{localStorage.setItem('weshtek-cart-v2',JSON.stringify(cart))}catch(_){/* local storage may be disabled */}renderCart()}
function changeQty(id,delta){const row=cart.find(x=>x.id===id);if(!row){if(delta>0)cart.push({id,qty:1})}else{row.qty=Math.max(0,Math.min(99,row.qty+delta));if(row.qty===0)cart=cart.filter(x=>x.id!==id)}saveCart()}
function addToCart(id){if(!products.some(p=>p.id===id))return;changeQty(id,1);toast('Ajouté à ta sélection ✓');}
function renderCart(){
  const qty=cart.reduce((sum,x)=>sum+x.qty,0);
  $('cartCount').textContent=qty; $('drawerQty').textContent=`(${qty})`;
  $('cartLines').innerHTML=cart.length?cart.map(line=>{
    const p=products.find(x=>x.id===line.id);
    const label=Number.isFinite(p.price)?`${money(p.price)} × ${line.qty} = ${money(p.price*line.qty)}`:'Prix à confirmer';
    return `<div class="cart-line"><img src="${photo(p.photos[0])}" alt="${p.name}"><div class="line-copy"><strong>${p.name}</strong><small>${label}</small><div class="qty"><button type="button" data-decrease="${p.id}" aria-label="Diminuer ${p.name}">−</button><span>${line.qty}</span><button type="button" data-increase="${p.id}" aria-label="Augmenter ${p.name}">+</button><button class="remove" type="button" data-remove="${p.id}">Retirer</button></div></div></div>`;
  }).join(''):'<div class="empty-cart"><b>Pas encore de coup de cœur ?</b>Explore les produits et prépare ta sélection.</div>';
  const known=cart.reduce((sum,line)=>{const p=products.find(x=>x.id===line.id);return sum+(p.price||0)*line.qty},0);
  const unknown=cart.some(line=>!Number.isFinite(products.find(x=>x.id===line.id).price));
  const totalNode=$('cartTotal');
  totalNode.hidden=!cart.length;
  totalNode.innerHTML=cart.length?`<span>${unknown?'Sous-total des articles tarifés':'Sous-total des produits'}</span><strong>${money(known)}</strong><small>${unknown?'Autres prix à confirmer · ':''}Hors frais éventuels de livraison</small>`:'';
  $('copyCart').disabled=cart.length===0;$('copyCart').style.opacity=cart.length?1:.48;
}
function toggleCart(open){$('cartOverlay').hidden=!open;$('cartDrawer').classList.toggle('open',open);$('cartDrawer').setAttribute('aria-hidden',String(!open));document.body.classList.toggle('modal-open',open);if(open){closeDetail();$('closeCart').focus()}else{$('cartToggle').focus()}}
function buildRequest(){
  let known=0;let hasUnknown=false;
  const lines=cart.map(line=>{
    const p=products.find(x=>x.id===line.id);
    if(Number.isFinite(p.price)){known+=p.price*line.qty;return `• ${p.name} × ${line.qty} — ${money(p.price*line.qty)}`}
    hasUnknown=true;return `• ${p.name} × ${line.qty} — prix à confirmer`;
  });
  let message=`Salam WeshTek ! 👋\nJe voudrais commander les articles suivants :\n${lines.join('\n')}`;
  if(known)message+=`\n${hasUnknown?'Sous-total des articles tarifés':'Sous-total des articles'} : ${money(known)}`;
  message+='\nMerci de me confirmer les modèles, couleurs, disponibilités et frais de livraison. 🙏';
  return message;
}
async function copyRequest(){if(!cart.length){toast('Choisis au moins un produit.');return;}const value=buildRequest();let done=false;try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(value);done=true}}catch(_){}if(!done){const ta=document.createElement('textarea');ta.value=value;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();try{done=document.execCommand('copy')}catch(_){}ta.remove();}if(done){toast('Demande copiée ✓ Colle-la dans ton DM Instagram.')}else{window.prompt('Copie ce message, puis colle-le sur Instagram :',value)}}
function showPhoto(idx){if(!currentDetail)return;currentPhoto=idx;const p=currentDetail;$('detailImage').src=photo(p.photos[idx]);$('detailImage').alt=p.name+' — photo '+(idx+1);$('detailThumbs').innerHTML=p.photos.map((f,i)=>`<button type="button" data-photo="${i}" class="${i===idx?'active':''}" aria-label="Voir photo ${i+1}"><img src="${photo(f)}" alt=""></button>`).join('')}
function openDetail(id){const p=products.find(x=>x.id===id);if(!p)return;toggleCart(false);currentDetail=p;$('detailCategory').textContent='WESHTEK / '+p.category;$('detailTitle').textContent=p.name;$('detailSubtitle').textContent=p.subtitle;$('detailBadges').innerHTML=p.tags.map(x=>`<span>${x}</span>`).join('');$('detailDesc').textContent=p.description;$('detailPrice').textContent=Number.isFinite(p.price)?money(p.price):'Prix sur demande';$('detailAvailability').textContent=p.isPromo?'Hors livraison · variantes à confirmer':'Disponibilité à vérifier';$('detailAdd').setAttribute('data-add',p.id);showPhoto(0);$('detailOverlay').hidden=false;$('detailDialog').classList.add('open');$('detailDialog').setAttribute('aria-hidden','false');document.body.classList.add('modal-open');$('closeDetail').focus()}
function closeDetail(){if(!$('detailDialog').classList.contains('open'))return;$('detailOverlay').hidden=true;$('detailDialog').classList.remove('open');$('detailDialog').setAttribute('aria-hidden','true');document.body.classList.remove('modal-open');currentDetail=null;}
$('filterTabs').addEventListener('click',ev=>{const b=ev.target.closest('[data-filter]');if(b)setCategory(b.dataset.filter)});
$('searchInput').addEventListener('input',renderProducts);
$('productGrid').addEventListener('click',ev=>{const add=ev.target.closest('[data-add]');const detail=ev.target.closest('[data-detail]');if(add)addToCart(add.dataset.add);else if(detail)openDetail(detail.dataset.detail)});
document.querySelectorAll('[data-category]').forEach(el=>el.addEventListener('click',()=>{setCategory(el.dataset.category);$('produits').scrollIntoView({behavior:'smooth'})}));
$('cartToggle').addEventListener('click',()=>toggleCart(true));$('closeCart').addEventListener('click',()=>toggleCart(false));$('cartOverlay').addEventListener('click',()=>toggleCart(false));$('copyCart').addEventListener('click',copyRequest);
$('cartLines').addEventListener('click',ev=>{const b=ev.target.closest('button');if(!b)return;if(b.dataset.increase)changeQty(b.dataset.increase,1);if(b.dataset.decrease)changeQty(b.dataset.decrease,-1);if(b.dataset.remove)changeQty(b.dataset.remove,-99)});
$('detailOverlay').addEventListener('click',closeDetail);$('closeDetail').addEventListener('click',closeDetail);
$('detailAdd').addEventListener('click',()=>{if(!currentDetail)return;addToCart(currentDetail.id);closeDetail();toggleCart(true)});
$('detailThumbs').addEventListener('click',ev=>{const b=ev.target.closest('[data-photo]');if(b)showPhoto(Number(b.dataset.photo))});
document.addEventListener('keydown',ev=>{if(ev.key==='Escape'){if($('detailDialog').classList.contains('open'))closeDetail();else if($('cartDrawer').classList.contains('open'))toggleCart(false)}});
$('year').textContent=new Date().getFullYear();renderFilters();renderProducts();renderCart();
