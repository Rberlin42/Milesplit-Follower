// load all runners from storage when the popup is opened
chrome.storage.sync.get(null, displayRunners);

$(document).ready(function(){
    // add event handlers for the buttons
    $("#clear").click(clear);
    $("#select-all").click(selectAll);

    // milesplit link stuff
    $("#milesplit-link img").attr("src", chrome.runtime.getURL("Images/logo.jpg"));
    $("#milesplit-link").click(function(){
        var newURL = $(this).attr("href");
        chrome.tabs.update({url:newURL});
    });

    // highlight rows on hover
    $("tbody tr").hover(function(){
        var row = $(this);
        while(row.find("td").first().attr("rowspan") === undefined){
            row = row.prev();
        }
        var len = parseInt(row.find("td").first().attr("rowspan"));
        for(var i = 0; i < len; i++){
            row.css("background-color", "#f4f4f4");
            row = row.next();
        }
    },
    function(){
        var row = $(this);
        while(row.find("td").first().attr("rowspan") === undefined){
            row = row.prev();
        }
        var len = parseInt(row.find("td").first().attr("rowspan"));
        for(var i = 0; i < len; i++){
            row.css("background-color", "white");
            row = row.next();
        }
    });
});

// clear all notifications that are checked
function clear(){
    chrome.storage.sync.get(null, (runners) =>{
        // loop through each line
        $(".lineItem").each(function(){

            // if its checked, clear the notifications for that runner
            if($(this).find("input").prop("checked")){
                var id = $(this).attr("value");
                
                // remove the results
                runners[id]["new_results"] = {};
                    
                // remove it from the list
                for(var i = 1; i < parseInt($(this).find("td:first").attr("rowspan")); i++){
                    $(this).next().remove();
                }
                $(this).remove();
            }
        });
        // update the storage
        chrome.storage.sync.set(runners);
    });   
}

// check or uncheck all boxes
function selectAll(){
    $("input").each(function(){
        $(this).prop("checked", true);
    });
    $("#select-all").off("click").text("Uncheck all").click(uncheckAll);
}
function uncheckAll(){
    $("input").each(function(){
        $(this).prop("checked", false);
    });
    $("#select-all").off("click").text("Select all").click(selectAll);
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
                lineItem.append($("<td rowspan=" + rowspan + " class='check'><input type=\'checkbox\'></td>"));
                lineItem.append($("<td rowspan=" + rowspan + " class='name'><a href=http://milesplit.com/athletes/" + id + ">" + runner["first_name"] + " " + runner["last_name"] + "</a></td>"));
            }

            // add the result info
            lineItem.append($("<td class='event'>" + result["event"] + "</td>"));
            lineItem.append($("<td class='mark'>" + result["mark"] + "</td>"));
            if(result["pr"]){
                var img = $("<img alt='pr'/>");
                img.attr("src", chrome.runtime.getURL("Images/pr.png"));
                var td = $("<td class='pr'></td>").append(img);
                lineItem.append(td);
            }
            else
                lineItem.append($("<td class='pr'></td>"));

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
    console.log(e);
    var newURL = e.target.href;
    alert(newURL);
    chrome.tabs.update({url:newURL});
}