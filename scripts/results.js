var searchResults = [];
var searchIndex = 0;
var lastAddedIndex = -1;

var matchedData = [];
var lastCheckedMatchIndex = 0;

var client_id =  "09f502f5c4e944bd8b93b32ed166a80c";

//for creating the initial api call
function buildRequestURL(tag) {

	var baseURL = "https://api.instagram.com/v1/tags/" + tag + "/media/recent?access_token=" + accessToken;
	baseURL += "&count=33";

	return baseURL;
}

var t1reqUrl = buildRequestURL(t1);
var t2reqUrl = buildRequestURL(t2);

//make calls to API with both urls.
//if there were pictures, find ones with both tags
function initialRequest(t1reqUrl, t2reqUrl) {

	var t1req =	$.ajax({
		url : t1reqUrl,
		dataType: "jsonp",
		jsonpCallback: "requestCb1"
	});
	console.log(t1reqUrl);
	var t2req = function() {
		return $.ajax({
			url : t2reqUrl,
			dataType: "jsonp",
			jsonpCallback: "requestCb2"
		});
	};

	t1req.then(t2req)
		.done(function() {
			// console.log(searchResults)

			if ((searchResults[searchIndex].data.length !== 0) && (searchResults[searchIndex+1].data.length !== 0)) {
				console.log('initialRequest: both requests had data');
				findMatches(searchIndex);
				searchIndex++;
				findMatches(searchIndex);
				searchIndex--;
			}

			else {

				//disable button

			}

		});	

	console.log('-------------------');

}

//adds response to array
function requestCb1(res) {
	res.searchQuery = t1;
	res.otherTag = t2;
	console.log(res);
	searchResults.push(res);
	console.log(searchResults.length);
	lastAddedIndex = searchResults.length - 1;
}

function requestCb2(res) {
	res.searchQuery = t2;
	res.otherTag = t1;
	//console.log(res);
	searchResults.push(res);
	lastAddedIndex = searchResults.length - 1;
}

//gets next url from last searched Index, makes call to API and adds overlapping data
function getNext() {
	var next = searchResults[searchIndex];
	var cb;
	var reqURL = next.pagination.next_url;

	changeLoadingText();

	$('#loadingContainer').show();

	// alert(next.otherTag + " " + searchIndex)
	(next.otherTag === t1) ? cb = requestCb2 : cb = requestCb1;

	console.log("getNext: searching " ,next.otherTag, " in " , searchIndex , next.data.length , cb.name);

	var request = $.ajax({
		url : reqURL,
		dataType: "jsonp",
		jsonpCallback: cb.name
	});

	request.done(function() {
		searchIndex++;
		findMatches(lastAddedIndex);
	});
}


//find overlapping tags by going thru each item that matches first search tag,
//then go thru each of its tags and find the 2nd search tag(otherTag).
function findMatches(ind) {

	var before = matchedData.slice();

	var compareTag = searchResults[ind].otherTag;
	console.log(ind, "findMatches: looking for tag " , compareTag , searchResults[ind]);
	searchResults[ind].data.forEach(function(currentPic) {

		for (var i=0; i < currentPic.tags.length; i++) {
			if (currentPic.tags[i] === compareTag) {

				if (!alreadyAdded(currentPic)) {
					matchedData.push(currentPic);
					// break;
				}

				else {
					console.log('already added ' , currentPic.link);
				}
			}
		}
	});

	if (matchedData.length === before.length) {
		getNext();
	}

	else {
		$('#loadingContainer').hide();
		appendResults();
	}

	//checks if a pic was already added
	function alreadyAdded(item) {
		return matchedData.some(function(curr) {
			return (item.link === curr.link);
		});
	}
}

//shows images that have both tags on screen.
function appendResults() {
	var appendHTML = "";

	var before = lastCheckedMatchIndex;
	currentOverlap = matchedData.slice(lastCheckedMatchIndex);

	currentOverlap.forEach(function(pic) {
		appendHTML += "<a href='";
		appendHTML += pic.link;
		appendHTML += "'>";
		
		appendHTML += "<div class='picContainer'>";

		appendHTML += "<img src=";
		appendHTML += pic.images.thumbnail.url;
		appendHTML += "></img>";

		appendHTML += "<div class='details";

		// if ((lastAddedIndex % 2) == 1) {
		// 	appendHTML += " odd";
		// }

		appendHTML += "'>"
		
		appendHTML += "<span class='descrip'>";
		var text = (pic.caption && pic.caption.text.toString()) || "";
		var slice = text.slice(0, 40);
		appendHTML += ( (text.length > 40) ? slice + "..." : slice );
		appendHTML += "</span>";

		appendHTML += "</div></div></a>";
	});

	lastCheckedMatchIndex = matchedData.length;
	console.log('before ' , before , 'current ' , lastCheckedMatchIndex)
	$('#matchedPics').append(appendHTML);
	$('.details').hide();
}

function changeLoadingText() {

	var current = searchResults[searchIndex];
	output = "<span class='header'>Loading " + searchIndex + "</span><br/>";
	output += "Searching images tagged with<br/><span class='tag'>" + current.searchQuery + "</span></br> for  tag <br/><span class='tag'>" + current.otherTag + "</span>";

	$('#loadingContent').html(output);
}



$(document).ready(function() {
	$('#searchDiv').hide();

	$('#loadingContainer').show();
	initialRequest(t1reqUrl, t2reqUrl);
	
	$('#searchMore').click(function() {
		if ($('#searchDiv').css('display') === "none") {
			$('#searchMore').html("Another Search (-)");
			$('#searchDiv').show();
		}
		else {
			$('#searchDiv').hide();
			$('#searchMore').html("Another Search (+)");
		}
	});

	$('.loadNext').click(function() {
		getNext();
	});

	$(this).on('mouseover', '.picContainer', function() {
		$(this).find('.details').show();
	});

	$(this).on('mouseout', '.picContainer', function() {
		$(this).find('.details').hide();
	});


	$(window).scroll(function() {

		var endOfPage = $(document).height();
		var currentPosition = $(window).scrollTop() + $(window).height();

		if (currentPosition === endOfPage) {

			if (lastAddedIndex >= 2) {
	        	getNext();
			}
		}

	});

});