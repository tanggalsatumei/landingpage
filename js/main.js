// Konstanta Spreadsheet
const sheetId = '1s5PwpQqnaqRJ7DeS8rVZ1KiK-eUr2CdpFP-Uvz54Z7w';
const apiKey = 'AIzaSyAoLKn-ravRsZm2XUW_jZHlLpHhiz3MFYc';

// Helper fetch
async function fetchSheet(sheetName) {
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`);
  const data = await res.json();
  if (!data || !data.values || data.values.length < 2) {
    console.warn(`Sheet "${sheetName}" kosong atau tidak ditemukan.`);
    return [];
  }
  const [header, ...rows] = data.values;
  return rows.map(row => Object.fromEntries(header.map((h, i) => [h, row[i] || ''])));
}

// Slider
async function renderSlider() {
  const data = await fetchSheet('Slider');
  const container = document.querySelector('.hero-slider');
  if (!container) return;
  container.innerHTML = '';
  data.forEach(item => {
    const slide = document.createElement('div');
    slide.className = 'slider-item';
    slide.style.backgroundImage = `url('${item.gambar_url}')`;
    slide.innerHTML = `
      <div class="overlay">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-md-6 d-none d-md-block"></div>
            <div class="col-md-6 text-section">
              <span class="small-text">${item.keterangan_singkat || ''}</span>
              <h1>${item.judul || ''}</h1>
              <p>${item.deskripsi || ''}</p>
              <a href="${item.link || '#'}" class="btn">Shop Now</a>
            </div>
          </div>
        </div>
      </div>`;
    container.appendChild(slide);
  });
}

// Produk dan Keranjang
let keranjang = [];

async function renderProduk() {
  const data = await fetchSheet('Produk');
  const container = document.getElementById('produk-container');
  const highlight = document.getElementById('highlight-produk');
  if (!container || !highlight) return;

  container.innerHTML = '';
  highlight.innerHTML = '';

  data.forEach((item, index) => {
    const card = `
      <div class="col-md-4 mb-4">
        <div class="card shadow-sm h-100">
          <img src="${item.gambar_url}" class="card-img-top" alt="${item.nama_produk}">
          <div class="card-body">
            <h5 class="card-title">${item.nama_produk}</h5>
            <p class="card-text">${item.deskripsi}</p>
            <p>
              <span class="harga-coret">Rp${item.harga_asli}</span>
              <strong class="text-danger">Rp${item.harga_diskon}</strong>
            </p>
            <button class="btn btn-primary w-100" onclick='tambahKeranjang(${JSON.stringify(item)})'>Tambah ke Keranjang</button>
          </div>
        </div>
      </div>`;
    container.innerHTML += card;

    if (index === 0) {
      highlight.innerHTML = card;
    }
  });
}

function tambahKeranjang(item) {
  keranjang.push(item);
  document.getElementById('cart-count').textContent = keranjang.length;
  document.getElementById('notif').style.display = 'block';
  setTimeout(() => document.getElementById('notif').style.display = 'none', 2000);
  renderKeranjang();
}

function renderKeranjang() {
  const list = document.getElementById('keranjang-list');
  if (!list) return;
  list.innerHTML = '';
  keranjang.forEach(item => {
    list.innerHTML += `<li class="list-group-item d-flex justify-content-between align-items-center">
      ${item.nama_produk} <span>Rp${item.harga_diskon}</span>
    </li>`;
  });
}

// Checkout via WhatsApp
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('checkout-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const nama = document.getElementById('nama-pemesan').value;
      const alamat = document.getElementById('alamat-pemesan').value;

      if (!nama || !alamat || keranjang.length === 0) {
        alert("Lengkapi data dan isi keranjang terlebih dahulu.");
        return;
      }

      let pesan = `Halo, saya ${nama} ingin memesan:\n`;
      keranjang.forEach(item => {
        pesan += `- ${item.nama_produk} (Rp${item.harga_diskon})\n`;
      });
      pesan += `\nAlamat: ${alamat}`;

      const waUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(pesan)}`;
      window.open(waUrl, '_blank');
    });
  }
});

// Galeri
async function renderGaleri() {
  const data = await fetchSheet('Galeri');
  const container = document.getElementById('galeri-container');
  if (!container) return;
  container.innerHTML = '';
  data.forEach(item => {
    const col = document.createElement('div');
    col.className = 'col-md-3 mb-3';
    col.innerHTML = `<img src="${item.gambar_url}" class="img-fluid rounded shadow-sm" alt="${item.caption}">`;
    container.appendChild(col);
  });
}

// Testimoni
async function renderTestimoni() {
  const data = await fetchSheet('Testimoni');
  const container = document.getElementById('testimoni-container');
  if (!container) return;
  container.innerHTML = '';
  data.forEach(item => {
    const col = document.createElement('div');
    col.className = 'col-md-4 mb-4';
    col.innerHTML = `
      <div class="card shadow-sm">
        <div class="card-body">
          <p class="card-text">"${item.isi}"</p>
          <h6 class="card-subtitle text-muted">— ${item.nama}</h6>
        </div>
      </div>`;
    container.appendChild(col);
  });
}

// Keunggulan
async function renderKeunggulan() {
  const data = await fetchSheet('Keunggulan');
  const container = document.getElementById('keunggulan-list');
  if (!container) return;
  container.innerHTML = '';
  data.forEach(item => {
    const col = document.createElement('div');
    col.className = 'col-md-4 text-center mb-4';
    col.innerHTML = `
      <i class="bi ${item.ikon} display-4 text-primary"></i>
      <h5 class="mt-3">${item.judul}</h5>
      <p>${item.deskripsi}</p>`;
    container.appendChild(col);
  });
}

// Layanan
async function renderLayanan() {
  const data = await fetchSheet('Layanan');
  const container = document.getElementById('layanan-container');
  if (!container) return;
  container.innerHTML = '';
  data.forEach(item => {
    const col = document.createElement('div');
    col.className = 'col-md-4 text-center mb-4';
    col.innerHTML = `
      <i class="bi ${item.icon} display-4 text-success"></i>
      <h5 class="mt-3">${item.judul}</h5>
      <p>${item.deskripsi}</p>`;
    container.appendChild(col);
  });
}

// Profil UMKM
async function renderProfil() {
  const data = await fetchSheet('ProfilUMKM');
  if (!data.length) return;

  const profil = data[0];
  document.getElementById('tentang-title').textContent = profil.judul_utama;
  document.getElementById('tentang-umkm').textContent = profil.tentang;
  document.getElementById('alamat-umkm').textContent = profil.alamat;
  document.getElementById('jam-operasional').textContent = profil.jam_operasional;
  document.getElementById('link-wa').href = `https://wa.me/${profil.no_wa}`;
  document.getElementById('link-ig').href = profil.link_ig;
  document.getElementById('link-fb').href = profil.link_fb;
  document.getElementById('map-embed').src = `https://maps.google.com/maps?q=${profil.lokasi_maps}&z=15&output=embed`;
}

// Dark Mode
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('dark-mode', isDark);
}

function loadDarkMode() {
  const isDark = localStorage.getItem('dark-mode') === 'true';
  if (isDark) document.body.classList.add('dark-mode');
}

// Inisialisasi Semua
function inisialisasi() {
  loadDarkMode();
  renderSlider();
  renderProduk();
  renderGaleri();
  renderTestimoni();
  renderKeunggulan();
  renderProfil();
  renderLayanan();

  const toggleBtn = document.getElementById('toggle-darkmode');
  if (toggleBtn) toggleBtn.addEventListener('click', toggleDarkMode);
}

document.addEventListener('DOMContentLoaded', inisialisasi);
