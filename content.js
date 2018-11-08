window.addEventListener ("load", myMain, false);

function follow(){
	console.log("we tryna follow");
	if(!signedIn()){
		alert("You must be signed in to Milesplit Pro to use this feature");
		return;
	}
	var id = getID();

	var doc = document.createElement("html");
	var request = new XMLHttpRequest();
    request.open("GET", "http://milesplit.com/athletes/"+id);
	request.onreadystatechange = function() {
        if (this.readyState == this.DONE && this.status == 200) {
            if (this.responseText) {
				var url = this.responseText.substring(37,this.responseText.length-7);
                doc.innerHTML = url;
				var runner = getRunnerData(doc, id, runner);
				chrome.storage.local.set(runner);
				var follow = document.getElementById("follow");
				var par = follow.parentElement;
				par.removeChild(follow);
				myMain(null);
            }
            else { console.log("Error"); }
        }
    };
	request.send();
}

function unfollow(){
	console.log("we tryna unfollow");
	var id = getID();
	chrome.storage.local.remove(id);
	var follow = document.getElementById("follow");
	var par = follow.parentElement;
	par.removeChild(follow);
	myMain(null);
}

function signedIn(){
	var pro = document.getElementById("proCallToAction");
	return pro == null;
}

function myMain (evt) {
    var header = document.getElementById("athleteName");
    var name = header.innerHTML;

    //check if we are already following
    var id = getID();
    var size = chrome.storage.local.getBytesInUse(id, function response(size){
	    if(size > 0){
	    	header.innerHTML =  name + "<button id=\'follow\'>Unfollow</button>";
			document.getElementById("follow").addEventListener("click", unfollow);
		}
		else{
			header.innerHTML =  name + "<button id=\'follow\'>Follow</button>";
			document.getElementById("follow").addEventListener("click", follow);
		}
    });
}

//get the id of the runner on the current page
function getID(){
	var url = window.location.href;
	var id = parseInt(url);
	while(isNaN(id)){
		url = url.substring(1);
		id = parseInt(url);
	}
	return String(id);
}

function getName(id){
	var title = document.getElementsByTagName("title")[0];
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
