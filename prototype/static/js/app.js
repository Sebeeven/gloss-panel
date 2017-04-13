var app = (function($) {
    var appConfig = {
        // database: 'mongodb://sebeeven:blogblog@ds060649.mlab.com:60649/blog-app',
        baseURL: 'https://api.mlab.com/api/1/databases/blog-app/collections/',
        addURL: '?apiKey=GenQuPLiVRTAa6FPh6Tx82DBikE_h7id'
    }, app = JSON.parse(appConfig);

    $(document).ready(function() {
        var router = new app.router();
    });

    return app;
})
