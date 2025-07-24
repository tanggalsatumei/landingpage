const sheetId="..."; const apiKey="..."; const sheet="Produk";
let keranjang=[];

async function fetchProducts(){let r=await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheet}?key=${apiKey}`);let j=await r.json();
let [h,...rows]=j.values;return rows.map(r=>Object.fromEntries(h.map((k,i)=>[k,r[i]||""])));
}

function renderProds(data){
  const c=document.getElementById('produk-container');c.innerHTML="";
  data.forEach(p=>{
    const div=document.createElement('div');div.className="col-md-4 mb-4";
    div.innerHTML=`<div class="card h-100 shadow">
      <img src="${p.gambar_url}" class="card-img-top">
      <div class="card-body">
        <h5>${p.nama_produk} <span class="badge-promo">Promo</span></h5>
        <p>${p.deskripsi}</p>
        <p><strong>Rp ${p.harga_diskon}</strong> <span class="harga-coret">Rp ${p.harga_asli}</span></p>
        <button class="btn btn-wa w-100" onclick="tambah('${p.nama_produk}',${p.harga_diskon})"><i class="bi bi-cart-plus"></i> Pesan</button>
      </div></div>`;
    c.appendChild(div);
  });
}

function tambah(n,pr){
  const ex=keranjang.find(x=>x.nama==n);
  ex?ex.qty++:keranjang.push({nama:n,qty:1,price:pr});
  updateCart();
}

function updateCart(){
  const ul=document.getElementById('keranjang-list');ul.innerHTML="";
  keranjang.forEach((item,i)=>{
    const li=document.createElement('li');li.className="list-group-item d-flex justify-content-between";
    li.innerHTML=`${item.nama} x${item.qty} <button class="btn-close btn-sm" onclick="keranjang.splice(${i},1);updateCart();"></button>`;
    ul.appendChild(li);
  });
  document.getElementById('cart-count').innerText=keranjang.reduce((s,i)=>s+i.qty,0);
  document.getElementById('pesan-semua').href="https://wa.me/?text="+encodeURIComponent(keranjang.map(i=>`${i.nama} x${i.qty}`).join("\n"));
}

function applyFilter(cat){
  fetchProducts().then(all=>{
    renderProds(all.filter(p=>(p.kategori||"").toLowerCase().includes(cat)));
  });
}

document.querySelectorAll('.promo-btn').forEach(b=>b.onclick=()=>applyFilter(b.dataset.filter));

fetchProducts().then(renderProds);

// slider
fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Slider?key=${apiKey}`)
.then(r=>r.json()).then(d=>{
  const [h,...rs]=d.values;
  const idx=h.indexOf('gambar_url'), wrap=document.getElementById('slider-images');
  wrap.innerHTML="";
  rs.forEach((r,i)=>{
    const div=document.createElement('div');
    div.className="carousel-item"+(i===0?" active":"");
    div.innerHTML=`<img src="${r[idx]}" class="d-block w-100">`;
    wrap.appendChild(div);
  });
});

// geo
if(navigator.geolocation) navigator.geolocation.getCurrentPosition(p=>{
  fetch(`https://api.opencagedata.com/geocode/v1/json?q=${p.coords.latitude}+${p.coords.longitude}&key=...`)
  .then(r=>r.json()).then(j=>{
    const c=j.results[0].components;
    document.getElementById('lokasi-user').innerText="Lokasi: "+(c.suburb||c.village||c.county||c.town);
  });
});
