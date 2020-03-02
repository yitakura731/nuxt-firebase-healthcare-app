const userAgent = navigator.userAgent.toLowerCase();
const iOS = userAgent.indexOf('iphone') > 0 || userAgent.indexOf('ipad') > 0;
function setManifest(path) {
  const manifest = document.createElement('link');
  manifest.rel = 'manifest';
  manifest.href = path;
  document.head.appendChild(manifest);
}
setManifest(iOS ? '/manifest_ios.json' : '/manifest.json');
