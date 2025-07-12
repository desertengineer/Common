function loadApps() {
  fetch('https://desertengineer.github.io/Common/BekeiratSoftwareBlog/Apps_Grid/data/AppsGrid_ver.01.xml')
    .then(function(response) {
      return response.text();
    })
    .then(function(xmlText) {
      var parser = new window.DOMParser();
      var xml = parser.parseFromString(xmlText, "application/xml");
      var appNodes = xml.getElementsByTagName('app');
      var apps = [];
      for (var i = 0; i < appNodes.length; i++) {
        var app = appNodes[i];
        apps.push({
          name: app.getElementsByTagName('name')[0].textContent,
          icon: app.getElementsByTagName('icon')[0].textContent,
          description: app.getElementsByTagName('description')[0].textContent,
          category: app.getElementsByTagName('category')[0].textContent,
          playstore: app.getElementsByTagName('playstore')[0].textContent,
          direction: app.getElementsByTagName('direction')[0].textContent,
          lang: app.getElementsByTagName('lang')[0].textContent
        });
      }
      renderApps(apps);
      setupFilters(apps);
    })
    .catch(function(err) {
      console.error('Failed to load apps XML:', err);
      var grid = document.getElementById('app-grid');
      grid.innerHTML = '<p>Failed to load apps data.</p>';
    });
}

function renderApps(apps) {
  var grid = document.getElementById('app-grid');
  grid.innerHTML = '';
  if (apps.length === 0) {
    grid.innerHTML = '<p>No apps found for the selected filters.</p>';
    return;
  }
  if (apps.length > 0) {
    grid.setAttribute('dir', apps[0].direction);
  }
  for (var i = 0; i < apps.length; i++) {
    var app = apps[i];
    var card = document.createElement('div');
    card.className = 'app-card category-' + app.category + ' lang-' + app.lang;
    card.setAttribute('data-category', app.category);
    card.setAttribute('data-lang', app.lang);
    card.setAttribute('data-direction', app.direction);

    card.innerHTML =
      '<img class="icon" src="https://your-github-repo/icons/' + app.icon + '" alt="' + app.name + '">' +
      '<div class="app-name">' + app.name + '</div>' +
      '<div class="app-desc">' + app.description + '</div>' +
      '<a class="playstore-link" href="' + app.playstore + '" target="_blank" rel="noopener noreferrer">' +
        '<img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play">' +
      '</a>';
    grid.appendChild(card);
  }
}

function setupFilters(apps) {
  var langBtns = document.querySelectorAll('.lang-btn');
  var catBtns = document.querySelectorAll('.cat-btn');
  var selectedLang = null;
  var selectedCat = null;

  // Set "All" buttons active initially
  var langAllBtn = document.querySelector('.lang-btn[data-lang=""]');
  var catAllBtn = document.querySelector('.cat-btn[data-category=""]');
  if (langAllBtn) langAllBtn.classList.add('active');
  if (catAllBtn) catAllBtn.classList.add('active');

  for (var i = 0; i < langBtns.length; i++) {
    langBtns[i].addEventListener('click', function() {
      for (var j = 0; j < langBtns.length; j++) {
        langBtns[j].classList.remove('active');
      }
      this.classList.add('active');

      var langValue = this.getAttribute('data-lang');
      selectedLang = langValue === "" ? null : langValue;
      filterAndRender();
    });
  }

  for (var i = 0; i < catBtns.length; i++) {
    catBtns[i].addEventListener('click', function() {
      for (var j = 0; j < catBtns.length; j++) {
        catBtns[j].classList.remove('active');
      }
      this.classList.add('active');

      var catValue = this.getAttribute('data-category');
      selectedCat = catValue === "" ? null : catValue;
      filterAndRender();
    });
  }

  function filterAndRender() {
    var filtered = [];
    for (var i = 0; i < apps.length; i++) {
      var app = apps[i];
      var langMatch = !selectedLang || app.lang === selectedLang;
      var catMatch = !selectedCat || app.category === selectedCat;
      if (langMatch && catMatch) {
        filtered.push(app);
      }
    }
    var grid = document.getElementById('app-grid');
    if (filtered.length > 0) {
      grid.setAttribute('dir', filtered[0].direction);
    } else {
      grid.setAttribute('dir', 'ltr');
    }
    renderApps(filtered);
  }
}

document.addEventListener('DOMContentLoaded', loadApps);
