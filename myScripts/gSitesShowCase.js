fetchData=function (file) { 
  fetch(file)
    .then((response) => response.text())
    .then((text) => { 
      sessionStorage.filelData= text; 
      //console.log(text); 
      //div.innerHTML=sessionStorage.filelData;
    });   
}  

  var xhttp;
function loadXMLDoc(filename)
{
  if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
    xhttp=new XMLHttpRequest();
    }
  else
    {// code for IE6, IE5
      xhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.onreadystatechange=function()
    {
    if (xhttp.readyState==4 && xhttp.status==200)
      {
      }
    }
    xhttp.open("GET",filename,false);
    xhttp.send();
return xhttp.responseXML;
}

function transformXsl(xml,xsl,elemId){  
   document.querySelector('h1#sector-title').innerHTML="";
  document.getElementById(elemId).innerHTML= "";
  
// code for IE
if (window.ActiveXObject || xhttp.responseType == "msxml-document")
  {
    ex = xml.transformNode(xsl); 
    document.getElementById(elemId).innerHTML = ex;

  }
// code for Chrome, Firefox, Opera, etc.
else if (document.implementation && document.implementation.createDocument)
  {
    xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(xsl);
    resultDocument = xsltProcessor.transformToFragment(xml, document);
    document.getElementById(elemId).appendChild(resultDocument);
  }
} 
// to display requested pages

getNavLink=function (elem, sector) { 
  var title=elem.innerHTML;
  const page = document.getElementById("nav-page");
  const header =document.getElementById("header");
  const mediaMain= document.getElementById("main-wraper");
  w3.styleElement(header, 'display', "none");
  w3.styleElement(mediaMain, 'display', "none");
  var xmlFile="https://desertengineer.github.io/Common/xmls/SFLProjectsGallery.xml";
  var xslFile="https://desertengineer.github.io/Common/xsls/projectsGallery.xsl";
  var elemId="pjcts-gal";
  xml = loadXMLDoc(xmlFile);
  xsl = loadXMLDoc(xslFile);
  transformXsl(xml,xsl,elemId);
  document.querySelector('h1#sector-title').innerHTML= "sfl projects gallery"; 
  w3.styleElement(page, 'display', "block"); 
        //filterSelection(sector); 
        //displayProject();  
} 

displayProject = function (elem) {
  //var id = location.search.substring(1); 
    var projectId=elem.id;
      console.log(elem.id);
      var xmlFile="xmls/project-card.xml";
      var xslFile="xsls/project-card.xsl";
      xml = loadXMLDoc(xmlFile);
      xsl = loadXMLDoc(xslFile);
      var elemId="pjcts-gal";   
    var  bound=xml.getElementsByTagName('Id').length;
    //var xmlnode='<?xml version="1.0" encoding="utf-8"?>'+'<?xml-stylesheet type="text/xsl" href="../xsls/project-cards.xsl"?>'+'<MyProjects xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">';
    for (let index = 0; index < bound; index++) {
      if (xml.getElementsByTagName('Id')[index].textContent==projectId) {
       var  projectNode=xml.getElementsByTagName('Id')[index].parentElement;
        //xmlnode+=projectNode.outerHTML+'</MyProjects>';
      } 
    }
      console.log(projectNode);
  //xml=xmlnode;
    transformXsl(projectNode,xsl,elemId);
    //setTimeout(document.getElementById(elemId).appendChild(resultDocument),2000);
            document.querySelector('h1#sector-title').innerHTML= projectNode.getElementsByTagName('Title')[0].innerHTML; 
    /*var div = document.getElementById(elemId);
          document.querySelectorAll('#pjcts-gal a').forEach(occurence => {
          occurence.addEventListener('click', (e) => {
          let elementId = e.target.parentElement.id;
          console.log(elementId);          
        fetchData("xmls/project-cards.xml");
        var xmlText = sessionStorage.filelData; 
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                //populateElems(this,elementId);
            }
        };
        xmlhttp.open("GET", "xmls/project-cards.xml", true);
        xmlhttp.send();  
          });
        });    */
}  
var w3 = {};
w3.styleElements = function (elements, prop, val) {
  var i, l = elements.length;
  for (i = 0; i < l; i++) {    
    w3.styleElement(elements[i], prop, val);
  }
};
w3.styleElement = function (element, prop, val) {
  element.style.setProperty(prop, val);
};
w3.getElements = function (id) 
{if (typeof id == "object") {return [id];} else {return document.querySelectorAll(id);}
};
//filterSelection("all") 
  function filterSelection(c) { 
    var x, i,j=0;
    x = document.getElementsByClassName("pjct");
    //console.log(c);
    const msg=document.getElementById("no-pjcts-msg");
    if (c == "all") c = "";
    // Add the "show" class (display:block) to the filtered elements, and remove the "show" class from the elements that are not selected
    for (i = 0; i < x.length; i++) {
      w3RemoveClass(x[i],"show"); 
      msg.innerHTML="";
      if (x[i].className.indexOf(c) > -1) {
        w3AddClass(x[i],"show"); 
        j++;}      
    }
    console.log(" filter end");
      if (j==0) {
        msg.innerHTML="No Projects to display at the moment";} 
  } 
function w3AddClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) == -1) {
      element.className += " " + arr2[i];
    }
  }
} 
function w3RemoveClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1);
    }
  }
  element.className = arr1.join(" ");
}
