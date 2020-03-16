<template>
  <div class="p-2">
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
        <gmap-polygon 
          v-if="paths.length > 0" 
          :paths="paths" 
          :options="{
            'strokeColor': '#4169e1',
            'strokeWeight': 10}"
        />
      </GmapMap>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    onRunning: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      error: null,
      location: { lng: 0, lat: 0 },
      distance: 0,
      paths: [],
      icon: {
        url: require('@/static/circle.png'),
        size: { width: 20, height: 20, f: 'px', b: 'px' },
        scaledSize: { width: 20, height: 20, f: 'px', b: 'px' }
      },
      timerObj: null
    };
  },
  watch: {
    onRunning(newVal, oldVal) {
      if (!newVal && oldVal) {
        this.distance = 0;
        this.paths = [];
      }
    }
  },
  mounted() {
    const self = this;
    this.timerObj = setInterval(() => {
      self.updatePosition();
    }, 2000);
  },
  methods: {
    updatePosition() {
      const self = this;
      this.index++;
      this.getPosition({ enableHighAccuracy: true })
        .then(data => {
          const lat = data.coords.latitude;
          const lng = data.coords.longitude;
          this.location.lat = lat - 0.00015;
          this.location.lng = lng;
          this.$refs.gmap.$mapPromise.then(map => {
            map.panTo(this.location);
            if (self.onRunning) {
              self.paths.push({ lat, lng });
              self.distance += self.getDistance();
              self.$emit('updatedDistance', self.distance);
            }
          });
        })
        .catch(err => {
          this.error = err;
        });
    },
    getPosition(options) {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });
    },
    getDistance() {
      let retVal = 0;
      if (this.paths.length >= 2) {
        const length = this.paths.length;
        const lat1 = this.paths[length - 1].lat * (Math.PI / 180);
        const lng1 = this.paths[length - 1].lng * (Math.PI / 180);
        const lat2 = this.paths[length - 2].lat * (Math.PI / 180);
        const lng2 = this.paths[length - 2].lng * (Math.PI / 180);
        retVal =
          6371 *
          Math.acos(
            Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1) +
              Math.sin(lat1) * Math.sin(lat2)
          );
      }
      return retVal;
    }
  }
};
</script>
