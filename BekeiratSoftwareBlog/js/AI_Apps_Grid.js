const XML_URL = "https://desertengineer.github.io/Common/BekeiratSoftwareBlog/xmls/AI_Apps_Grid.xml";
const ITEMS_PER_PAGE = 6;
const CACHE_KEY = "AI_Apps_XML_Cache";
const CACHE_TIME_KEY = "AI_Apps_XML_Cache_Time";
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

let allItems = [];
let currentPage = 1;
let currentCategory = "all";
let currentSearch = "";
let allCategories = [];

function loadXML() {
  const cachedXML = localStorage.getItem(CACHE_KEY);
  const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
  const now = Date.now();

  if (cachedXML && cachedTime && (now - parseInt(cachedTime) < CACHE_EXPIRY_MS)) {
    parseXML(cachedXML);
  } else {
    fetch(XML_URL)
      .then(function(response) { return response.text(); })
      .then(function(xmlStr) {
        localStorage.setItem(CACHE_KEY, xmlStr);
        localStorage.setItem(CACHE_TIME_KEY, now.toString());
        parseXML(xmlStr);
      });
  }
}

function parseXML(str) {
  const parser = new DOMParser();
  const xml = parser.parseFromString(str, "application/xml");
  const items = xml.getElementsByTagName("item");

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const obj = {
      title: item.getElementsByTagName("title")[0].textContent,
      description: item.getElementsByTagName("description")[0].textContent,
      image: item.getElementsByTagName("image")[0].textContent,
      link: item.getElementsByTagName("link")[0].textContent,
      categories: []
    };

    for (let j = 1; j <= 3; j++) {
      const cat = item.getElementsByTagName("category" + j)[0];
      if (cat && cat.textContent) {
        obj.categories.push(cat.textContent);
        if (allCategories.indexOf(cat.textContent) === -1) {
          allCategories.push(cat.textContent);
        }
      }
    }

    allItems.push(obj);
  }

  generateFilterButtons();
  renderGrid();
}

function generateFilterButtons() {
  const container = document.getElementById("filter-buttons");
  container.innerHTML = "";

  const allBtn = document.createElement("button");
  allBtn.innerText = "الكل";
  allBtn.setAttribute("data-cat", "all");
  allBtn.onclick = function() {
    currentCategory = "all";
    currentPage = 1;
    renderGrid();
  };
  container.appendChild(allBtn);

  for (let i = 0; i < allCategories.length; i++) {
    const btn = document.createElement("button");
    btn.innerText = allCategories[i];
    btn.setAttribute("data-cat", allCategories[i]);
    btn.onclick = function() {
      currentCategory = allCategories[i];
      currentPage = 1;
      renderGrid();
    };
    container.appendChild(btn);
  }
}

function handleSearch() {
  const input = document.getElementById("search-input");
  currentSearch = input.value.toLowerCase();
  currentPage = 1;
  renderGrid();
}

function renderGrid() {
  const container = document.getElementById("grid-container");
  container.classList.add("fade-out");

  setTimeout(function() {
    container.innerHTML = "";

    let filtered = allItems.filter(function(item) {
      const matchCat = (currentCategory === "all") || (item.categories.indexOf(currentCategory) !== -1);
      const matchSearch =
        item.title.toLowerCase().includes(currentSearch) ||
        item.description.toLowerCase().includes(currentSearch);
      return matchCat && matchSearch;
    });

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const paginated = filtered.slice(start, end);

    for (let i = 0; i < paginated.length; i++) {
      const item = paginated[i];
      const div = document.createElement("div");
      div.className = "grid-item";
      div.innerHTML =
        '<img src="' + item.image + '" alt="' + item.title + '">' +
        '<h2>' + item.title + '</h2>' +
        '<p>' + item.description + '</p>' +
        '<a href="' + item.link + '" target="_blank">اقرأ المزيد</a>';
      container.appendChild(div);
    }

    container.classList.remove("fade-out");
    container.classList.add("fade-in");

    renderPagination(filtered.length);
  }, 300);
}

function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.innerText = i;
    if (i === currentPage) {
      btn.className = "active";
    }
    btn.onclick = function() {
      currentPage = i;
      renderGrid();
    };
    pagination.appendChild(btn);
  }
}

loadXML();
