var searchResults = [];
var counter = 0;

var overlap = [];
var currentOverlap = [];

function buildRequestURL(tag) {

	var client_id = "09f502f5c4e944bd8b93b32ed166a80c"
	var baseURL = "https://api.instagram.com/v1/tags/" + tag + "/media/recent?client_id=" + client_id;
	baseURL += "&count=33"

	return baseURL;
}

var t1reqUrl = buildRequestURL(t1);
var t2reqUrl = buildRequestURL(t2);

function makeRequest(t1reqUrl, t2reqUrl) {

	var t1req =	$.ajax({
		url : t1reqUrl,
		dataType: "jsonp",
		jsonpCallback: "requestCb"
	});

	var t2req = function() {
		return $.ajax({
			url : t2reqUrl,
			dataType: "jsonp",
			jsonpCallback: "requestCb"
		});
	}

	t1req.then(t2req)
		.done(function() {
			console.log(searchResults)

			if ((searchResults[0].data.length !== 0) && (searchResults[1].data.length !== 0)) {
				console.log('makeRequest: both requests had data');
				addOverlap(counter);
				addOverlap(counter+1);
			}

		})		
}

function requestCb(res) {
	searchResults.push(res);
}

//find overlapping tags by going thru each item that matches first tag,
//and going thru each of its tags and finding the 2nd tag.
function addOverlap(ind) {
	var compareTag;
	(ind%2 === 0) ? compareTag = t2 : compareTag = t1;
	console.log("addOverlap: looking for tag " , compareTag , ind);
	
	searchResults[ind].data.forEach(function(currentPic) {

		for (var i=0; i < currentPic.tags.length; i++) {

			if (currentPic.tags[i] === compareTag) {

				if (!alreadyAdded(currentPic)) {

					overlap.push(currentPic);
					currentOverlap.push(currentPic);
					console.log('overlapped adding ', currentPic.link);
					break;
				}

				else {
					console.log('already in ' , currentPic.link)
				}

			}
		}

	});
	appendResults();	
}

function alreadyAdded(item) {

	return overlap.some(function(curr) {
		return (item.link === curr.link)
	});

}


function appendResults(){

	var appendHTML = "";

	currentOverlap.forEach(function(pic) {
		appendHTML += "<a href='";
		appendHTML += pic.link;
		appendHTML += "'><img src=";
		appendHTML += pic.images.thumbnail.url;
		appendHTML += "></img></a>";

	});
	currentOverlap = [];
	appendHTML += "<br/>";
	$('#matches').append(appendHTML);
}

function getNext() {


	var firsturl = searchResults[counter].pagination.next_url;
	var secondurl = searchResults[counter+1].pagination.next_url;

	if (firsturl !== undefined && secondurl !== undefined) {
		console.log(firsturl)
	}

	makeRequest(firsturl, secondurl);
	
}


$(document).ready(function() {
	makeRequest(t1reqUrl, t2reqUrl);

	$('#loadMore').click(function() {
		getNext();
	});

});
