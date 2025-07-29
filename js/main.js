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
  renderGaleri();
  renderTestimoni();
  renderKeunggulan();
  const darkToggle = document.getElementById('darkToggle');
  if (darkToggle) darkToggle.addEventListener('click', toggleDarkMode);
}

document.addEventListener('DOMContentLoaded', inisialisasi);
