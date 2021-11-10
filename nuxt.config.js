const pkg = require('./package');

console.log(`G_VISION_URL = ${process.env.GOOGLE_VISION_URL}`);
console.log(`G_VISION_SECRET = ${process.env.GOOGLE_VISION_SECRET}`);
console.log(`G_MAP_SECRET = ${process.env.GOOGLE_MAP_SECRET}`);
console.log(`R_SHOP_URL = ${process.env.RAKUTEN_SHOP_URL}`);
console.log(`R_SHOP_SECRET = ${process.env.RAKUTEN_SHOP_SECRET}`);
console.log(`C_API_URL = ${process.env.CALORIE_API_URL}`);
console.log(`C_API_HOST = ${process.env.CALORIE_API_HOST}`);
console.log(`C_API_SECRET = ${process.env.CALORIE_API_SECRET}`);
console.log(`F_API_KEY = ${process.env.FIREBASE_API_KEY}`);
console.log(`F_AUTH_DOMAIN = ${process.env.FIREBASE_AUTH_DOMAIN}`);
console.log(`F_DATABASE_URL = ${process.env.FIREBASE_DATABASE_URL}`);
console.log(`F_PROJECT_ID = ${process.env.FIREBASE_PROJECT_ID}`);
console.log(`F_STORAGE_BACKET = ${process.env.FIREBASE_STORAGE_BACKET}`);
console.log(
  `F_MESSAGING_SENSORID = ${process.env.FIREBASE_MESSAGING_SENSORID}`
);
console.log(`F_APPID = ${process.env.FIREBASE_APPID}`);
console.log(`F_MESURE_ID = ${process.env.FIREBASE_MESURE_ID}`);

module.exports = {
  ssr: false,
  target: 'static',
  router: {
    middleware: 'auth'
  },

  /*
   ** Headers of the page
   */
  head: {
    title: 'HC Demo App',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: 'favicon.ico' }]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },

  /*
   ** Global CSS
   */
  css: [],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/firebase', '~/plugins/vue2-google-maps.js'],

  fontawesome: {
    imports: [
      {
        set: '@fortawesome/free-solid-svg-icons',
        icons: ['fas']
      },
      {
        set: '@fortawesome/free-regular-svg-icons',
        icons: ['far']
      },
      {
        set: '@fortawesome/free-brands-svg-icons',
        icons: ['fab']
      }
    ]
  },

  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/axios',
    'bootstrap-vue/nuxt',
    '@nuxtjs/pwa',
    ['@nuxtjs/moment', ['ja']],
    'nuxt-fontawesome'
  ],

  env: {
    GOOGLE_VISION_URL: process.env.GOOGLE_VISION_URL,
    GOOGLE_VISION_SECRET: process.env.GOOGLE_VISION_SECRET,
    RAKUTEN_SHOP_URL: process.env.RAKUTEN_SHOP_URL,
    RAKUTEN_SHOP_SECRET: process.env.RAKUTEN_SHOP_SECRET,
    GOOGLE_MAP_SECRET: process.env.GOOGLE_MAP_SECRET,
    CALORIE_API_URL: process.env.CALORIE_API_URL,
    CALORIE_API_HOST: process.env.CALORIE_API_HOST,
    CALORIE_API_SECRET: process.env.CALORIE_API_SECRET,
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BACKET: process.env.FIREBASE_STORAGE_BACKET,
    FIREBASE_MESSAGING_SENSORID: process.env.FIREBASE_MESSAGING_SENSORID,
    FIREBASE_APPID: process.env.FIREBASE_APPID,
    FIREBASE_MESURE_ID: process.env.FIREBASE_MESURE_ID
  },

  vendor: ['vue2-google-maps'],

  manifest: {
    name: 'Healthcare demo application',
    short_name: 'HC Demo App',
    start_url: '/',
    orientation: 'portrait',
    display: 'standalone'
  },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    transpile: [/^vue2-google-maps($|\/)/],
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        });
      }
    }
  }
};
