(function(){
  function setCssOption(){
    var today = new Date().getDay();
    if(today === 0) today = 7;
    var option = (today === 6 || today === 7) ? 1 : today;
    document.body.setAttribute("data-css-option", option.toString());
  }

  function trimText(str){
    return str ? str.replace(/^\s+|\s+$/g, "") : "";
  }
  
  function loadXML(url, callback){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function(){
      if(xhr.readyState === 4){
        if(xhr.status === 200){
          var parser = new DOMParser();
          var xmlDoc = parser.parseFromString(xhr.responseText, "application/xml");
          callback(xmlDoc);
        } else {
          console.error("فشل تحميل ملف XML");
          callback(null);
        }
      }
    };
    xhr.send(null);
  }
  
  function getText(parent, tagName){
    var el = parent.getElementsByTagName(tagName);
    return el.length > 0 ? trimText(el[0].textContent) : "";
  }
  
  function populateContent(appNode){
    if(!appNode){
      document.getElementById("app-name").textContent = "لم يتم العثور على بيانات التطبيق";
      return;
    }
    
    // Basic info population (same as before)
    document.getElementById("app-name").textContent = getText(appNode, "appName");
    document.getElementById("interstitial").textContent = getText(appNode, "interstitial");
    document.getElementById("intro-text").textContent = getText(appNode, "introduction");
    
    // Image
    var imgEl = document.getElementById("header-image");
    var headerImage = getText(appNode, "headerImage");
    imgEl.src = headerImage ? 
      "https://desertengineer.github.io/Common/BekeiratSoftwareBlog/AppsImages/" + headerImage : "";
    imgEl.alt = getText(appNode, "appName") + " صورة تعريفية";

    // General use
    var generalUseList = document.getElementById("general-use-list");
    generalUseList.innerHTML = "";
    var uses = appNode.getElementsByTagName("use");
    for(var i = 0; i < uses.length; i++){
      var category = getText(uses[i], "category");
      var description = getText(uses[i], "description");
      if(category && description){
        var li = document.createElement("li");
        li.textContent = category + ": " + description;
        generalUseList.appendChild(li);
      }
    }

    // Pricing
    var pricingTbody = document.getElementById("pricing-table").tBodies[0];
    pricingTbody.innerHTML = "";
    var plans = appNode.getElementsByTagName("plan");
    for(var j = 0; j < plans.length; j++){
      var tr = document.createElement("tr");
      
      var name = getText(plans[j], "name");
      var nameTd = document.createElement("td");
      nameTd.textContent = name;
      nameTd.setAttribute("data-label", "الخطة");
      tr.appendChild(nameTd);
      
      var features = getText(plans[j], "features");
      var featTd = document.createElement("td");
      featTd.textContent = features;
      featTd.setAttribute("data-label", "المميزات");
      tr.appendChild(featTd);
      
      var price = getText(plans[j], "price");
      var priceTd = document.createElement("td");
      priceTd.textContent = price;
      priceTd.setAttribute("data-label", "السعر");
      tr.appendChild(priceTd);
      
      pricingTbody.appendChild(tr);
    }

    // YouTube
    var ytIframe = document.getElementById("youtube-iframe");
    ytIframe.src = getText(appNode, "iframeSrc");
    ytIframe.title = getText(appNode, "appName") + " فيديو تجريبي";

    // FIXED: Pros and cons handling
    var prosList = document.getElementById("pros-list");
    prosList.innerHTML = "";
    var pros = appNode.getElementsByTagName("pros")[0];
    if(pros){
      var prosPoints = pros.getElementsByTagName("point");
      for(var p = 0; p < prosPoints.length; p++){
        var li = document.createElement("li");
        li.textContent = trimText(prosPoints[p].textContent);
        prosList.appendChild(li);
      }
    }
    
    var consList = document.getElementById("cons-list");
    consList.innerHTML = "";
    var cons = appNode.getElementsByTagName("cons")[0];
    if(cons){
      var consPoints = cons.getElementsByTagName("point");
      for(var c = 0; c < consPoints.length; c++){
        var li = document.createElement("li");
        li.textContent = trimText(consPoints[c].textContent);
        consList.appendChild(li);
      }
    }

    // App link
    var appLink = document.getElementById("app-link");
    appLink.href = getText(appNode, "appLink");
    appLink.textContent = "زيارة الموقع الرسمي لـ " + getText(appNode, "appName");
  }

  function main(){
    setCssOption();
    loadXML(
      "https://desertengineer.github.io/Common/BekeiratSoftwareBlog/xmls/AppsPromotion_1.xml", 
      function(xmlDoc){
        if(xmlDoc){
          var apps = xmlDoc.getElementsByTagName("app");
          for(var i = 0; i < apps.length; i++){
            if(getText(apps[i], "appName") === "جيميني"){
              populateContent(apps[i]);
              break;
            }
          }
        } else {
          document.getElementById("app-name").textContent = "خطأ في تحميل البيانات";
        }
      }
    );
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", main);
  } else {
    main();
  }
})();
