// AppsPromotion_1.js

// Set CSS option based on day of week
function setCssOption() {
    const today = new Date().getDay(); // Sunday=0, Monday=1 ... Saturday=6
    let option;
    
    // Map days to options 1-7
    if (today === 0) option = 7; // Sunday
    else option = today; // Monday=1, Tuesday=2, ..., Saturday=6
    
    document.body.setAttribute("data-css-option", option.toString());
}

// Run on page load
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setCssOption);
} else {
    setCssOption();
}

// Function to trim text (without regex)
function trimText(str) {
    if (typeof str !== 'string') return '';
    
    // Remove whitespace from start
    var start = 0;
    while (start < str.length && (str[start] === ' ' || str[start] === '\t' || str[start] === '\n' || str[start] === '\r')) {
        start++;
    }
    
    // Remove whitespace from end
    var end = str.length - 1;
    while (end >= start && (str[end] === ' ' || str[end] === '\t' || str[end] === '\n' || str[end] === '\r')) {
        end--;
    }
    
    return str.substring(start, end + 1);
}

// Function to load XML data
function loadXML(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(xhr.responseText, "text/xml");
                callback(xmlDoc);
            } else {
                console.error("فشل تحميل ملف XML");
                callback(null);
            }
        }
    };
    xhr.send(null);
}

// Function to get text content from XML element
function getText(parent, tagName) {
    var elements = parent.getElementsByTagName(tagName);
    if (elements.length > 0) {
        return trimText(elements[0].textContent);
    }
    return "";
}

// Function to populate the template with app data
function populateAppData(appNode, appName) {
    // Set basic information
    document.getElementById("appName").textContent = getText(appNode, "appName");
    document.getElementById("interstitial").textContent = getText(appNode, "interstitial");
    document.getElementById("introduction").textContent = getText(appNode, "introduction");
    
    // Set header image
    var headerImage = document.getElementById("headerImage");
    var imageFile = getText(appNode, "headerImage");
    headerImage.src = "https://desertengineer.github.io/Common/BekeiratSoftwareBlog/AppsImages/" + imageFile;
    headerImage.alt = "صورة تعريفية لتطبيق " + getText(appNode, "appName");
    
    // Populate use cases
    var useCasesContainer = document.getElementById("useCases");
    useCasesContainer.innerHTML = "";
    
    for (var i = 1; i <= 4; i++) {
        var useCase = getText(appNode, "generalUse" + i);
        if (useCase) {
            var useCaseDiv = document.createElement("div");
            useCaseDiv.className = "use-case";
            
            // Split use case into category and description
            var parts = useCase.split(":");
            if (parts.length > 1) {
                var category = parts[0];
                var description = parts.slice(1).join(":").trim();
                
                useCaseDiv.innerHTML = "<h3>" + category + "</h3><p>" + description + "</p>";
            } else {
                useCaseDiv.innerHTML = "<p>" + useCase + "</p>";
            }
            
            useCasesContainer.appendChild(useCaseDiv);
        }
    }
    
    // Populate pricing plans
    var pricingTable = document.getElementById("pricingPlans");
    pricingTable.innerHTML = "";
    
    for (var j = 1; j <= 3; j++) {
        var planName = getText(appNode, "plan" + j + "Name");
        var planFeatures = getText(appNode, "plan" + j + "Features");
        var planPrice = getText(appNode, "plan" + j + "Price");
        
        if (planName && planFeatures && planPrice) {
            var row = document.createElement("tr");
            row.innerHTML = "<td>" + planName + "</td><td>" + planFeatures + "</td><td>" + planPrice + "</td>";
            pricingTable.appendChild(row);
        }
    }
    
    // Set YouTube iframe
    var youtubeIframe = document.getElementById("youtubeIframe");
    youtubeIframe.src = getText(appNode, "iframeSrc");
    youtubeIframe.title = "فيديو تعريفي لتطبيق " + getText(appNode, "appName");
    
    // Populate pros
    var prosList = document.getElementById("prosList");
    prosList.innerHTML = "";
    
    for (var k = 1; k <= 4; k++) {
        var pro = getText(appNode, "pro" + k);
        if (pro) {
            var li = document.createElement("li");
            li.textContent = pro;
            prosList.appendChild(li);
        }
    }
    
    // Populate cons
    var consList = document.getElementById("consList");
    consList.innerHTML = "";
    
    for (var m = 1; m <= 3; m++) {
        var con = getText(appNode, "con" + m);
        if (con) {
            var li = document.createElement("li");
            li.textContent = con;
            consList.appendChild(li);
        }
    }
    
    // Set app link
    var appLink = document.getElementById("appLink");
    appLink.href = getText(appNode, "appLink");
    appLink.textContent = "زيارة الموقع الرسمي لـ " + getText(appNode, "appName");
}

// Main function to initialize everything
function init() {
    // Set CSS option based on day of week
    setCssOption();
    
    // Load XML data
    var xmlUrl = "https://desertengineer.github.io/Common/BekeiratSoftwareBlog/xmls/AppsPromotion_1.xml";
    loadXML(xmlUrl, function(xmlDoc) {
        if (xmlDoc) {
            var apps = xmlDoc.getElementsByTagName("app");
            var targetApp = null;
            var appName = "جيميني"; // The app we want to display
            
            // Find the app by name
            for (var i = 0; i < apps.length; i++) {
                var currentAppName = getText(apps[i], "appName");
                if (currentAppName === appName) {
                    targetApp = apps[i];
                    break;
                }
            }
            
            if (targetApp) {
                populateAppData(targetApp, appName);
            } else {
                console.error("التطبيق '" + appName + "' غير موجود في ملف XML");
            }
        } else {
            console.error("تعذر تحميل ملف XML");
        }
    });
}

// Wait for DOM to be fully loaded
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
