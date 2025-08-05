const XML_URL = "https://desertengineer.github.io/Common/BekeiratSoftwareBlog/xmls/AI_Apps_Grid.xml";
const ITEMS_PER_PAGE = 6;

let allItems = [];
let currentPage = 1;
let currentCategory = "all";
let allCategories = [];

function loadXML() {
  fetch(XML_URL)
    .then(function(response) {
      return response.text();
    })
    .then(function(str) {
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
    });
}

function generateFilterButtons() {
  const container = document.getElementById("filter-buttons");
  container.innerHTML = "";
  const allBtn = document.createElement("button");
  allBtn.innerText = "All";
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

function renderGrid() {
  const container = document.getElementById("grid-container");
  container.classList.add("fade-out");
  setTimeout(function() {
    container.innerHTML = "";
    let filtered = [];

    if (currentCategory === "all") {
      filtered = allItems;
    } else {
      for (let i = 0; i < allItems.length; i++) {
        if (allItems[i].categories.indexOf(currentCategory) !== -1) {
          filtered.push(allItems[i]);
        }
      }
    }

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
        '<a href="' + item.link + '" target="_blank">Read More</a>';
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
