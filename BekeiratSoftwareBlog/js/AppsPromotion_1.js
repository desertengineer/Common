(function(){
  // ضبط خيار CSS حسب اليوم (1-5) و إعادة 1 للجمعة (6) وما بعده
  function setCssOption(){
    var today = new Date().getDay(); // الأحد=0، الإثنين=1 ... السبت=6
    if(today === 0){
      today = 7; // الأحد =7 لتسهيل الحساب
    }
    var option;
    if(today === 6 || today === 7){
      option = 1; // الجمعة والسبت والأحد يعيد 1
    } else {
      option = today; // الاثنين=1 .. الجمعة=5
    }
    document.body.setAttribute("data-css-option", option.toString());
  }

  function trimText(str){
    return str.replace(/^\s+|\s+$/g, "");
  }
  function loadXML(url, callback){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function(){
      if(xhr.readyState === 4){
        if(xhr.status === 200){
          var xmlDoc = xhr.responseXML;
          if(!xmlDoc){
            var parser = new DOMParser();
            xmlDoc = parser.parseFromString(xhr.responseText, "application/xml");
          }
          callback(xmlDoc);
        } else {
          console.error("فشل تحميل ملف XML: " + url + " الحالة: " + xhr.status);
          callback(null);
        }
      }
    };
    xhr.send(null);
  }
  function getText(parent, tagName){
    var el = parent.getElementsByTagName(tagName);
    if(el.length > 0){
      return trimText(el[0].textContent);
    }
    return "";
  }
  function populateContent(appNode){
    if(!appNode){
      document.getElementById("app-name").textContent = "لم يتم العثور على بيانات التطبيق";
      return;
    }
    var appName = getText(appNode, "appName");
    var headerImageFile = getText(appNode, "headerImage");
    var interstitial = getText(appNode, "interstitial");
    var introduction = getText(appNode, "introduction");

    document.getElementById("app-name").textContent = appName;
    var imgEl = document.getElementById("header-image");
    if(headerImageFile.length > 0){
      imgEl.setAttribute("src", "https://desertengineer.github.io/Common/BekeiratSoftwareBlog/AppsImages/" + headerImageFile);
    } else {
      imgEl.setAttribute("src", "");
    }
    imgEl.setAttribute("alt", appName + " صورة تعريفية لتطبيق الذكاء الاصطناعي");

    document.getElementById("interstitial").textContent = interstitial;
    document.getElementById("intro-text").textContent = introduction;

    // الاستخدام العام
    var generalUseList = document.getElementById("general-use-list");
    generalUseList.innerHTML = "";
    var generalUses = appNode.getElementsByTagName("generalUse");
    if(generalUses.length > 0){
      var uses = generalUses[0].getElementsByTagName("use");
      for(var i=0;i<uses.length;i++){
        var category = getText(uses[i], "category");
        var description = getText(uses[i], "description");
        if(category.length > 0 && description.length > 0){
          var li = document.createElement("li");
          li.textContent = category + ": " + description;
          generalUseList.appendChild(li);
        }
      }
    }
    // خطط التسعير
    var pricingTbody = document.getElementById("pricing-table").getElementsByTagName("tbody")[0];
    pricingTbody.innerHTML = "";
    var pricingPlans = appNode.getElementsByTagName("pricingPlans");
    if(pricingPlans.length > 0){
      var plans = pricingPlans[0].getElementsByTagName("plan");
      for(var j=0;j<plans.length;j++){
        var planName = getText(plans[j], "name");
        var planFeatures = getText(plans[j], "features");
        var planPrice = getText(plans[j], "price");

        var tr = document.createElement("tr");

        var tdName = document.createElement("td");
        tdName.setAttribute("data-label", "الخطة");
        tdName.textContent = planName;
        tr.appendChild(tdName);

        var tdFeat = document.createElement("td");
        tdFeat.setAttribute("data-label", "المميزات");
        tdFeat.textContent = planFeatures;
        tr.appendChild(tdFeat);

        var tdPrice = document.createElement("td");
        tdPrice.setAttribute("data-label", "السعر");
        tdPrice.textContent = planPrice;
        tr.appendChild(tdPrice);

        pricingTbody.appendChild(tr);
      }
    }

    // تضمين يوتيوب (iframe src من XML)
    var ytIframe = document.getElementById("youtube-iframe");
    ytIframe.setAttribute("src", "");
    var iframeSrc = getText(appNode, "iframeSrc");
    if(iframeSrc.length > 0){
      ytIframe.setAttribute("src", iframeSrc);
      ytIframe.setAttribute("title", appName + " فيديو تجريبي");
    } else {
      ytIframe.removeAttribute("src");
      ytIframe.setAttribute("title", "لا يوجد فيديو تجريبي متوفر");
    }

    // الإيجابيات والسلبيات
    var prosList = document.getElementById("pros-list");
    prosList.innerHTML = "";
    var consList = document.getElementById("cons-list");
    consList.innerHTML = "";

    var prosNodes = appNode.getElementsByTagName("pros");
    if(prosNodes.length > 0){
      var points = prosNodes[0].getElementsByTagName("point");
      for(var p=0;p<points.length;p++){
        var li = document.createElement("li");
        li.textContent = trimText(points[p].textContent);
        prosList.appendChild(li);
      }
    }
    var consNodes = appNode.getElementsByTagName("cons");
    if(consNodes.length > 0){
      var cpoints = consNodes[0].getElementsByTagName("point");
      for(var c=0;c<cpoints.length;c++){
        var li2 = document.createElement("li");
        li2.textContent = trimText(cpoints[c].textContent);
        consList.appendChild(li2);
      }
    }

    // رابط التطبيق
    var appLinkUrl = getText(appNode, "appLink");
    var appLinkEl = document.getElementById("app-link");
    appLinkEl.setAttribute("href", appLinkUrl);
    appLinkEl.textContent = "زيارة الموقع الرسمي لـ " + appName;
  }

  function main(){
    setCssOption();
    var xmlFile = "https://desertengineer.github.io/Common/BekeiratSoftwareBlog/xmls/AppsPromotion_1.xml";
    loadXML(xmlFile, function(xmlDoc){
      if(xmlDoc){
        var apps = xmlDoc.getElementsByTagName("app");
        var targetApp = null;
        for(var i=0; i<apps.length; i++){
          var name = getText(apps[i], "appName");
          if(name === "جيميني"){
            targetApp = apps[i];
            break;
          }
        }
        populateContent(targetApp);
      } else {
        document.getElementById("app-name").textContent = "حدث خطأ أثناء تحميل بيانات التطبيق.";
        console.error("تعذر تحميل أو تحليل ملف XML.");
      }
    });
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", main);
  } else {
    main();
  }
})();
