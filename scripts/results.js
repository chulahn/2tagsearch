var searchResults = [];
var counter = 0;
var overlap = [];

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
				console.log('valid');
				findOverlap(counter);
				findOverlap(counter+1);
			}

		})		
}

function requestCb(res) {
	searchResults.push(res);
}

//find overlapping tags by going thru each item that mathces first tag, going thru each of its tags and finding the 2nd tag.
function findOverlap(ind) {
	var compareTag;
	(ind%2 === 0) ? compareTag = t2 : compareTag = t1;
	console.log(compareTag);
	searchResults[ind].data.forEach(function(current) {

		for (var i=0; i < current.tags.length; i++) {

			if (current.tags[i] === compareTag) {
				if (overlap.indexOf(current) === -1) {

					overlap.push(current);
					console.log('overlapped ' , compareTag , current);
					break;
				}
				else {
					alert('already in')
				}
			}
		}

	});
	appendResults();
	
}

function appendResults(){

	var appendHTML = "";

	overlap.forEach(function(pic) {

		appendHTML += "<img src=";
		appendHTML += pic.images.thumbnail.url;
		appendHTML += "></img>";

	});
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
