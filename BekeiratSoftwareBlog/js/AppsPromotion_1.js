document.addEventListener("DOMContentLoaded", function() {
    // 1. اختر الثيم بناءً على تاريخ اليوم (1–7)
    var today = new Date();
    var variant = (today.getDate() % 7) + 1;

    // اقرأ العنصر .container وحمّل السمة data-app منه
    var containerEl = document.querySelector(".container");
    containerEl.classList.add("variant-" + variant);

    // حدد اسم التطبيق من data-app على الحاوية
    var targetApp = containerEl.getAttribute("data-app");

    // 2. تحميل ملف XML
    var xmlURL = "https://desertengineer.github.io/Common/BekeiratSoftwareBlog/xmls/AppsPromotion_1.xml";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", xmlURL, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(xhr.responseText, "application/xml");
            var apps = xmlDoc.getElementsByTagName("app");
            for (var i = 0; i < apps.length; i++) {
                var appNode = apps[i];
                var nameNode = appNode.getElementsByTagName("appName")[0];
                if (nameNode && nameNode.textContent.toLowerCase() === targetApp.toLowerCase()) {


                    // صورة الهيدر
                    var imgName = appNode.getElementsByTagName("headerImage")[0].textContent;
                    var imgEl = document.getElementById("headerImage");
                    imgEl.src = "https://desertengineer.github.io/Common/BekeiratSoftwareBlog/AI_Apps_Images/" + imgName;
                    imgEl.alt = "صورة تعريفية لتطبيق " + nameNode.textContent;

                    // الاسم والوصف
                    document.getElementById("appName").textContent = nameNode.textContent;
                    document.getElementById("interstitial").textContent =
                        appNode.getElementsByTagName("interstitial")[0].textContent;
                    document.getElementById("introduction").textContent =
                        appNode.getElementsByTagName("introduction")[0].textContent;

                    // الاستخدامات العامة
                    var ucContainer = document.getElementById("useCases");
                    ucContainer.innerHTML = "";
                    var ulUC = document.createElement("ul");
                    for (var u = 1; u <= 10; u++) {
                        var tag = "generalUse" + u;
                        var el = appNode.getElementsByTagName(tag)[0];
                        if (el) {
                            var li = document.createElement("li");
                            li.textContent = el.textContent;
                            ulUC.appendChild(li);
                        }
                    }
                    ucContainer.appendChild(ulUC);

                    // خطط التسعير
                    var priceBody = document.getElementById("pricingPlans");
                    priceBody.innerHTML = "";
                    for (var p = 1; p <= 10; p++) {
                        var nTag = "plan" + p + "Name";
                        var fTag = "plan" + p + "Features";
                        var prTag = "plan" + p + "Price";
                        var nEl = appNode.getElementsByTagName(nTag)[0];
                        if (nEl) {
                            var row = document.createElement("tr");
                            var c1 = document.createElement("td");
                            c1.textContent = nEl.textContent;
                            var c2 = document.createElement("td");
                            var feat = appNode.getElementsByTagName(fTag)[0];
                            c2.textContent = feat ? feat.textContent : "";
                            var c3 = document.createElement("td");
                            var cost = appNode.getElementsByTagName(prTag)[0];
                            c3.textContent = cost ? cost.textContent : "";
                            row.appendChild(c1);
                            row.appendChild(c2);
                            row.appendChild(c3);
                            priceBody.appendChild(row);
                        }
                    }

                    // فيديو يوتيوب
                    var iframe = document.getElementById("youtubeIframe");
                    iframe.src = appNode.getElementsByTagName("iframeSrc")[0].textContent;

                    // الإيجابيات
                    var prosUl = document.getElementById("prosList");
                    prosUl.innerHTML = "";
                    for (var pr = 1; pr <= 10; pr++) {
                        var prTag = "pro" + pr;
                        var prEl = appNode.getElementsByTagName(prTag)[0];
                        if (prEl) {
                            var liP = document.createElement("li");
                            liP.textContent = prEl.textContent;
                            prosUl.appendChild(liP);
                        }
                    }

                    // السلبيات
                    var consUl = document.getElementById("consList");
                    consUl.innerHTML = "";
                    for (var co = 1; co <= 10; co++) {
                        var coTag = "con" + co;
                        var coEl = appNode.getElementsByTagName(coTag)[0];
                        if (coEl) {
                            var liC = document.createElement("li");
                            liC.textContent = coEl.textContent;
                            consUl.appendChild(liC);
                        }
                    }

                    // رابط التطبيق
                    var linkEl = document.getElementById("appLink");
                    linkEl.href = appNode.getElementsByTagName("appLink")[0].textContent;
                    break;
                }
            }
        }
    };
    xhr.send(null);
});
