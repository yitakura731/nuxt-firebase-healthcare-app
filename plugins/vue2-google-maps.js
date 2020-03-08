import Vue from 'vue';
import * as VueGoogleMaps from '~/node_modules/vue2-google-maps';

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyAi7MvgB3Sx-miXRtNllzdBH96banxJSuc',
    libraries: 'places, drawing'
  }
});
