var xmlUrl = "https://desertengineer.github.io/Common/BekeiratSoftwareBlog/xmls/AI_Apps_Grid.xml";
var imageBaseUrl = "https://desertengineer.github.io/Common/BekeiratSoftwareBlog/AI_Apps_Images/";
var itemsPerPage = 6;
var currentPage = 1;
var allItems = [];
var allCategories = [];

function fetchAndRenderData() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", xmlUrl, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var xml = xhr.responseXML;
      var items = xml.getElementsByTagName("item");
      for (var i = 0; i < items.length; i++) {
        var title = items[i].getElementsByTagName("title")[0].textContent;
        var desc = items[i].getElementsByTagName("description")[0].textContent;
        var img = items[i].getElementsByTagName("image")[0].textContent;
        var link = items[i].getElementsByTagName("link")[0].textContent;
        var cats = [];
        for (var j = 1; j <= 3; j++) {
          var tag = items[i].getElementsByTagName("category" + j)[0];
          if (tag) {
            cats.push(tag.textContent);
            if (allCategories.indexOf(tag.textContent) === -1) {
              allCategories.push(tag.textContent);
            }
          }
        }
        allItems.push({ title: title, desc: desc, img: img, link: link, cats: cats });
      }
      renderFilters();
      renderTagCloud();
      filterItems();
    }
  };
  xhr.send();
}

function renderFilters() {
  var container = document.getElementById("filterButtons");
  container.innerHTML = "";
  allCategories.forEach(function (cat) {
    var btn = document.createElement("button");
    btn.textContent = cat;
    btn.setAttribute("data-cat", cat);
    btn.onclick = function () {
      document.querySelectorAll("#filterButtons button").forEach(function (b) {
        b.classList.remove("active");
      });
      this.classList.add("active");
      filterItems(cat);
    };
    container.appendChild(btn);
  });
}

function renderTagCloud() {
  var cloud = document.getElementById("tagCloud");
  cloud.innerHTML = "";
  allCategories.forEach(function (cat) {
    var tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = cat;
    tag.onclick = function () {
      filterItems(cat);
    };
    cloud.appendChild(tag);
  });
}

function filterItems(category, search) {
  var grid = document.getElementById("gridContainer");
  grid.style.opacity = "0";
  setTimeout(function () {
    var filtered = allItems.filter(function (item) {
      var matchCat = !category || item.cats.indexOf(category) !== -1;
      var matchSearch = !search || item.title.toLowerCase().indexOf(search.toLowerCase()) !== -1;
      return matchCat && matchSearch;
    });
    renderGrid(filtered);
    renderPagination(filtered);
    grid.style.opacity = "1";
  }, 200);
}

function renderGrid(items) {
  var grid = document.getElementById("gridContainer");
  grid.innerHTML = "";
  var start = (currentPage - 1) * itemsPerPage;
  var end = start + itemsPerPage;
  var pageItems = items.slice(start, end);
  pageItems.forEach(function (item) {
    var div = document.createElement("div");
    div.className = "grid-item";
    div.innerHTML = '<img src="' + item.img + '" />' +
      '<h2>' + item.title + '</h2>' +
      '<p>' + item.desc + '</p>' +
      '<a href="' + item.link + '" target="_blank">Read more</a>';
    grid.appendChild(div);
  });
}

function renderPagination(filteredItems) {
  var pagination = document.getElementById("pagination");
  pagination.innerHTML = "";
  var pageCount = Math.ceil(filteredItems.length / itemsPerPage);
  for (var i = 1; i <= pageCount; i++) {
    var btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) {
      btn.classList.add("active");
    }
    btn.onclick = (function (page) {
      return function () {
        currentPage = page;
        filterItems(document.querySelector(".filter-buttons .active")?.getAttribute("data-cat"), document.getElementById("searchInput").value);
      };
    })(i);
    pagination.appendChild(btn);
  }
}

document.getElementById("searchInput").addEventListener("input", function () {
  currentPage = 1;
  filterItems(document.querySelector(".filter-buttons .active")?.getAttribute("data-cat"), this.value);
});

window.onload = fetchAndRenderData;
