checkAllResults();
updateBadge();
// check for new results every 15 minutes
setInterval(checkAllResults, 900000);
// check our connection every 5 seconds
setInterval(updateBadge, 5000);

// check for new results for all followed runners
function checkAllResults(){
	chrome.storage.sync.get(null, (runners) => {
		for(id in runners){
			checkResults(id, runners[id]);
		}
	});
}

// updates the badge color and text
function updateBadge(){
	// count the amount of notifications
	chrome.storage.sync.get(null, (runners) => {
		numNotifications = 0;
		for(id in runners)
			numNotifications += Object.keys(runners[id]["new_results"]).length;
		chrome.browserAction.setBadgeText({"text": numNotifications+""});	
	});

	// check our connectivity
	$.get("https://www.milesplit.com/athletes/1", {"sort":"byDate"}, (data, status, xhr) => {
		if(status == "success"){
			var page = $("<html></html>").append(data.substring(data.indexOf("<!doctype html>")+16, data.indexOf("</html>")-1));

			// check if we got the goods or we were blocked
			if(page.find("#proCallToAction").length > 0){
				// set the badge to red
				chrome.browserAction.setBadgeBackgroundColor({"color": "#FF0000"});
				return;
			}
			// set badge to green as we are loggen in
			chrome.browserAction.setBadgeBackgroundColor({"color": "#00AA00"});
		}
		else{
			console.log("Could not check connectivity");
			return;
		}
	});
}

// check for new results for a specific runner
// update the runner in storage
// if we aren't logged in, update the badge color
function checkResults(id, runner){
	// if we don't have a recent return then ignore
	if(runner["last_seen_result"] == "") return;

	// request the page
	$.get("https://www.milesplit.com/athletes/"+id, {"sort":"byDate"}, (data, status, xhr) => {
		if(status == "success"){
			var page = $("<html></html>").append(data.substring(data.indexOf("<!doctype html>")+16, data.indexOf("</html>")-1));

			// check if we got the goods or we were blocked
			if(page.find("#proCallToAction").length > 0) return;

			//loop through each result
			var num_results = 0;
			page.find("div.record").each(function(){
				// if we hit the last seen then there are no new results
				var resultID = $(this).attr("data-performance-id");
				if(resultID == runner["last_seen_result"])
					return false;

				// add new result data
				runner["new_results"][resultID] = getResultInfo($(this));
				num_results++;
			});

			// if there are no new results, return without updating the storage
			if(num_results == 0) return;

			// set new last seen
			runner["last_seen_result"] = page.find("div.record:first").attr("data-performance-id");

			// store the runner
			var updated = {};
			updated[id] = runner;
			chrome.storage.sync.set(updated, function(){
				if(chrome.runtime.lastError){
					console.log(chrome.runtime.lastError.message);
				}
			});

		}
		else{
			console.log("Could not check results: Request error");
			return;
		}
	});
}

// takes a result and returns a JSON object with the
// event, mark, and whether it is a pr
function getResultInfo(result){
	var event = result.find(".eventName").text();
	var mark = result.find("span:first").text();
	var pr = result.find("span:first").hasClass("personal-record");
	return {"event": event, "mark": mark, "pr": pr};
}
