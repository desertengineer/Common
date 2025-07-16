var appsData = [], currentIndex = 0, currentSlide = 0;

        function loadApps() {
            fetch('https://desertengineer.github.io/Common/BekeiratSoftwareBlog/Apps_Grid/data/AppsGrid_ver.04.xml')
                .then(res => res.text())
                .then(xmlStr => {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(xmlStr, "application/xml");
                    var apps = Array.from(xmlDoc.getElementsByTagName('app'));
                    appsData = apps.map(function (app) {
                        var screenshots = {};
                        for (var i = 1; i <= 6; i++) {
                            var shotTag = app.getElementsByTagName('shot' + i)[0];
                            screenshots['shot' + i] = shotTag ? shotTag.textContent : null;
                        }
                        return {
                            name: app.getElementsByTagName('name')[0]?.textContent || "",
                            icon: app.getElementsByTagName('icon')[0]?.textContent || "",
                            description: app.getElementsByTagName('description')[0]?.textContent || "",
                            longdesc: app.getElementsByTagName('long_description')[0]?.textContent || "",
                            category: app.getElementsByTagName('category')[0]?.textContent || "",
                            playstore: app.getElementsByTagName('playstore')[0]?.textContent || "",
                            direction: app.getElementsByTagName('direction')[0]?.textContent || "ltr",
                            lang: app.getElementsByTagName('lang')[0]?.textContent || "",
                            youtube: app.getElementsByTagName('youtube')[0]?.textContent || "",
                            screenshots: screenshots
                        };
                    });
                    renderApps(appsData);
                    setupFilters(appsData);
                });
        }

        function setupModalEvents() {
            var cards = document.querySelectorAll('.app-card .app-data');
            cards.forEach(function (card, idx) {
                card.addEventListener('click', function () { openModal(idx); });
            });
        }

        function openModal(index) {
            currentIndex = index;
            currentSlide = 0;

            const app = appsData[index];
            const modal = document.getElementById('app-modal');

            // Show modal & set direction
            modal.style.display = 'flex';
            modal.setAttribute('dir', app.direction);

            // Set modal header
            modal.querySelector('.modal-title').textContent = app.name;
            modal.querySelector('.modal-icon').src = app.icon;
            modal.querySelector('.modal-icon').alt = app.name;

            // Set Info tab content
            modal.querySelector('.intro-desc').textContent = app.description;
            modal.querySelector('.app-description').textContent = app.longdesc;

            // Set YouTube video
            const iframe = modal.querySelector('.youtube-frame');
            iframe.src = app.youtube.includes('youtube.com/embed/') ? app.youtube : "";

            // Set Play Store link
            const playLink = modal.querySelector('.playstore-link');
            playLink.href = app.playstore || "#";

            // Populate screenshots
            const sliderTrack = document.getElementById('sliderTrack');
            sliderTrack.innerHTML = ''; // Clear previous
            const shots = Object.values(app.screenshots).filter(src => src);

            shots.forEach(src => {
                const img = document.createElement('img');
                img.src = src;
                img.className = 'slide-img';
                sliderTrack.appendChild(img);
            });

            // Reset slider position
            sliderTrack.style.transform = 'translateX(0)';
        }

        function renderApps(appList) {
            var grid = document.getElementById('app-grid');
            grid.innerHTML = "";
            if (appList.length === 0) {
                grid.innerHTML = "<p>No apps found for the selected filters.</p>";
                return;
            }
            grid.setAttribute("dir", appList[0].direction);
            appList.forEach(function (app) {
                var card = document.createElement('div');
                card.className = "app-card";
                card.setAttribute("data-category", app.category);
                card.setAttribute("data-lang", app.lang);
                card.setAttribute("dir", app.direction);

                card.innerHTML =
                    '<div class="app-data">' +
                    '<img class="icon" src="' + app.icon + '" alt="' + app.name + '">' +
                    '<div class="app-name">' + app.name + '</div>' +
                    '<div class="app-desc">' + app.description + '</div>' +
                    '</div>' +
                    '<a class="playstore-link" href="' + app.playstore + '" target="_blank" rel="noopener noreferrer">' +
                    '<img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play">' +
                    '</a>';

                grid.appendChild(card);
            });
            setupModalEvents();
        }

        function setupFilters(data) {
            var langButtons = document.querySelectorAll('.lang-btn');
            var catButtons = document.querySelectorAll('.cat-btn');
            var selectedLang = null, selectedCat = null;
            langButtons.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    langButtons.forEach(function (b) { b.classList.remove('active'); });
                    this.classList.add('active');
                    selectedLang = this.getAttribute('data-lang') || null;
                    filterAndRender();
                });
            });
            catButtons.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    catButtons.forEach(function (b) { b.classList.remove('active'); });
                    this.classList.add('active');
                    selectedCat = this.getAttribute('data-category') || null;
                    filterAndRender();
                });
            });
            function filterAndRender() {
                var filtered = data.filter(function (app) {
                    return (!selectedLang || app.lang === selectedLang)
                        && (!selectedCat || app.category === selectedCat);
                });
                renderApps(filtered);
            }
        }

        function slideShots(direction) {
            const track = document.getElementById('sliderTrack');
            if (!track) return;

            const slides = track.querySelectorAll('.slide-img');
            const totalSlides = slides.length;
            if (totalSlides === 0) return;

            currentSlide += direction;

            if (currentSlide < 0) currentSlide = totalSlides - 1;
            if (currentSlide >= totalSlides) currentSlide = 0;

            track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
        }


        document.addEventListener('DOMContentLoaded', function () {
            loadApps();
            // Tab switching functionality
            const tabButtons = document.querySelectorAll('.tab-btn');
            tabButtons.forEach(button => {
                button.addEventListener('click', function () {
                    const tabName = this.getAttribute('data-tab');

                    // Toggle active tab button
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');

                    // Toggle tab content panels
                    document.querySelectorAll('.tab-panel').forEach(panel => {
                        panel.classList.remove('active');
                    });

                    const targetPanel = document.querySelector('.tab-panel[data-content="' + tabName + '"]');
                    if (targetPanel) targetPanel.classList.add('active');
                });
            });

            var modal = document.getElementById('app-modal');
            modal.style.display = "none";
            modal.querySelector('.close-btn').onclick = function () {
                modal.style.display = "none";
                modal.querySelector('.youtube-frame').src = "";
            };
            modal.querySelector('.left-arrow').onclick = function () {
                if (currentIndex > 0) openModal(currentIndex - 1);
            };
            modal.querySelector('.right-arrow').onclick = function () {
                if (currentIndex < appsData.length - 1) openModal(currentIndex + 1);
            };
            modal.onclick = function (e) {
                if (e.target === modal) {
                    modal.style.display = "none";
                    modal.querySelector('.youtube-frame').src = "";
                }
            };
        });
