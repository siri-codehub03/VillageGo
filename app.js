const STORAGE_KEY = "villagego_demo_v1";

const initialProducts = [
  {id:"veg-tomato",name:"Tomatoes",category:"Vegetables",emoji:"🍅",price:32,unit:"kg",seller:"Green Basket",tag:"Fresh pick"},
  {id:"veg-potato",name:"Potatoes",category:"Vegetables",emoji:"🥔",price:28,unit:"kg",seller:"Green Basket",tag:"Daily need"},
  {id:"veg-spinach",name:"Leafy greens",category:"Vegetables",emoji:"🥬",price:20,unit:"bunch",seller:"Lakshmi Veg Stall",tag:"Local"},
  {id:"veg-onion",name:"Onions",category:"Vegetables",emoji:"🧅",price:36,unit:"kg",seller:"Green Basket",tag:"Popular"},
  {id:"fruit-banana",name:"Bananas",category:"Fruits",emoji:"🍌",price:40,unit:"dozen",seller:"Sri Fruit Shop",tag:"Seasonal"},
  {id:"fruit-mango",name:"Mangoes",category:"Fruits",emoji:"🥭",price:90,unit:"kg",seller:"Sri Fruit Shop",tag:"Seasonal"},
  {id:"fruit-apple",name:"Apples",category:"Fruits",emoji:"🍎",price:140,unit:"kg",seller:"Sri Fruit Shop",tag:"Fresh"},
  {id:"fruit-watermelon",name:"Watermelon",category:"Fruits",emoji:"🍉",price:35,unit:"each",seller:"Lakshmi Veg Stall",tag:"Summer"},
  {id:"juice-lime",name:"Fresh lime juice",category:"Juice",emoji:"🍋",price:25,unit:"cup",seller:"Cool Sip Juice Stall",tag:"Made fresh"},
  {id:"juice-watermelon",name:"Watermelon juice",category:"Juice",emoji:"🍉",price:40,unit:"cup",seller:"Cool Sip Juice Stall",tag:"Made fresh"},
  {id:"juice-sugarcane",name:"Sugarcane juice",category:"Juice",emoji:"🥤",price:30,unit:"glass",seller:"Raju Street Juice",tag:"Local favourite"},
  {id:"juice-orange",name:"Orange juice",category:"Juice",emoji:"🍊",price:45,unit:"cup",seller:"Raju Street Juice",tag:"Made fresh"},
  {id:"grocery-rice",name:"Rice",category:"Groceries",emoji:"🍚",price:65,unit:"kg",seller:"Village Mart",tag:"Daily need"},
  {id:"grocery-milk",name:"Milk",category:"Groceries",emoji:"🥛",price:30,unit:"packet",seller:"Village Mart",tag:"Chilled"},
  {id:"grocery-biscuits",name:"Biscuits",category:"Groceries",emoji:"🍪",price:10,unit:"pack",seller:"Village Mart",tag:"Snack"},
  {id:"grocery-oil",name:"Cooking oil",category:"Groceries",emoji:"🫙",price:145,unit:"litre",seller:"Village Mart",tag:"Kitchen"}
];

const sampleOrders = [
  {id:"VG-1001",items:[{productId:"veg-tomato",qty:2},{productId:"fruit-banana",qty:1}],customer:"Demo Customer",address:"Sample village · Street 2",status:"Ready for pickup",deliveryFee:20,createdAt:Date.now()-1000*60*18,partner:null},
  {id:"VG-1002",items:[{productId:"juice-lime",qty:2},{productId:"juice-sugarcane",qty:1}],customer:"Demo Customer",address:"Sample village · Main road",status:"Accepted by shop",deliveryFee:15,createdAt:Date.now()-1000*60*9,partner:null}
];

function freshState(){return {products:initialProducts,orders:sampleOrders,cart:{},category:"All",search:"",nextOrder:1003};}
function loadState(){
  try { const raw=localStorage.getItem(STORAGE_KEY); if(raw){const parsed=JSON.parse(raw); if(parsed&&Array.isArray(parsed.products)&&Array.isArray(parsed.orders))return parsed;} } catch(e){}
  return freshState();
}
let state=loadState();
let currentView="customer";
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}
function money(n){return "₹"+Number(n).toLocaleString("en-IN",{maximumFractionDigits:2});}
function productById(id){return state.products.find(p=>p.id===id);}
function itemTotal(item){const p=productById(item.productId);return p?p.price*item.qty:0;}
function orderSubtotal(order){return order.items.reduce((sum,item)=>sum+itemTotal(item),0);}
function orderTotal(order){return orderSubtotal(order)+(order.deliveryFee||0);}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function toast(message){const el=document.getElementById("toast");el.textContent=message;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),2700);}
function setView(view){
  currentView=view;
  document.querySelectorAll(".role-tab").forEach(b=>{const active=b.dataset.view===view;b.classList.toggle("active",active);b.setAttribute("aria-selected",String(active));});
  ["customer","seller","delivery","admin"].forEach(v=>document.getElementById(v+"View").classList.toggle("hidden",v!==view));
  renderAll();
}
function renderProducts(){
  const query=state.search.toLowerCase().trim();
  const products=state.products.filter(p=>(state.category==="All"||p.category===state.category)&&(!query||[p.name,p.category,p.seller].some(x=>x.toLowerCase().includes(query))));
  document.getElementById("productGrid").innerHTML=products.length?products.map(p=>`
    <article class="product-card">
      <div class="product-visual"><span class="tag">${escapeHtml(p.tag)}</span><span>${p.emoji}</span></div>
      <h3>${escapeHtml(p.name)}</h3><p class="seller-name">${escapeHtml(p.seller)} · ${escapeHtml(p.category)}</p>
      <div class="product-bottom"><span class="price">${money(p.price)} <small>/ ${escapeHtml(p.unit)}</small></span><button class="add-button" data-add="${p.id}">+ Add</button></div>
    </article>`).join(""):`<div class="no-orders" style="grid-column:1/-1">No items match your search. Try another name or category.</div>`;
  document.querySelectorAll("[data-add]").forEach(b=>b.addEventListener("click",()=>addToCart(b.dataset.add)));
}
function addToCart(id){state.cart[id]=(state.cart[id]||0)+1;save();renderCart();toast(productById(id).name+" added to cart");}
function changeQty(id,delta){state.cart[id]=(state.cart[id]||0)+delta;if(state.cart[id]<=0)delete state.cart[id];save();renderCart();}
function renderCart(){
  const entries=Object.entries(state.cart).filter(([id,qty])=>productById(id)&&qty>0);
  const count=entries.reduce((n,[id,q])=>n+q,0);
  const subtotal=entries.reduce((n,[id,q])=>n+productById(id).price*q,0);
  document.getElementById("cartCount").textContent=count;
  document.getElementById("cartTotal").textContent=money(subtotal+(count?20:0));
  document.getElementById("checkoutBtn").disabled=!count;
  document.getElementById("cartItems").innerHTML=entries.length?entries.map(([id,qty])=>{const p=productById(id);return `<div class="cart-item"><span class="cart-emoji">${p.emoji}</span><div><strong>${escapeHtml(p.name)}</strong><small>${money(p.price)} / ${escapeHtml(p.unit)}</small></div><div class="qty-controls"><button data-qty="${id}" data-delta="-1" aria-label="Decrease ${escapeHtml(p.name)}">−</button><span>${qty}</span><button data-qty="${id}" data-delta="1" aria-label="Increase ${escapeHtml(p.name)}">+</button></div><span class="line-total">${money(p.price*qty)}</span></div>`}).join(""):`<p class="empty-state">Your cart is empty. Add something fresh!</p>`;
  document.querySelectorAll("[data-qty]").forEach(b=>b.addEventListener("click",()=>changeQty(b.dataset.qty,Number(b.dataset.delta))));
}
function checkout(){
  const items=Object.entries(state.cart).filter(([id,q])=>productById(id)&&q>0).map(([productId,qty])=>({productId,qty}));
  if(!items.length)return;
  const order={id:"VG-"+state.nextOrder++,items,customer:"Demo Customer",address:"Sample village · address not collected in demo",status:"New order",deliveryFee:20,createdAt:Date.now(),partner:null};
  state.orders.unshift(order);state.cart={};save();renderAll();toast("Demo order "+order.id+" created. No real delivery was requested.");document.getElementById("sellerView").scrollIntoView({behavior:"smooth",block:"start"});
}
function formatDate(t){return new Date(t).toLocaleString("en-IN",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"});}
function statusClass(status){return status.toLowerCase().replaceAll(" ","-");}
function orderItemsText(order){return order.items.map(i=>{const p=productById(i.productId);return p?`${i.qty} × ${p.name}`:"Removed item";}).join(", ");}
function orderCard(order,mode){
  let actions="";
  if(mode==="seller"){
    if(order.status==="New order")actions=`<button class="mini-button main" data-action="accept-shop" data-id="${order.id}">Accept & prepare</button>`;
    else if(order.status==="Accepted by shop")actions=`<button class="mini-button main" data-action="mark-ready" data-id="${order.id}">Mark ready</button>`;
    else actions=`<span class="muted">Waiting for delivery</span>`;
  } else if(mode==="delivery"){
    if(order.status==="Ready for pickup")actions=`<button class="mini-button main" data-action="accept-delivery" data-id="${order.id}">Accept delivery</button>`;
    else if(order.status==="Delivery accepted")actions=`<button class="mini-button main" data-action="picked-up" data-id="${order.id}">Mark picked up</button>`;
    else if(order.status==="Picked up")actions=`<button class="mini-button main" data-action="delivered" data-id="${order.id}">Complete delivery</button>`;
    else if(order.status==="Delivered")actions=`<span class="status delivered">Completed</span>`;
    else actions=`<span class="muted">Shop preparing</span>`;
  }
  return `<article class="order-card"><div class="order-main"><span class="order-id">${order.id} · ${formatDate(order.createdAt)}</span><h4>${escapeHtml(orderItemsText(order))}</h4><p>📍 ${escapeHtml(order.address)}</p><div class="order-meta"><span class="status ${statusClass(order.status)}">${escapeHtml(order.status)}</span><span class="muted">Items ${money(orderSubtotal(order))} · Delivery ${money(order.deliveryFee)}</span>${order.partner?`<span class="muted">Partner: ${escapeHtml(order.partner)}</span>`:""}</div></div><div class="order-actions">${actions}</div></article>`;
}
function bindOrderActions(){
  document.querySelectorAll("[data-action]").forEach(b=>b.addEventListener("click",()=>{
    const order=state.orders.find(o=>o.id===b.dataset.id);if(!order)return;
    const transitions={"accept-shop":["New order","Accepted by shop"],"mark-ready":["Accepted by shop","Ready for pickup"],"accept-delivery":["Ready for pickup","Delivery accepted"],"picked-up":["Delivery accepted","Picked up"],"delivered":["Picked up","Delivered"]};
    const t=transitions[b.dataset.action];if(!t||order.status!==t[0]){toast("This order status has changed. Refresh the view.");return;}
    order.status=t[1];if(b.dataset.action==="accept-delivery")order.partner="Demo Delivery Partner";
    save();renderAll();toast(order.id+" updated: "+order.status);
  }));
}
function renderStats(target,stats){document.getElementById(target).innerHTML=stats.map(s=>`<div class="stat-card"><small>${s.label}</small><strong>${s.value}</strong><span>${s.note}</span></div>`).join("");}
function renderSeller(){
  const active=state.orders.filter(o=>o.status!=="Delivered").length;
  const newOrders=state.orders.filter(o=>o.status==="New order").length;
  const sales=state.orders.filter(o=>["Delivered","Picked up","Delivery accepted"].includes(o.status)).reduce((n,o)=>n+orderSubtotal(o),0);
  renderStats("sellerStats",[{label:"Open orders",value:active,note:"Orders not delivered"},{label:"Need attention",value:newOrders,note:"New orders"},{label:"Order value in progress",value:money(sales),note:"Demo subtotal, not payout"}]);
  const orders=[...state.orders].sort((a,b)=>b.createdAt-a.createdAt);
  document.getElementById("sellerOrders").innerHTML=orders.length?orders.map(o=>orderCard(o,"seller")).join(""):`<div class="no-orders">No orders yet. Create one from the Customer view.</div>`;
}
function renderDelivery(){
  const available=state.orders.filter(o=>o.status==="Ready for pickup").length;
  const active=state.orders.filter(o=>["Delivery accepted","Picked up"].includes(o.status)).length;
  const earned=state.orders.filter(o=>o.status==="Delivered"&&o.partner==="Demo Delivery Partner").reduce((n,o)=>n+o.deliveryFee,0);
  renderStats("deliveryStats",[{label:"Available jobs",value:available,note:"Ready to be picked up"},{label:"Your active jobs",value:active,note:"Accepted or in transit"},{label:"Demo delivery fees earned",value:money(earned),note:"Only completed demo deliveries"}]);
  document.getElementById("deliveryOrders").innerHTML=state.orders.length?[...state.orders].sort((a,b)=>b.createdAt-a.createdAt).map(o=>orderCard(o,"delivery")).join(""):`<div class="no-orders">No orders available yet. Place a demo order from Customer view.</div>`;
}
function renderAdmin(){
  const delivered=state.orders.filter(o=>o.status==="Delivered").length;
  const gross=state.orders.reduce((n,o)=>n+orderSubtotal(o),0);
  const fees=state.orders.reduce((n,o)=>n+(o.deliveryFee||0),0);
  renderStats("adminStats",[{label:"Total orders",value:state.orders.length,note:"In this browser's demo"},{label:"Delivered",value:delivered,note:"Completed orders"},{label:"Listed products",value:state.products.length,note:"Across 4 categories"}]);
  document.getElementById("adminOrders").innerHTML=state.orders.length?[...state.orders].sort((a,b)=>b.createdAt-a.createdAt).map(o=>`<article class="order-card"><div class="order-main"><span class="order-id">${o.id} · ${formatDate(o.createdAt)}</span><h4>${escapeHtml(orderItemsText(o))}</h4><p>${escapeHtml(o.customer)} · ${escapeHtml(o.address)}</p><div class="order-meta"><span class="status ${statusClass(o.status)}">${escapeHtml(o.status)}</span><span class="muted">Total ${money(orderTotal(o))}</span>${o.partner?`<span class="muted">Partner: ${escapeHtml(o.partner)}</span>`:""}</div></div></article>`).join(""):`<div class="no-orders">No orders yet.</div>`;
  document.getElementById("exportCsv").dataset.gross=gross;document.getElementById("exportCsv").dataset.fees=fees;
}
function renderAll(){renderProducts();renderCart();renderSeller();renderDelivery();renderAdmin();}
function exportCsv(){
  const rows=[["Order ID","Created at","Items","Status","Items subtotal INR","Delivery fee INR","Order total INR","Delivery partner"]];
  state.orders.forEach(o=>rows.push([o.id,new Date(o.createdAt).toISOString(),orderItemsText(o),o.status,orderSubtotal(o),o.deliveryFee,orderTotal(o),o.partner||""]));
  const csv=rows.map(row=>row.map(v=>`"${String(v).replaceAll('"','""')}"`).join(",")).join("\r\n");
  const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="villagego-demo-orders.csv";a.click();URL.revokeObjectURL(url);toast("Orders CSV exported");
}
document.querySelectorAll(".role-tab").forEach(b=>b.addEventListener("click",()=>setView(b.dataset.view)));
document.querySelectorAll(".category-tab").forEach(b=>b.addEventListener("click",()=>{state.category=b.dataset.category;document.querySelectorAll(".category-tab").forEach(x=>x.classList.toggle("active",x===b));renderProducts();}));
document.getElementById("searchInput").addEventListener("input",e=>{state.search=e.target.value;renderProducts();});
document.getElementById("clearCart").addEventListener("click",()=>{state.cart={};save();renderCart();toast("Cart cleared");});
document.getElementById("checkoutBtn").addEventListener("click",checkout);
document.getElementById("exportCsv").addEventListener("click",exportCsv);
document.getElementById("resetDemo").addEventListener("click",()=>{if(confirm("Reset VillageGo demo data and remove your demo orders?")){state=freshState();save();document.getElementById("searchInput").value="";document.querySelectorAll(".category-tab").forEach(b=>b.classList.toggle("active",b.dataset.category==="All"));setView("customer");toast("Demo data reset");}});
renderAll();
