var appsData = [],
    currentIndex = 0,
    currentSlide = 0;

function loadApps() {
    fetch('https://desertengineer.github.io/Common/BekeiratSoftwareBlog/Apps_Grid/data/AppsGrid_ver.04.xml').then(function (e) {
        return e.text()
    }).then(function (e) {
        var t = new window.DOMParser,
            n = t.parseFromString(e, "application/xml"),
            o = n.getElementsByTagName('app');
        appsData = [];
        for (var r = 0; r < o.length; r++) {
            var a = o[r],
                l = [];
            for (var d = 1; d <= 6; d++) {
                var i = a.getElementsByTagName('shot' + d)[0];
                i && l.push(i.textContent)
            }
            appsData.push({
                name: a.getElementsByTagName('name')[0].textContent,
                icon: a.getElementsByTagName('icon')[0].textContent,
                description: a.getElementsByTagName('description')[0].textContent,
                longdesc: a.getElementsByTagName('longdesc')[0].textContent,
                category: a.getElementsByTagName('category')[0].textContent,
                playstore: a.getElementsByTagName('playstore')[0].textContent,
                direction: a.getElementsByTagName('direction')[0].textContent,
                lang: a.getElementsByTagName('lang')[0].textContent,
                youtube: a.getElementsByTagName('youtube')[0] ? a.getElementsByTagName('youtube')[0].textContent : "",
                screenshots: l
            })
        }
        renderApps(appsData), setupFilters(appsData)
    })
}

function setupModalEvents() {
    var e = document.querySelectorAll('.app-card .app-data');
    for (let t = 0; t < e.length; t++) e[t].addEventListener('click', function () {
        openModal(t)
    })
}

function openModal(e) {
    currentIndex = e;
    var t = appsData[e],
        n = document.getElementById('app-modal');
    n.style.display = 'flex', n.setAttribute('dir', t.direction), n.querySelector('.modal-title').textContent = t.name, n.querySelector('.modal-icon').src = t.icon, n.querySelector('.modal-icon').alt = t.name, n.querySelector('.intro-desc').textContent = t.description, n.querySelector('.app-description').textContent = t.longdesc;
    var o = t.youtube;
    o && o.indexOf('youtube.com/embed/') !== -1 ? n.querySelector('.youtube-frame').src = o : n.querySelector('.youtube-frame').src = '';
    var r = document.getElementById('sliderTrack');
    r.innerHTML = '', t.screenshots.forEach(function (e) {
        var t = document.createElement('img');
        t.src = e, t.className = 'slide-img', r.appendChild(t)
    }), currentSlide = 0, r.style.transform = 'translateX(0)'
}

function renderApps(e) {
    var t = document.getElementById('app-grid');
    t.innerHTML = '';
    if (e.length === 0) {
        t.innerHTML = '<p>No apps found for the selected filters.</p>'
    } else if (e.length > 0) {
        t.setAttribute('dir', e[0].direction);
        for (var n = 0; n < e.length; n++) {
            var o = e[n],
                r = document.createElement('div');
            r.className = 'app-card', r.setAttribute('data-category', o.category), r.setAttribute('data-lang', o.lang), r.setAttribute('dir', o.direction), r.innerHTML = '<div class="app-data">' + '<img class="icon" src="' + o.icon + '" alt="' + o.name + '">' + '<div class="app-name">' + o.name + '</div>' + '<div class="app-desc">' + o.description + '</div>' + '</div>' + '<a class="playstore-link" href="' + o.playstore + '" target="_blank" rel="noopener noreferrer">' + '<img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play">' + '</a>', t.appendChild(r)
        }
    }
    setupModalEvents()
}

function setupFilters(e) {
    var t = document.querySelectorAll('.lang-btn'),
        n = document.querySelectorAll('.cat-btn'),
        o = null,
        r = null;
    document.querySelector('.lang-btn[data-lang=""]').classList.add('active'), document.querySelector('.cat-btn[data-category=""]').classList.add('active'), t.forEach(function (t) {
        t.addEventListener('click', function () {
            for (var n = 0; n < t.length; n++) t[n].classList.remove('active');
            this.classList.add('active');
            var t = this.getAttribute('data-lang');
            o = t === "" ? null : t, filterAndRender()
        })
    }), n.forEach(function (t) {
        t.addEventListener('click', function () {
            for (var n = 0; n < t.length; n++) t[n].classList.remove('active');
            this.classList.add('active');
            var t = this.getAttribute('data-category');
            r = t === "" ? null : t, filterAndRender()
        })
    });

    function filterAndRender() {
        var t = [];
        e.forEach(function (e) {
            var n = !o || e.lang === o,
                a = !r || e.category === r;
            n && a && t.push(e)
        });
        renderApps(t)
    }
}
document.addEventListener('DOMContentLoaded', function () {
    loadApps();
    var e = document.getElementById('app-modal');
    e.style.display = 'none';
    e.querySelector('.close-btn').onclick = function () {
        e.style.display = 'none', e.querySelector('.youtube-frame').src = ''
    };
    e.querySelector('.left-arrow').onclick = function () {
        currentIndex > 0 && openModal(currentIndex - 1)
    };
    e.querySelector('.right-arrow').onclick = function () {
        currentIndex < appsData.length - 1 && openModal(currentIndex + 1)
    };
    e.onclick = function (t) {
        t.target === e && (e.style.display = 'none', e.querySelector('.youtube-frame').src = '')
    }
});
