/*function prRequest(id, runner){
	var doc = document.createElement("html");
	var request = new XMLHttpRequest();
    request.open("GET", "https://www.milesplit.com/athletes/"+id);
	request.onreadystatechange = function() {
        if (this.readyState == this.DONE && this.status == 200) {
            if (this.responseText) {
				var url = this.responseText.substring(37,this.responseText.length-7);
                doc.innerHTML = url;
				generateNotifications(doc, id, runner);
            }
            else { console.log("Error"); }
        }
    };
	request.send();
}

function isEqual(a, b) {
	var akeys = Object.keys(a);
	var bkeys = Object.keys(b);

	if(akeys.length != bkeys.length)
		return false;

	//check times
	for(var i = 0; i < akeys.length; i++){
		var key = akeys[i];
		if(bkeys.indexOf(key) < 0 || a[key] != b[key]){
			return false;
		}
	}
	return true;
}

function generateNotifications(doc, id, runner){
	if(runner["pr?"])
		return;

	var newrunner = getRunnerData(doc, id)[id];
	var oldrunner = runner;
	if(!isEqual(oldrunner, newrunner)){
		newrunner["pr?"] = true
		var notification = {};
		notification[id] = newrunner;
		chrome.storage.local.set(notification);
	}
}


function getName(doc, id){
	var title = doc.getElementsByTagName("title")[0];
	var name = title.innerHTML.substring(0, title.innerHTML.indexOf("-")-1);
	return name;
}

//return a runner
function getRunnerData(doc, id){
	var runner = {};
	var prs = {};
	var prElements = doc.getElementsByClassName("personal-record");
	for(var i = 0; i < prElements.length; i++){
		var time = prElements[i].innerHTML.trim();
		var eventElement = prElements[i].parentElement.parentElement.parentElement.parentElement;
		var event = eventElement.getElementsByClassName("event-heading")[0].innerHTML.trim();
		var seasonElement = eventElement.parentElement;
		event = event + " (" + seasonElement.getAttribute("data-season").trim() + ")";
		prs[event] = time;
	}
	prs["name"] = getName(doc, id);
	prs["pr?"] = false;
	runner[id] = prs;
	return runner;
}
*/