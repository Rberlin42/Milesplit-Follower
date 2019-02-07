// load all followed runners from storage
chrome.storage.local.get(null, displayRunners);

// event listeners for buttons on this page
document.getElementById("unfollow").addEventListener("click", unfollow);
document.getElementById("select-all").addEventListener("click", selectAll);

function unfollow(){
	if(!confirm("Are you sure you want to unfollow all selected runners?"))
		return;

	var checkboxes = document.getElementsByTagName("input");
	for (var i = 0; i < checkboxes.length; i++){
		if(checkboxes[i].checked){
			chrome.storage.local.remove(checkboxes[i].parentElement.value + "");
			var lineitem = checkboxes[i].parentElement;
			var list = document.getElementById("runnersList");
			list.removeChild(lineitem);
			i--;
		}
	}
	chrome.tabs.reload();
}

function selectAll(){
	var checkboxes = document.getElementsByTagName("input");
	for(var i = 0; i < checkboxes.length; i++)
		checkboxes[i].checked = true;
}

function displayRunners(data){
	console.log(data);
	var ids = Object.keys(data);
	console.log(ids);

	// create a list of [id,name] pairs
	runners = [];
	for(var i = 0; i < ids.length; i++){
		if(isNaN(Number(ids[i])))
			continue;

		var name = data[ids[i]]["name"];
		runners.push([ids[i], name]);
	}

	// sort the list by last names
	runnners.sort(function(a,b){
		n1 = a.split(" ");
		n2 = b.split(" ");
		return a[a.length-1] < b[b.length-1];
	});

	// add to page
	for(var i = 0; i < runners.length; i++){
		var list = document.getElementById("runnersList");
		var runner = document.createElement("li");
		runner.setAttribute("value", ids[i]);
		runner.innerHTML = "<input type=\'checkbox\'><a target='_blank' href=\'\'> " + name + "</a>";
		list.appendChild(runner);
		runner.getElementsByTagName("a")[0].addEventListener("click", link);
	}
	
}

function link(e){
	//var newURL = "http://pa.milesplit.com/athletes/pro/2911907/stats";
	var newURL = "http://milesplit.com/athletes/" + e.target.parentElement.value + "/stats";
	chrome.tabs.update({url:newURL});
}