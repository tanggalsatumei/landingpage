// js/main.js

const sheetId = '1s5PwpQqnaqRJ7DeS8rVZ1KiK-eUr2CdpFP-Uvz54Z7w';
const apiKey = 'AIzaSyAoLKn-ravRsZm2XUW_jZHlLpHhiz3MFYc';

const sheetProduk = 'Produk';
const sheetProfil = 'ProfilUMKM';
const sheetSlider = 'Slider';
const sheetGaleri = 'Galeri';
const sheetTestimoni = 'Testimoni';
const sheetLayanan = 'Layanan';
const sheetKenapa = 'KenapaKami';

let keranjang = [];

function fetchSheet(sheetName) {
  return fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`)
    .then(res => res.json())
    .then(data => {
      const [header, ...rows] = data.values;
      return rows.map(row => Object.fromEntries(header.map((h, i) => [h, row[i] || ''])));
    });
}

function renderSlider(data) {
  const wrapper = document.getElementById('slider-images');
  wrapper.innerHTML = '';
  data.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'carousel-item' + (i === 0 ? ' active' : '');
    div.innerHTML = `<img src="${item.gambar_url}" class="d-block w-100">`;
    wrapper.appendChild(div);
  });
}

function renderProduk(data) {
  const container = document.getElementById('produk-container');
  container.innerHTML = '';
  data.forEach((item, index) => {
    const col = document.createElement('div');
    col.className = 'col-md-4 mb-4';
    const hargaDiskon = item.harga_diskon || item.harga; 
    const hargaAsli = item.harga_asli || '';
    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${item.gambar_url}" class="card-img-top" alt="${item.nama_produk}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${item.nama_produk} ${item.harga_diskon ? '<span class="badge-promo">Promo</span>' : ''}</h5>
          <p class="card-text flex-grow-1">${item.deskripsi}</p>
          <p class="mb-2">
            <span class="fw-bold">Rp ${hargaDiskon}</span>
            ${hargaAsli ? `<span class="harga-coret ms-2">Rp ${hargaAsli}</span>` : ''}
          </p>
          <button class="btn btn-outline-primary btn-sm mb-2" onclick='tambahKeranjang(${JSON.stringify(item)})'>
            <i class="bi bi-cart-plus"></i> Tambah
          </button>
          <a href="${item.link_wa}" class="btn btn-wa btn-sm" target="_blank">
            <i class="bi bi-whatsapp"></i> Pesan Langsung
          </a>
        </div>
      </div>`;
    container.appendChild(col);
  });
}

function renderProfil(data) {
  const p = data[0];
  document.getElementById('judul-utama').textContent = p.judul_utama || 'Produk UMKM Garut';
  document.getElementById('deskripsi-utama').textContent = p.deskripsi || '';
  document.getElementById('tentang-umkm').textContent = p.tentang || '';
  document.getElementById('alamat-umkm').textContent = p.alamat || '';
  document.getElementById('jam-operasional').textContent = p.jam_operasional || '';
  document.getElementById('map-embed').src = `https://www.google.com/maps?q=${p.lokasi_maps}&output=embed`;
  document.getElementById('link-wa').href = `https://wa.me/${p.no_wa}`;
  document.getElementById('link-ig').href = p.link_ig;
  document.getElementById('link-fb').href = p.link_fb;
}

function renderGaleri(data) {
  const galeri = document.getElementById('galeri-container');
  galeri.innerHTML = '';
  data.forEach(item => {
    galeri.innerHTML += `<div class="col-md-4"><img src="${item.gambar_url}" alt="Galeri" /></div>`;
  });
}

function renderTestimoni(data) {
  const container = document.getElementById('testimoni-container');
  container.innerHTML = '';
  data.forEach(item => {
    container.innerHTML += `
      <div class="testimoni-card">
        <h6>${item.nama}</h6>
        <p>\"${item.ulasan}\"</p>
      </div>`;
  });
}

function renderLayanan(data) {
  const container = document.getElementById('layanan-container');
  container.innerHTML = '';
  data.forEach(item => {
    container.innerHTML += `
      <div class="col-md-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">${item.judul}</h5>
            <p>${item.deskripsi}</p>
          </div>
        </div>
      </div>`;
  });
}

function renderKenapa(data) {
  const container = document.getElementById('kenapa-container');
  container.innerHTML = '';
  data.forEach(item => {
    container.innerHTML += `<li>${item.alasan}</li>`;
  });
}

function tambahKeranjang(item) {
  const existing = keranjang.find(p => p.nama_produk === item.nama_produk);
  if (existing) existing.qty += 1;
  else keranjang.push({ ...item, qty: 1 });
  updateKeranjang();
  showNotif();
}

function ubahQty(index, delta) {
  keranjang[index].qty += delta;
  if (keranjang[index].qty <= 0) keranjang.splice(index, 1);
  updateKeranjang();
}

function showNotif() {
  const notif = document.getElementById('notif');
  notif.style.display = 'block';
  setTimeout(() => notif.style.display = 'none', 2000);
}

function updateKeranjang() {
  const list = document.getElementById('keranjang-list');
  list.innerHTML = '';
  keranjang.forEach((item, index) => {
    list.innerHTML += `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        ${item.nama_produk} (Rp ${item.harga || item.harga_diskon})
        <div>
          <button class="btn btn-sm btn-outline-secondary" onclick="ubahQty(${index}, -1)">-</button>
          <span class="mx-2">${item.qty}</span>
          <button class="btn btn-sm btn-outline-secondary" onclick="ubahQty(${index}, 1)">+</button>
        </div>
      </li>`;
  });
  document.getElementById('cart-count').textContent = keranjang.reduce((a, b) => a + b.qty, 0);
  const text = keranjang.map(p => `- ${p.nama_produk} (${p.harga || p.harga_diskon}) x${p.qty}`).join('\n');
  document.getElementById('pesan-semua').href = `https://wa.me/6281234567890?text=${encodeURIComponent(text)}`;
}

function initGeolokasi() {
  const loc = document.getElementById('lokasi-user');
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(function(pos) {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=f52bc7068ca24d6e8545cd9b2b0c0e6e`)
        .then(res => res.json())
        .then(data => {
          const lokasi = data.results[0].components;
          const kec = lokasi.suburb || lokasi.village || lokasi.county || lokasi.town;
          loc.innerText = `Lokasi Anda: ${kec || 'Tidak Diketahui'}`;
        })
        .catch(() => loc.innerText = 'Tidak dapat mendeteksi lokasi.');
    });
  } else loc.innerText = 'Browser tidak mendukung geolokasi.';
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

// Mulai load semua data
Promise.all([
  fetchSheet(sheetProduk),
  fetchSheet(sheetProfil),
  fetchSheet(sheetSlider),
  fetchSheet(sheetGaleri),
  fetchSheet(sheetTestimoni),
  fetchSheet(sheetLayanan),
  fetchSheet(sheetKenapa),
]).then(([produk, profil, slider, galeri, testimoni, layanan, kenapa]) => {
  renderProduk(produk);
  renderProfil(profil);
  renderSlider(slider);
  renderGaleri(galeri);
  renderTestimoni(testimoni);
  renderLayanan(layanan);
  renderKenapa(kenapa);
});

initGeolokasi();
