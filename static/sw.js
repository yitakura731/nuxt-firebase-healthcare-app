importScripts('/HCDemoApp01/_nuxt/workbox.4c4f5ca6.js');

workbox.precaching.precacheAndRoute(
  [
    {
      url: '/HCDemoApp01/_nuxt/5083a9ac71ccddf6bbcf.js',
      revision: '9056352916e6caea3345caf50e2b14a1'
    },
    {
      url: '/HCDemoApp01/_nuxt/81b8bd751513c4704ca1.js',
      revision: '284a1bcac2409359ad431663575809db'
    },
    {
      url: '/HCDemoApp01/_nuxt/885b15168880e2aad1e7.js',
      revision: '0eaa9f154230301b7232366c0a480d89'
    },
    {
      url: '/HCDemoApp01/_nuxt/f338c80d683153cc45c8.js',
      revision: 'aa7bb599f8e140843a5607b866648b01'
    },
    {
      url: '/HCDemoApp01/_nuxt/f3f11427e41693469780.js',
      revision: '674fbf651a1937b0cdc8a21e84180557'
    }
  ],
  {
    cacheId: 'HcDemoApp01',
    directoryIndex: '/',
    cleanUrls: false
  }
);

workbox.clientsClaim();
workbox.skipWaiting();

workbox.routing.registerRoute(
  new RegExp('/HCDemoApp01/_nuxt/.*'),
  workbox.strategies.cacheFirst({}),
  'GET'
);

workbox.routing.registerRoute(
  new RegExp('/HCDemoApp01/.*'),
  workbox.strategies.networkFirst({}),
  'GET'
);
