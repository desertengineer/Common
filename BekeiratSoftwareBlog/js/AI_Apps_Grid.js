const xmlUrl = "https://desertengineer.github.io/Common/BekeiratSoftwareBlog/xmls/AI_Apps_Grid.xml";
const imageBaseUrl = "https://desertengineer.github.io/Common/BekeiratSoftwareBlog/ContentImages/grid/";

let currentPage = 1;
const itemsPerPage = 6;
let allItems = [];
let filteredItems = [];
let allCategories = [];
let searchQuery = "";
let activeCategory = "all";

function loadXML() {
  fetch(xmlUrl)
    .then(function(response) {
      return response.text();
    })
    .then(function(xmlText) {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "application/xml");
      const appNodes = xmlDoc.getElementsByTagName("app");

      for (let i = 0; i < appNodes.length; i++) {
        const app = appNodes[i];
        const title = app.getElementsByTagName("title")[0].textContent;
        const description = app.getElementsByTagName("description")[0].textContent;
        const link = app.getElementsByTagName("link")[0].textContent;
        const image = app.getElementsByTagName("image")[0].textContent;
        const categories = app.getElementsByTagName("categories")[0].textContent.split(",");

        allItems.push({
          title: title,
          description: description,
          link: link,
          image: image,
          categories: categories
        });

        categories.forEach(function(cat) {
          if (allCategories.indexOf(cat.trim()) === -1) {
            allCategories.push(cat.trim());
          }
        });
      }

      createFilterButtons();
      filterAndRender();
    });
}

function createFilterButtons() {
  const container = document.getElementById("filter-container");
  container.innerHTML = "";

  const allBtn = document.createElement("button");
  allBtn.innerText = "Show All";
  allBtn.onclick = function() {
    applyFilter("all");
  };
  container.appendChild(allBtn);

  allCategories.forEach(function(category) {
    const btn = document.createElement("button");
    btn.innerText = category;
    btn.onclick = function() {
      applyFilter(category);
    };
    container.appendChild(btn);
  });
}

function applyFilter(category) {
  activeCategory = category;
  currentPage = 1;
  filterAndRender();
}

function applySearch() {
  searchQuery = document.getElementById("search-input").value.toLowerCase();
  currentPage = 1;
  filterAndRender();
}

function filterAndRender() {
  const grid = document.getElementById("grid-container");
  grid.classList.remove("fade-in");

  setTimeout(function() {
    filteredItems = allItems.filter(function(item) {
      const matchesCategory = (activeCategory === "all" || item.categories.indexOf(activeCategory) !== -1);
      const matchesSearch = item.title.toLowerCase().includes(searchQuery) ||
                            item.description.toLowerCase().includes(searchQuery);
      return matchesCategory && matchesSearch;
    });

    renderGrid();
    renderPagination();
    grid.classList.add("fade-in");
  }, 100);
}

function renderGrid() {
  const container = document.getElementById("grid-container");
  container.innerHTML = "";

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = filteredItems.slice(start, end);

  pageItems.forEach(function(item) {
    const card = document.createElement("div");
    card.className = "grid-item";

    card.innerHTML =
      "<img src='" +  item.image + "' alt='" + item.title + "'>" +
      "<h2>" + item.title + "</h2>" +
      "<p>" + item.description + "</p>" +
      "<a href='" + item.link + "' target='_blank'>اقرأ المزيد</a>";

    container.appendChild(card);
  });
}

function renderPagination() {
  const container = document.getElementById("pagination-container");
  container.innerHTML = "";

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.innerText = i;
    btn.className = (i === currentPage) ? "active" : "";
    btn.onclick = function() {
      currentPage = i;
      renderGrid();
      renderPagination();
    };
    container.appendChild(btn);
  }
}

document.addEventListener("DOMContentLoaded", loadXML);
