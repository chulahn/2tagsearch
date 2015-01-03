var searchResults = [];
var searchIndex = 0;

var overlap = [];
var currentOverlapStart = 0;

//for creating the initial api calls
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
function makeRequest(t1reqUrl, t2reqUrl) {

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
			console.log(searchResults)

			if ((searchResults[searchIndex].data.length !== 0) && (searchResults[searchIndex+1].data.length !== 0)) {
				console.log('makeRequest: both requests had data');
				addOverlap(searchIndex);
				addOverlap(searchIndex+1);
			}

			else {

				//disable button

			}

		})		
}

function requestCb1(res) {
	res.otherTag = t1;
	console.log(res)
	searchResults.push(res);
}

function requestCb2(res) {
	res.otherTag = t2;
	console.log(res)
	searchResults.push(res);
}

//find overlapping tags by going thru each item that matches first search tag,
//then go thru each of its tags and find the 2nd search tag.
function addOverlap(ind) {
	
	var compareTag = searchResults[ind].otherTag;
	searchResults[ind].data.forEach(function(currentPic) {

		console.log("addOverlap: looking for tag " , compareTag);

		for (var i=0; i < currentPic.tags.length; i++) {
			if (currentPic.tags[i] === compareTag) {

				if (!alreadyAdded(currentPic)) {
					overlap.push(currentPic);
					break;
				}

				else {
					// console.log('already added ' , currentPic.link)
				}
			}
		}
	});

	appendResults();	

	function alreadyAdded(item) {
		return overlap.some(function(curr) {
			return (item.link === curr.link)
		});
	}
}


function appendResults(){

	var appendHTML = "";
	appendHTML += searchIndex;

	currentOverlap = overlap.slice(currentOverlapStart);

	currentOverlap.forEach(function(pic) {
		appendHTML += "<div class='container'>"

		appendHTML += "<img src=";
		appendHTML += pic.images.thumbnail.url;
		appendHTML += "></img>";

		appendHTML += "<a href='";
		appendHTML += pic.link;
		appendHTML += "'><div class='details'>"
		appendHTML += "<span class='link'>"
		appendHTML += pic.link.replace("http://instagram.com/p/" , "");
		appendHTML += "</span>"
		appendHTML += "</div></a></div>"

	});

	appendHTML += "<br/>";
	currentOverlapStart = overlap.length;

	$('#matches').append(appendHTML);
	$('.details').hide();

}

function getNext() {

	var firstURL = searchResults[searchIndex].pagination.next_url;
	var secondURL = searchResults[searchIndex+1].pagination.next_url;

	if (firstURL !== undefined && secondURL !== undefined) {
		searchIndex += 2;

		makeRequest(firstURL, secondURL);
	}

	else {

	}	
}


$(document).ready(function() {
	makeRequest(t1reqUrl, t2reqUrl);

	$('#loadMore').click(function() {
		getNext();
	});

	$(this).on('mouseover', '.container', function() {
		$(this).find('.details').show();
	});

	$(this).on('mouseout', '.container', function() {
		$(this).find('.details').hide();
	});

});
