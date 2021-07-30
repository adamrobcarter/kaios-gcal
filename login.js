window.onerror = function(message, source, lineno, colno, error) {
    console.error(error)
};

var CLIENT_ID = '279700455578-9imjkd7831t62rulfs03jfcr1pj80skf.apps.googleusercontent.com';
// client secret yOuYP9VFd9jFD9R4zKC5UXKJ
var API_KEY = 'AIzaSyCLZGs1-Jepv0cr277s_NTskulwGbYY7bs';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar";

const auth_url = 'https://accounts.google.com/o/oauth2/v2/auth'
const redirect_uri = 'https://kaiosgcal.com'

const url = new URL(auth_url);
url.searchParams.append('client_id', CLIENT_ID);
url.searchParams.append('redirect_uri', redirect_uri);
url.searchParams.append('scope', SCOPES);
url.searchParams.append('response_type', 'token');//'code');
url.searchParams.append('login_hint', 'adam.rob.carter@gmail.com')

console.log("redirecting to ", url.href);
navigator.spatialNavigationEnabled = true;
window.location.href = url.href