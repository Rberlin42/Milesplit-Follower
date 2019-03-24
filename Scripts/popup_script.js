// load all runners from storage when the popup is opened
chrome.storage.sync.get(null, displayRunners);

// add event handlers for the buttons
$(document).ready(function(){
    $("#clear").click(clear);
    $("#select-all").click(selectAll);
});

// clear all notifications that are checked
function clear(){

    // loop through each line
    $(".lineItem").each(function(){

        // if its checked, remove it and update the storage
        if($(this).find("input").prop("checked")){
            var id = $(this).attr("value");
            
            // find the runner in storage and remove the results
            chrome.storage.sync.get(id, (runner) => {
                runner[id]["new_results"] = {};
                chrome.storage.sync.set(runner);
            });

            // remove it from the list
            for(var i = 1; i < parseInt($(this).find("td:first").attr("rowspan")); i++){
                $(this).next().remove();
            }
            $(this).remove();
        }
    });
}

// check all boxes
function selectAll(){
    $("input").each(function(){
        $(this).prop("checked", true);
    });
}

// take in the runner objects and display them appropriately
function displayRunners(runners){

    // if the storage request returns an error, then display it
    if(chrome.runtime.lastError){
        $("body").html(chrome.runtime.lastError);
        return;
    }

    // loop through the runners and add line items for each new result
    for(id in runners){
        var runner = runners[id];
        var results = runner["new_results"];
        var rowspan = Object.keys(results).length;
        var first = true;

        // loop through each new result for this runner
        for(resultID in results){
            result = results[resultID];
            // create the row item
            var lineItem = $("<tr class='lineItem' value=" + id + "></tr>");

            // create these only once for each runner
            if(first){
                lineItem.append($("<td rowspan=" + rowspan + "><input type=\'checkbox\'></td>"));
                lineItem.append($("<td rowspan=" + rowspan + "><a href=http://milesplit.com/athletes/" + id + ">" + runner["first_name"] + " " + runner["last_name"] + "</a></td>"));
            }

            // add the result info
            lineItem.append($("<td>" + result["event"] + "</td>"));
            lineItem.append($("<td>" + result["mark"] + "</td>"));
            if(result["pr"])
                lineItem.append($("<td>PR!</td>"));
            else
                lineItem.append($("<td></td>"));

            // add the click listener
            lineItem.find("a").click(link);
            // append to the list
            $("#results").append(lineItem);

            // no longer the first result
            first = false;
        }
    }
}

// redirect to the runner associated with the list item
function link(e){
    var newURL = e.target.href;
    chrome.tabs.update({url:newURL});
}