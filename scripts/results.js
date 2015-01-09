var searchResults = [];
var searchIndex = 0;
var lastAddedIndex = -1;

var overlap = [];
var currentOverlapStart = 0;

//for creating the initial api call
function buildRequestURL(tag) {

	var client_id = "09f502f5c4e944bd8b93b32ed166a80c"
	var baseURL = "https://api.instagram.com/v1/tags/" + tag + "/media/recent?client_id=" + client_id;
	baseURL += "&count=33"

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

	var t2req = function() {
		return $.ajax({
			url : t2reqUrl,
			dataType: "jsonp",
			jsonpCallback: "requestCb2"
		});
	}

	t1req.then(t2req)
		.done(function() {
			// console.log(searchResults)

			if ((searchResults[searchIndex].data.length !== 0) && (searchResults[searchIndex+1].data.length !== 0)) {
				console.log('initialRequest: both requests had data');
				addOverlap(searchIndex);
				searchIndex++;
				addOverlap(searchIndex);
				searchIndex--;
			}

			else {

				//disable button

			}

		})		
}

//adds response to array
function requestCb1(res) {
	res.otherTag = t2;
	//console.log(res);
	searchResults.push(res);
	console.log(searchResults.length)
	lastAddedIndex = searchResults.length - 1;
}

function requestCb2(res) {
	res.otherTag = t1;
	//console.log(res);
	searchResults.push(res);
	lastAddedIndex = searchResults.length - 1;
}

//find overlapping tags by going thru each item that matches first search tag,
//then go thru each of its tags and find the 2nd search tag(otherTag).
function addOverlap(ind) {

	var compareTag = searchResults[ind].otherTag;
	console.log(ind, "addOverlap: looking for tag " , compareTag , searchResults[ind]);
	searchResults[ind].data.forEach(function(currentPic) {

		for (var i=0; i < currentPic.tags.length; i++) {
			if (currentPic.tags[i] === compareTag) {

				if (!alreadyAdded(currentPic)) {
					overlap.push(currentPic);
					break;
				}

				else {
					console.log('already added ' , currentPic.link)
				}
			}
		}
	});



	appendResults();
	$('#loadingContainer').hide();

	//checks if a pic was already added
	function alreadyAdded(item) {
		return overlap.some(function(curr) {
			return (item.link === curr.link)
		});
	}
}

function appendResults() {
	var appendHTML = "";

	currentOverlap = overlap.slice(currentOverlapStart);

	currentOverlap.forEach(function(pic) {
		appendHTML += "<a href='";
		appendHTML += pic.link;
		appendHTML += "'>"
		
		appendHTML += "<div class='picContainer'>"

		appendHTML += "<img src=";
		appendHTML += pic.images.thumbnail.url;
		appendHTML += "></img>";

		appendHTML += "<div class='details'>";
		
		appendHTML += "<span class='descrip'>";
		var text = pic.caption.text.toString();
		var slice = text.slice(0, 40);
		appendHTML += ( (text.length > 40) ? slice + "..." : slice );
		appendHTML += "</span>";

		appendHTML += "</div></div></a>";
	});

	currentOverlapStart = overlap.length;

	$('#matches').append(appendHTML);
	$('.details').hide();
}

//gets next url from last searched Index, makes call to API and adds overlapping data
function getNext() {
	var next = searchResults[searchIndex];
	var cb;
	var reqURL = next.pagination.next_url;
	(next.otherTag === t1) ? cb = requestCb2 : cb = requestCb1;

	console.log("getNext: searching " ,next.otherTag, " in " , searchIndex , next.data.length , cb.name)

	var request = $.ajax({
		url : reqURL,
		dataType: "jsonp",
		jsonpCallback: cb.name
	});

	request.done(function() {
		addOverlap(lastAddedIndex);
		searchIndex++;
	});
}

$(document).ready(function() {
	$('#searchDiv').hide();

	$('#loadingContainer').show();
	initialRequest(t1reqUrl, t2reqUrl);
	
	$('#searchMore').click(function() {
		if ($('#searchDiv').css('display') === "none") {
			$('#searchMore').html("Another Search (-)")
			$('#searchDiv').show();
		}
		else {
			$('#searchDiv').hide();
			$('#searchMore').html("Another Search (+)")
		}
	});

	$('.loadNext').click(function() {
		$('#loadingContainer').show();
		getNext();
	});

	$(this).on('mouseover', '.picContainer', function() {
		$(this).find('.details').show();
	});

	$(this).on('mouseout', '.picContainer', function() {
		$(this).find('.details').hide();
	});

});