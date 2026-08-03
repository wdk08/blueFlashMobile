const CACHE_NAME = "blueflash-v2";

self.addEventListener("install", event => {

    self.skipWaiting();

});


self.addEventListener("activate", event => {

    self.clients.claim();

});
