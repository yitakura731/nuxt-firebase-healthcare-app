<template>
  <div class="pb-1">
    <div class="d-flex mb-1">
      <div class="flex-fill">
        <div class="w-100 text-center">
          <small class="mb-0">
            時間
          </small>
        </div>
        <div class="w-100 text-center">
          <h2 class="mb-0">
            {{ toFormatString(new Date(stopWatch)) }}
          </h2>
        </div>
      </div>
      <div class="flex-fill">
        <div class="w-100 text-center">
          <small class="mb-0">
            距離(km)
          </small>
        </div>
        <div class="w-100 text-center">
          <h2 class="mb-0">
            {{ distance.toFixed(2) }}
          </h2>
        </div>
      </div>
    </div>
    <div class="d-flex flex-column align-items-center">
      <GmapMap
        ref="gmap"
        :center="{lat:10, lng:10}"
        :zoom="16"
        :options="{
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: false,
          disableDefaultUi: false
        }"
        map-type-id="terrain"
        style="width: 340px; height: 340px"
      >
        <GmapMarker :position="location" :icon="icon" />
        <gmap-polyline 
          v-if="paths.length > 0" 
          :path.sync="paths" 
          :options="{
            'strokeColor': '#4169e1',
            'strokeWeight': 10}"
        />
      </GmapMap>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import firebase from 'firebase/app';
import 'firebase/auth';

export default {
  data() {
    return {
      stopWatch: Date.parse('2018/01/01 00:00:00'),
      userWeight: 0,
      distance: 0,
      timerObj: null,
      location: { lng: 0, lat: 0 },
      paths: [],
      icon: {
        url: require('@/static/circle.png'),
        size: { width: 20, height: 20, f: 'px', b: 'px' },
        scaledSize: { width: 20, height: 20, f: 'px', b: 'px' }
      },
      error: null
    };
  },
  computed: {
    ...mapGetters('webapi', ['onRunning'])
  },
  watch: {
    onRunning(newVal, oldVal) {
      if (
        (newVal === 'RUNNING' && oldVal === 'PENDING') ||
        (newVal === 'RUNNING' && oldVal === 'STOP')
      ) {
        const self = this;
        this.timerObj = setInterval(() => {
          self.stopWatch += 1000;
        }, 1000);
      } else if (newVal === 'PENDING' && oldVal === 'RUNNING') {
        clearInterval(this.timerObj);
        this.runResp({
          distance: this.distance,
          calorie: Math.round(this.distance * this.userWeight)
        });
      } else if (
        (newVal === 'STOP' && oldVal === 'RUNNING') ||
        (newVal === 'STOP' && oldVal === 'PENDING')
      ) {
        clearInterval(this.timerObj);
        this.runResp(null);
        this.stopWatch = Date.parse('2018/01/01 00:00:00');
        this.distance = 0;
        this.paths = [];
        this.timerOn = false;
      }
    }
  },
  mounted() {
    navigator.geolocation.watchPosition(
      this.successPosition,
      this.errorPosition,
      { enableHighAccuracy: true }
    );
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.getCurrentUser(user.uid).then(user => {
          this.userWeight = user.weight;
        });
      }
    });
  },
  methods: {
    ...mapMutations('webapi', ['runResp']),
    ...mapActions('webapi', ['getCurrentUser']),
    successPosition(position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      this.location.lat = lat - 0.00015;
      this.location.lng = lng;
      if (this.$refs.gmap) {
        this.$refs.gmap.$mapPromise.then(map => {
          map.panTo(this.location);
          if (this.onRunning === 'RUNNING') {
            this.paths.push({ lat, lng });
            if (this.paths.length > 1) {
              const dist = this.getDistance(
                this.paths[this.paths.length - 1].lat,
                this.paths[this.paths.length - 1].lng,
                this.paths[this.paths.length - 2].lat,
                this.paths[this.paths.length - 2].lng
              );
              this.distance += dist;
            }
          }
        });
      }
    },
    errorPosition(err) {
      this.error = err;
    },
    getDistance(latitude1, longitude1, latitude2, longitude2) {
      const lat1 = latitude1 * (Math.PI / 180);
      const lng1 = longitude1 * (Math.PI / 180);
      const lat2 = latitude2 * (Math.PI / 180);
      const lng2 = longitude2 * (Math.PI / 180);
      return (
        6371 *
        Math.acos(
          Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1) +
            Math.sin(lat1) * Math.sin(lat2)
        )
      );
    },
    toFormatString(date) {
      const hour = ('0' + date.getHours()).slice(-2);
      const min = ('0' + date.getMinutes()).slice(-2);
      const sec = ('0' + date.getSeconds()).slice(-2);
      return `${hour}:${min}:${sec}`;
    }
  }
};
</script>
