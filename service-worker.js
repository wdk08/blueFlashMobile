const CACHE_NAME = "blueflash-v4";

self.addEventListener("install", event => {

    self.skipWaiting();

});


self.addEventListener("activate", event => {

    self.clients.claim();

});
