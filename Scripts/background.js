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
	$.get("https://www.athletic.net/TrackAndField/Athlete.aspx", {"AID":"1"}, (data, status, xhr) => {
		if(status == "success"){
			var page = $("<html></html>").append(data.substring(data.indexOf("<head"), data.indexOf("</html>")));

			// check if we got the goods or we were blocked
			if(page.find(".sign-up-box").length > 0){
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
	$.get("https://www.athletic.net/TrackAndField/Athlete.aspx", {"AID":id}, (data, status, xhr) => {
		if(status == "success"){
			var tfPage = $("<html></html>").append(data.substring(data.indexOf("<head"), data.indexOf("</html>")));
			// check if we got the goods or we were blocked
			if(tfPage.find(".sign-up-box").length > 0) return;

			$.get("https://www.athletic.net/CrossCountry/Athlete.aspx", {"AID":id}, (data, status, xhr) => {
				if(status == "success"){
					var xcPage = $("<html></html>").append(data.substring(data.indexOf("<head"), data.indexOf("</html>")));
					// check if we got the goods or we were blocked
					if(xcPage.find(".sign-up-box").length > 0) return;

					var num_results = 0;
					var lastSeenTF = runner["last_seen_TFresult"];
					var lastSeenXC = runner["last_seen_XCresult"];

					//loop through each result
					tfPage.find("tr[id^=rID_]").each(function(){
						// if were less than the last seen, then its not new
						var resultID = $(this).attr("id").substring(4);
						if(parseInt(resultID) <= parseInt(runner["last_seen_TFresult"]))
							return true;

						// add new result data
						runner["new_results"][resultID] = getResultInfo($(this));
						lastSeenTF = Math.max(parseInt(lastSeenTF), parseInt(resultID));
						num_results++;
					});
					xcPage.find("tr[id^=rID_]").each(function(){
						// if were less than the last seen, then its not new
						var resultID = $(this).attr("id").substring(4);
						if(parseInt(resultID) <= parseInt(runner["last_seen_XCresult"]))
							return true;

						// add new result data
						runner["new_results"][resultID] = getResultInfo($(this));
						lastSeenXC = Math.max(parseInt(lastSeenXC), parseInt(resultID));
						num_results++;
					});

					// if there are no new results, return without updating the storage
					if(num_results == 0) return;

					// set new last seen
					runner["last_seen_TFresult"] = lastSeenTF;
					runner["last_seen_XCresult"] = lastSeenXC;

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
		else{
			console.log("Could not check results: Request error");
			return;
		}
	});
}

// takes a result and returns a JSON object with the
// event, mark, and whether it is a pr
function getResultInfo(result){
	var event = result.closest("table").prev().text();
	var mark = result.find("td:eq(1) a").html().split("<")[0];
	var pr = result.find("td:eq(1)").text().includes("PR");
	return {"event": event, "mark": mark, "pr": pr};
}
