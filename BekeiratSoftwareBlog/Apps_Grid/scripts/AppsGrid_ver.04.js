let appsData = [],
    currentIndex = 0,
    currentSlide = 0;

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
          const shot = app.getElementsByTagName('shot' + i)[0];
          screenshots['shot' + i] = shot ? shot.textContent : null;
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

function renderApps(appList) {
  const grid = document.getElementById('app-grid');
  grid.innerHTML = '';

  if (appList.length === 0) {
    grid.innerHTML = '<p>No apps found for the selected filters.</p>';
    return;
  }

  appList.forEach((app, index) => {
    const card = document.createElement('div');
    card.className = 'app-card';
    card.setAttribute('data-category', app.category);
    card.setAttribute('data-lang', app.lang);
    card.setAttribute('dir', app.direction);

    card.innerHTML =
      '<div class="app-data">' +
      '<img class="icon" src="' + app.icon + '" alt="' + app.name + '">' +
      '<div class="app-name">' + app.name + '</div>' +
      '<div class="app-desc">' + app.description + '</div>' +
      '</div>' +
      '<a class="playstore-link" href="' + app.playstore + '" target="_blank" rel="noopener noreferrer">' +
      '<img src="https://desertengineer.github.io/Common/BekeiratSoftwareBlog/Apps_Grid/images/Google_Play_Store_badge_EN.svg">' +
      '</a>';

    card.querySelector('.app-data').addEventListener('click', function () {
      openModal(index);
    });

    grid.appendChild(card);
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
  modal.querySelector('.youtube-frame').src = app.youtube.includes('youtube.com/embed/') ? app.youtube : '';
  modal.querySelector('.playstore-link').href = app.playstore || "#";

  const sliderTrack = document.getElementById('sliderTrack');
  sliderTrack.innerHTML = '';

  const validShots = Object.values(app.screenshots).filter(Boolean);
  validShots.forEach(src => {
    const slide = document.createElement('div');
    slide.className = 'slide';

    const img = document.createElement('img');
    img.src = src;
    img.className = 'slide-img';

    slide.appendChild(img);
    sliderTrack.appendChild(slide);
  });

  sliderTrack.style.transform = 'translateX(0)';
}

function slideShots(direction) {
  const track = document.getElementById('sliderTrack');
  const slides = track.querySelectorAll('.slide');
  const totalSlides = slides.length;

  if (!totalSlides) return;

  currentSlide += direction;

  if (currentSlide < 0) currentSlide = totalSlides - 1;
  if (currentSlide >= totalSlides) currentSlide = 0;

  track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
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

  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      modal.querySelector('.youtube-frame').src = '';
    }
  };

  document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', function () {
      const tabName = this.getAttribute('data-tab');

      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
      document.querySelector('.tab-panel[data-content="' + tabName + '"]').classList.add('active');
    });
  });
});
