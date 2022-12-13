//function chooseProject(){var count=document.getElementByid ("projectNum").value; loadPageTexts(); console.log(count);};

function loadPageTexts() {

var xmlFile="file:///D:/!%20DRIVES/OneDrive/Desktop/2-HTML%20&%20JScript/2_JavaScript/web%20page%20with%20external%20text%20resources/UbariProjects.xml"
var myXML=new XMLHttpRequest()


myXML.onreadystatechange = function () {if (this.readyState == 4 && this.status == 200) {projectDetails(this);}};
myXML.open("GET",xmlFile,true);
myXML.send(); 

function projectDetails(xml) {const title = document.querySelector('h1'); 
	var count=title.id.slice(5) ; 
	var xmlDoc = xml.responseXML;
//  populate XML data to the HTML text tags
	const tags=["h1", "h3", "p" ];
	for (let i = 0; i < tags.length; i++) { 
document.getElementsByTagName (tags[i])[0].innerHTML=xmlDoc.getElementsByTagName(tags[i])[count].childNodes[0].nodeValue ;}

// change the page title
document.getElementsByTagName ("title")[0].innerHTML=xmlDoc.getElementsByTagName("h1")[count].childNodes[0].nodeValue ;

// replace the image source
	var imageUrl ="'"+xmlDoc.getElementsByTagName("img")[count].childNodes[0].nodeValue +"'"; 
	var myImg=document.getElementsByTagName ("img")[0];
	myImg.outerHTML = "<img src="+imageUrl+ ""+"/>";
	//var tmpUrl=myImg.src; 

}; 

}; 