const pkg = require('./package');
require('dotenv').config({ path: './app.env' });

console.log(`GOOGLE_VISION_URL = ${process.env.GOOGLE_VISION_URL}`);
console.log(`GOOGLE_VISION_SECRET = ${process.env.GOOGLE_VISION_SECRET}`);
console.log(`GOOGLE_MAP_SECRET = ${process.env.GOOGLE_MAP_SECRET}`);
console.log(`RAKUTEN_SHOP_URL = ${process.env.RAKUTEN_SHOP_URL}`);
console.log(`RAKUTEN_SHOP_SECRET = ${process.env.RAKUTEN_SHOP_SECRET}`);
console.log(`CALORIE_API_URL = ${process.env.CALORIE_API_URL}`);
console.log(`CALORIE_API_HOST = ${process.env.CALORIE_API_HOST}`);
console.log(`CALORIE_API_SECRET = ${process.env.CALORIE_API_SECRET}`);
console.log(`FIREBASE_API_KEY = ${process.env.FIREBASE_API_KEY}`);
console.log(`FIREBASE_AUTH_DOMAIN = ${process.env.FIREBASE_AUTH_DOMAIN}`);
console.log(`FIREBASE_DATABASE_URL = ${process.env.FIREBASE_DATABASE_URL}`);
console.log(`FIREBASE_PROJECT_ID = ${process.env.FIREBASE_PROJECT_ID}`);
console.log(`FIREBASE_STORAGE_BACKET = ${process.env.FIREBASE_STORAGE_BACKET}`);
console.log(
  `FIREBASE_MESSAGING_SENSORID = ${process.env.FIREBASE_MESSAGING_SENSORID}`
);
console.log(`FIREBASE_APPID = ${process.env.FIREBASE_APPID}`);
console.log(`FIREBASE_MESURE_ID = ${process.env.FIREBASE_MESURE_ID}`);

module.exports = {
  mode: 'universal',

  router: {
    linkActiveClass: 'active',
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
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
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
  plugins: [
    { src: '~/plugins/firebase', ssr: false },
    { src: '~/plugins/pwa-setup', ssr: false },
    { src: '~/plugins/vue2-google-maps.js', ssr: true }
  ],

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
    ['@nuxtjs/dotenv', { filename: './app.env' }],
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
    CALORIE_API_SECRET: process.env.CALORIE_API_SECRET
  },

  vendor: ['vue2-google-maps'],

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
