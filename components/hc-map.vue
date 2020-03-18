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
    }, 4000);
  },
  methods: {
    updatePosition() {
      const self = this;
      this.getPosition({ enableHighAccuracy: true })
        .then(data => {
          let dist = 0;
          const lat = data.coords.latitude;
          const lng = data.coords.longitude;
          this.location.lat = lat - 0.00015;
          this.location.lng = lng;
          this.$refs.gmap.$mapPromise.then(map => {
            map.panTo(this.location);
            if (self.onRunning) {
              if (self.paths.length > 1) {
                dist = self.getDistance(
                  self.paths[self.paths.length - 1].lat,
                  self.paths[self.paths.length - 1].lng,
                  self.paths[self.paths.length - 2].lat,
                  self.paths[self.paths.length - 2].lng
                );
                if (dist <= 0.02) {
                  self.paths.push({ lat, lng });
                  self.distance += dist;
                  self.$emit('updatedDistance', self.distance);
                }
              } else {
                self.paths.push({ lat, lng });
              }
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
    }
  }
};
</script>
