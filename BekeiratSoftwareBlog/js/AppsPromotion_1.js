(function(){
  // اختيار css بناءً على اليوم (1-5)، الجمعة (6) يعيد 1
  function setCssOption(){
    var today = new Date().getDay(); // الأحد=0, الإثنين=1 ... السبت=6
    // نقوم بتحويل الأحد (0) ليكون 7 لسهولة الحساب (الأحد غير مستعمل)
    if(today === 0){
      today = 7;
    }
    // اليوم الفعلي المطلوب هو Mon=1 ... Fri=5; Sat=6; Sun=7
    // هل الجمعة (6) يعيد إلى 1 حسب المطلوب
    var option;
    if(today === 6 || today ===7){
      option = 1; // إعادة لل1 في الجمعة والسبت والأحد (لأن الأحد صفر)
    } else {
      option = today; // من 1 إلى 5 غرفة العمل (الاثنين إلى الجمعة)
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
      var

  function main(){
    setCssOption();
    var xmlFile = "https://desertengineer.github.io/Common/BekeiratSoftwareBlog/xmls/AppsPromotion_1.xml";
    loadXML(xmlFile, function(xmlDoc){
      if(xmlDoc){
        var apps = xmlDoc.getElementsByTagName("app");
        var targetApp = null;
        for(var i=0; i<apps.length; i++){
          var name = getText(apps[i], "appName");
          // مثال: نبحث عن تطبيق "جيميني" بالحرف العربي
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
    document.addEventListener("DOMContentLoaded", function(){
      main();
    });
  } else {
    main();
  }
})();
