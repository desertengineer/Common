// MainTheme_00.js

// Function to dynamically load a CSS file
function loadCssFile(fileName) {
  var head = document.getElementsByTagName('head')[0];
  var link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('type', 'text/css');
  // Concatenate string for the href attribute
  link.setAttribute('href', "https://desertengineer.github.io/Common/BekeiratSoftwareBlog/css/" + fileName);
  head.appendChild(link);
}

// Function to initialize the theme
function initializeBloggerTheme() {
  // Example of loading an alternative CSS file based on a condition
  // For instance, if you had a data attribute on the body like:
  // <body data-theme-variant="01">
  var bodyElement = document.body;
  var themeVariant = bodyElement.getAttribute('data-theme-variant');

  if (themeVariant === "01") {
    loadCssFile("MainTheme_01.js.css");
  } else if (themeVariant === "02") {
    loadCssFile("MainTheme_02.js.css");
  }
  // Default (MainTheme_00.js.css) is already loaded via <link> tag in HTML

  // Mobile Hamburger Menu Toggle
  var hamburger = document.querySelector(".hamburger-menu");
  var navList = document.querySelector(".page-menu-list");

  if (hamburger && navList) {
    hamburger.addEventListener("click", function() {
      navList.classList.toggle("active");
    });
  }

  // Mobile Dropdown Toggle (for touch devices)
  var menuItems = document.querySelectorAll(".page-menu-list .menu-item");
  for (var i = 0; i < menuItems.length; i++) {
    (function(index) { // Using IIFE to capture 'i'
      var menuItem = menuItems[index];
      var menuLink = menuItem.querySelector(".menu-link");
      var dropdown = menuItem.querySelector(".dropdown-menu");

      if (menuLink && dropdown) {
        menuLink.addEventListener("click", function(event) {
          // Prevent default link behavior if it has a dropdown
          if (window.innerWidth <= 768) { // Apply only on mobile
            event.preventDefault();
            menuItem.classList.toggle("active");
          }
        });
      }
    })(i);
  }

  // Close mobile menu when clicking outside
  document.addEventListener("click", function(event) {
    if (window.innerWidth <= 768) {
      var isClickInsideNav = navList.contains(event.target) || hamburger.contains(event.target);
      if (!isClickInsideNav && navList.classList.contains("active")) {
        navList.classList.remove("active");
        // Also close any open dropdowns
        var activeDropdowns = document.querySelectorAll(".page-menu-list .menu-item.active");
        for (var i = 0; i < activeDropdowns.length; i++) {
          activeDropdowns[i].classList.remove("active");
        }
      }
    }
  });

  // Close dropdowns when resizing from mobile to desktop
  window.addEventListener("resize", function() {
    if (window.innerWidth > 768) {
      if (navList.classList.contains("active")) {
        navList.classList.remove("active");
      }
      var activeDropdowns = document.querySelectorAll(".page-menu-list .menu-item.active");
      for (var i = 0; i < activeDropdowns.length; i++) {
        activeDropdowns[i].classList.remove("active");
      }
    }
  });
}

// Ensure the function runs after the DOM is fully loaded
window.addEventListener('load', initializeBloggerTheme);
