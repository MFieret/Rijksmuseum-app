$('#sendMsgBtn').click(exampleAlert); // Collect HTML element with (#) id sendMsgBtn, when click do function exampleAlert

function exampleAlert() {
	alert("Author: " + $('#author').val() + "\nMessage: " + $('#message').val());
	console.log("Button pressed!");
}
 
function exampleAPICall() {  
    // NB: pass params depending on API documentation at https://data.rijksmuseum.nl/object-metadata/api/
    // Any params passed are to append to the url variable below
    // Replace [apikey] with your own API key
    let url = "https://www.rijksmuseum.nl/api/nl/collection?key=6ASxeKS6&involvedMaker=Rembrandt+van+Rijn";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
 
    xmlhttp.send();
    xmlhttp.addEventListener("readystatechange", processRequest, false);
 
    function processRequest(e) {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            json_file = JSON.parse(xmlhttp.responseText);
 
            // Whatever your heart and soul desires for the JSON file, has to be done in this block
            alert(JSON.stringify(json_file));
        }
    }
    
}
 
console.log('hello')
