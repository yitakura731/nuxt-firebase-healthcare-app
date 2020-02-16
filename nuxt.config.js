const pkg = require('./package');
require('dotenv').config({ path: './app.env' });

console.log(`GOOGLE_VISION_URL = ${process.env.GOOGLE_VISION_URL}`);
console.log(`GOOGLE_VISION_SECRET = ${process.env.GOOGLE_VISION_SECRET}`);
console.log(`RAKUTEN_SHOP_URL = ${process.env.RAKUTEN_SHOP_URL}`);
console.log(`RAKUTEN_SHOP_SECRET = ${process.env.RAKUTEN_SHOP_SECRET}`);

module.exports = {
  mode: 'universal',

  router: {
    linkActiveClass: 'active'
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
  plugins: [],

  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
    'bootstrap-vue/nuxt',
    '@nuxtjs/pwa',
    ['@nuxtjs/dotenv', { filename: './app.env' }]
  ],

  env: {
    GOOGLE_VISION_URL: process.env.GOOGLE_VISION_URL,
    GOOGLE_VISION_SECRET: process.env.GOOGLE_VISION_SECRET,
    RAKUTEN_SHOP_URL: process.env.RAKUTEN_SHOP_URL,
    RAKUTEN_SHOP_SECRET: process.env.RAKUTEN_SHOP_SECRET
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
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
