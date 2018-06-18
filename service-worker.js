importScripts('serviceworker-cache-polyfill.js');
var cacheName = 'dodec-design';
var dataCacheName = 'dodec-design-data';

var filesToCache = [
  '/',    
    './index.html',
    './contact_us.html',
    './host_and_domain.html',
    './product_detail.html',
    './asset/css/style.css',
    './asset/css/product_detail.css',
    './asset/css/contact_us.css',
    './asset/css/plugin.css',
    './asset/css/contact_us.css',
    './asset/js/script.js',
    './asset/js/product.js',
    './asset/js/contact_us.js',
    './asset/js/host_and_domain.js',
    './asset/plugin/lib.min.js'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) {
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  var dataUrl = 'api/openapi.php';
  if (e.request.url.indexOf(dataUrl) > -1) {
    e.respondWith(
      caches.open(dataCacheName).then(function(cache) {
        return fetch(e.request).then(function(response){
          cache.put(e.request.url, response.clone());
          return response;
        });
      })
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  }
});