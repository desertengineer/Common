var xmlFolder = "https://desertengineer.github.io/Common/BekeiratSoftwareBlog/xmls";
  var cssFolder = "https://desertengineer.github.io/Common/BekeiratSoftwareBlog/css";
  var jsFolder = "https://desertengineer.github.io/Common/BekeiratSoftwareBlog/js";

  var xmlUrl = xmlFolder + "/AppsPromotion_1.xml";
console.log(xmlUrl);
  function trimText(str) {
    return str.replace(/^\s+|\s+$/g, "");
  }

  function loadXML(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if(xhr.status === 200) {
          var xmlDoc = xhr.responseXML;
          if (!xmlDoc) {
            var parser = new DOMParser();
            xmlDoc = parser.parseFromString(xhr.responseText, "application/xml");
          }
          callback(xmlDoc);
        } else {
          console.error("Failed to load XML file: " + url + " Status: " + xhr.status);
          callback(null);
        }
      }
    };
    xhr.send(null);
  }

  function getText(parent, tagName) {
    var el = parent.getElementsByTagName(tagName);
    if(el.length > 0) {
      return trimText(el[0].textContent);
    }
    return "";
  }

  function getChildElements(parent, tagName) {
    return parent.getElementsByTagName(tagName);
  }

  function populateContent(appNode) {
    if (!appNode) {
      // clear placeholders if no data
      document.getElementById("app-name").textContent = "Application data not found";
      return;
    }

    var appName = getText(appNode, "appName");
    var headerImage = getText(appNode, "headerImage");
    var interstitial = getText(appNode, "interstitial");
    var introduction = getText(appNode, "introduction");

    document.getElementById("app-name").textContent = appName;
    var imgEl = document.getElementById("header-image");
    imgEl.setAttribute("src", headerImage);
    imgEl.setAttribute("alt", appName + " AI Application Header Image");

    document.getElementById("interstitial").textContent = interstitial;
    document.getElementById("intro-text").textContent = introduction;

    // General use
    var generalUseList = document.getElementById("general-use-list");
    generalUseList.innerHTML = "";
    var generalUseNodes = appNode.getElementsByTagName("generalUse");
    if(generalUseNodes.length > 0) {
      var uses = generalUseNodes[0].getElementsByTagName("use");
      for(var i = 0; i < uses.length; i++) {
        var category = getText(uses[i], "category");
        var description = getText(uses[i], "description");
        if(category.length > 0 && description.length > 0) {
          var liNode = document.createElement("li");
          liNode.textContent = category + ": " + description;
          generalUseList.appendChild(liNode);
        }
      }
    }

    // Pricing Plans
    var pricingTbody = document.getElementById("pricing-table").getElementsByTagName("tbody")[0];
    pricingTbody.innerHTML = "";
    var pricingNodes = appNode.getElementsByTagName("pricingPlans");
    if(pricingNodes.length > 0) {
      var plans = pricingNodes[0].getElementsByTagName("plan");
      for(var j = 0; j < plans.length; j++) {
        var planName = getText(plans[j], "name");
        var planFeatures = getText(plans[j], "features");
        var planPrice = getText(plans[j], "price");

        var trNode = document.createElement("tr");

        var tdName = document.createElement("td");
        tdName.setAttribute("data-label", "Plan");
        tdName.textContent = planName;
        trNode.appendChild(tdName);

        var tdFeatures = document.createElement("td");
        tdFeatures.setAttribute("data-label", "Features");
        tdFeatures.textContent = planFeatures;
        trNode.appendChild(tdFeatures);

        var tdPrice = document.createElement("td");
        tdPrice.setAttribute("data-label", "Price");
        tdPrice.textContent = planPrice;
        trNode.appendChild(tdPrice);

        pricingTbody.appendChild(trNode);
      }
    }

    // YouTube embed
    var ytContainer = document.getElementById("youtube-placeholder");
    ytContainer.innerHTML = "";
    var ytLink = getText(appNode, "youtubeEmbed");
    if(ytLink.length > 0) {
      var embedUrl = "";
      if(ytLink.indexOf("youtube.com/embed/") !== -1) {
        embedUrl = ytLink;
      } else if(ytLink.indexOf("youtube.com/watch?v=") !== -1) {
        var vidId = ytLink.split("v=")[1].split("&")[0];
        embedUrl = "https://www.youtube.com/embed/" + vidId;
      } else if(ytLink.indexOf("youtu.be/") !== -1) {
        var vidIdShort = ytLink.split("youtu.be/")[1].split("?")[0];
        embedUrl = "https://www.youtube.com/embed/" + vidIdShort;
      }
      if(embedUrl.length > 0) {
        var iframe = document.createElement("iframe");
        iframe.setAttribute("src", embedUrl);
        iframe.setAttribute("title", appName + " Demo Video");
        iframe.setAttribute("allowfullscreen", "true");
        ytContainer.appendChild(iframe);
      }
    }

    // Pros and Cons
    var prosList = document.getElementById("pros-list");
    prosList.innerHTML = "";
    var consList = document.getElementById("cons-list");
    consList.innerHTML = "";

    var prosNodes = appNode.getElementsByTagName("pros");
    if(prosNodes.length > 0) {
      var points = prosNodes[0].getElementsByTagName("point");
      for(var p = 0; p < points.length; p++) {
        var li = document.createElement("li");
        li.textContent = trimText(points[p].textContent);
        prosList.appendChild(li);
      }
    }
    var consNodes = appNode.getElementsByTagName("cons");
    if(consNodes.length > 0) {
      var cpoints = consNodes[0].getElementsByTagName("point");
      for(var c = 0; c < cpoints.length; c++) {
        var li2 = document.createElement("li");
        li2.textContent = trimText(cpoints[c].textContent);
        consList.appendChild(li2);
      }
    }

    // Application link
    var appLinkUrl = getText(appNode, "appLink");
    var appLinkEl = document.getElementById("app-link");
    appLinkEl.setAttribute("href", appLinkUrl);
    appLinkEl.textContent = "Visit " + appName + " Official Website";
  }

  // Start loading and populating content
  loadXML(xmlUrl, function(xmlDoc) {
    if(xmlDoc) {
      var apps = xmlDoc.getElementsByTagName("app");
      var targetApp = null;
      // Find Gemini app by name (you can change logic here as needed)
      for(var k = 0; k < apps.length; k++) {
        var name = getText(apps[k], "appName");
        if(name.toLowerCase() === "gemini") {
          targetApp = apps[k];
          break;
        }
      }
      populateContent(targetApp);
    } else {
      console.error("XML document was not loaded.");
      document.getElementById("app-name").textContent = "Error loading app data.";
    }
  });
})();
