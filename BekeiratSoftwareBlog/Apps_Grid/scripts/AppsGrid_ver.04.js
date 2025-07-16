let appsData = [], currentIndex = 0, currentSlide = 0;

function loadApps() {
  fetch('https://desertengineer.github.io/Common/BekeiratSoftwareBlog/Apps_Grid/data/AppsGrid_ver.04.xml')
    .then(res => res.text())
    .then(xmlStr => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlStr, "application/xml");
      const apps = Array.from(xmlDoc.getElementsByTagName('app'));

      appsData = apps.map(app => {
        const screenshots = {};
        for (let i = 1; i <= 6; i++) {
          const shotTag = app.getElementsByTagName('shot' + i)[0];
          screenshots['shot' + i] = shotTag ? shotTag.textContent : null;
        }

        return {
          name: app.getElementsByTagName('name')[0]?.textContent || '',
          icon: app.getElementsByTagName('icon')[0]?.textContent || '',
          description: app.getElementsByTagName('description')[0]?.textContent || '',
          longdesc: app.getElementsByTagName('long_description')[0]?.textContent || '',
          category: app.getElementsByTagName('category')[0]?.textContent || '',
          playstore: app.getElementsByTagName('playstore')[0]?.textContent || '',
          direction: app.getElementsByTagName('direction')[0]?.textContent || 'ltr',
          lang: app.getElementsByTagName('lang')[0]?.textContent || '',
          youtube: app.getElementsByTagName('youtube')[0]?.textContent || '',
          screenshots
        };
      });

      renderApps(appsData);
      setupFilters(appsData);
    });
}

function setupModalEvents() {
  const cards = document.querySelectorAll('.app-card .app-data');
  cards.forEach((card, idx) => {
    card.addEventListener('click', () => openModal(idx));
  });
}

function openModal(index) {
  currentIndex = index;
  currentSlide = 0;

  const app = appsData[index];
  const modal = document.getElementById('app-modal');

  modal.style.display = 'flex';
  modal.setAttribute('dir', app.direction);
  modal.querySelector('.modal-title').textContent = app.name;
  modal.querySelector('.modal-icon').src = app.icon;
  modal.querySelector('.modal-icon').alt = app.name;
  modal.querySelector('.intro-desc').textContent = app.description;
  modal.querySelector('.app-description').textContent = app.longdesc;

  const iframe = modal.querySelector('.youtube-frame');
  iframe.src = app.youtube.includes('youtube.com/embed/') ? app.youtube : '';

  const sliderTrack = document.getElementById('sliderTrack');
  sliderTrack.innerHTML = '';

  Object.values(app.screenshots).forEach(src => {
    if (src) {
      const img = document.createElement('img');
      img.src = src;
      img.className = 'slide-img';
      sliderTrack.appendChild(img);
    }
  });

  sliderTrack.style.transform = 'translateX(0)';
}

function renderApps(appList) {
  const grid = document.getElementById('app-grid');
  grid.innerHTML = '';

  if (appList.length === 0) {
    grid.innerHTML = '<p>No apps found for the selected filters.</p>';
    return;
  }

  grid.setAttribute('dir', appList[0].direction);

  appList.forEach(app => {
    const card = document.createElement('div');
    card.className = 'app-card';
    card.setAttribute('data-category', app.category);
    card.setAttribute('data-lang', app.lang);
    card.setAttribute('dir', app.direction);

    card.innerHTML = `
      <div class="app-data">
        <img class="icon" src="${app.icon}" alt="${app.name}">
        <div class="app-name">${app.name}</div>
        <div class="app-desc">${app.description}</div>
      </div>
      <a class="playstore-link" href="${app.playstore}" target="_blank" rel="noopener noreferrer">
        <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play">
      </a>`;

    grid.appendChild(card);
  });

  setupModalEvents();
}

function setupFilters(data) {
  const langButtons = document.querySelectorAll('.lang-btn');
  const catButtons = document.querySelectorAll('.cat-btn');
  let selectedLang = null, selectedCat = null;

  langButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      langButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      selectedLang = this.dataset.lang || null;
      filterAndRender();
    });
  });

  catButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      catButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      selectedCat = this.dataset.category || null;
      filterAndRender();
    });
  });

  function filterAndRender() {
    const filtered = data.filter(app =>
      (!selectedLang || app.lang === selectedLang) &&
      (!selectedCat || app.category === selectedCat)
    );
    renderApps(filtered);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadApps();

  const modal = document.getElementById('app-modal');
  modal.style.display = 'none';

  modal.querySelector('.close-btn').onclick = () => {
    modal.style.display = 'none';
    modal.querySelector('.youtube-frame').src = '';
  };

  modal.querySelector('.left-arrow').onclick = () => {
    if (currentIndex > 0) openModal(currentIndex - 1);
  };

  modal.querySelector('.right-arrow').onclick = () => {
    if (currentIndex < appsData.length - 1) openModal(currentIndex + 1);
  };

  modal.onclick = e => {
    if (e.target === modal) {
      modal.style.display = 'none';
      modal.querySelector('.youtube-frame').src = '';
    }
  };
});
