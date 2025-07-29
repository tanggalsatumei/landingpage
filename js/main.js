// Konstanta Spreadsheet
const sheetId = '1s5PwpQqnaqRJ7DeS8rVZ1KiK-eUr2CdpFP-Uvz54Z7w';
const apiKey = 'AIzaSyAoLKn-ravRsZm2XUW_jZHlLpHhiz3MFYc';

async function renderProduk() {
  const data = await fetchSheet('Produk');
  const container = document.getElementById('produk-container');
  if (!container) return;

  container.innerHTML = '';
  data.forEach(item => {
    const col = document.createElement('div');
    col.className = 'col-md-4 mb-4';

    const hargaAsli = item.harga_asli ? `<span class="harga-coret me-2">Rp ${Number(item.harga_asli.replace(/\D/g, '')).toLocaleString('id-ID')}</span>` : '';
    const hargaDiskon = item.harga_diskon ? `<strong class="text-danger">Rp ${Number(item.harga_diskon.replace(/\D/g, '')).toLocaleString('id-ID')}</strong>` : '';

    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${item.gambar_url}" class="card-img-top" alt="${item.nama_produk}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">const labelPromo = Number(item.harga_asli.replace(/\D/g, '')) > Number(item.harga_diskon.replace(/\D/g, '')) 
  ? `<span class="badge badge-promo">Promo</span>` : '';
${item.nama_produk}</h5>
          <p class="card-text">${item.deskripsi}</p>
          <div class="mt-auto">
            <p class="mb-2">${hargaAsli}${hargaDiskon}</p>
            <a href="${item.link_wa}" target="_blank" class="btn btn-success btn-sm w-100">Beli via WhatsApp</a>
          </div>
        </div>
      </div>`;
      
    container.appendChild(col);
  });
}


async function renderSlider() {
  const data = await fetchSheet('Slider');
  const container = document.getElementById('slider-images');
  if (!container) return;

  container.innerHTML = '';
  data.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'carousel-item' + (i === 0 ? ' active' : '');
    div.innerHTML = `<img src="${item.gambar_url}" class="d-block w-100" alt="Slide ${i + 1}">`;
    container.appendChild(div);
  });
}

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

// Galeri
async function renderGaleri() {
  const data = await fetchSheet('Galeri');
  const container = document.getElementById('galeri-container');
  if (!container) return;
  container.innerHTML = '';
  data.forEach(item => {
    const col = document.createElement('div');
    col.className = 'col-md-3 mb-3';
    col.innerHTML = `<img src="${item.gambar_url}" class="img-fluid rounded shadow-sm" alt="Galeri UMKM">`;
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
          <p class="card-text">"${item.testimoni}"</p>
          <h6 class="card-subtitle text-muted">— ${item.nama}</h6>
        </div>
      </div>`;
    container.appendChild(col);
  });
}

// Mengapa Memilih Kami
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

// Dark Mode Toggle
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
  renderSlider();      // Tambahkan
  renderProduk();      // Tambahkan
  renderGaleri();
  renderTestimoni();
  renderKeunggulan();

  const darkToggle = document.getElementById('toggle-darkmode');
  if (darkToggle) darkToggle.addEventListener('click', toggleDarkMode);
}
