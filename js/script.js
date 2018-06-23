
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    var city = $('#city').val();
    var street = $('#street').val();
    var address = street + ', ' + city;

    $greeting.text('So, you want to live at '+ address + '?');

    var streetviewURL = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address;
    $body.append('<img class="bgimg" src="' + streetviewURL + '">');
    // YOUR CODE GOES HERE!

    var apikey = '071c1d0efbdb4aa785a397baf423cd14';
    var NYTurl = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + city + '&sort=newest&api-key='+ apikey;

    $.getJSON(NYTurl, function(data){
        $nytHeaderElem.text('New York Times articles about ' + city);

        articles = data.response.docs;
            for (var i = 0; i < articles.length; i ++){
                var article = articles[i];
                $nytElem.append('<li class="article">' + 
                    '<a href="'+article.web_url+'">'+ article.headline.main + '</a>'
                    + '<p>'+ article.snippet +'</p>'
                    +'</li>');
            }
    }).fail(function(){
        $nytHeaderElem.text('New York Times articles could not be loaded');
    });
    

    var wikiURL = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' 
        + city + '&format=json&callback=wikiCallback';

    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text('Failed to retrieve Wiki links')
    }, 8000);
    
    $.ajax({
        url: wikiURL,
        dataType: "jsonp",
        success: function( response ){
            var articleList = response[1];

            for (var i = 0; i < articleList.length; i ++){
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url +'">'+ articleStr +'</a></li>')
            }

            clearTimeout(wikiRequestTimeout);
        }
    })

    

    return false;
};

$('#form-container').submit(loadData);
