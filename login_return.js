window.onerror = function(message, source, lineno, colno, error) {
    console.error(error)
};

navigator.spatialNavigationEnabled = false;

const params = new URLSearchParams(window.location.hash); // google return it in the hash weirdly
const access_token = params.get('#access_token')
if(access_token){
    window.localStorage.setItem('access_token', access_token)
    console.log("set access token", access_token)
    window.location.href = 'app.html'
} else {
    console.log("access token null. redirecting to login")
}
