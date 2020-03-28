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
    navigator.geolocation.watchPosition(
      this.successPosition,
      this.errorPosition,
      { enableHighAccuracy: true }
    );
  },
  methods: {
    successPosition(position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      this.location.lat = lat - 0.00015;
      this.location.lng = lng;
      this.$refs.gmap.$mapPromise.then(map => {
        map.panTo(this.location);
        if (this.onRunning) {
          this.paths.push({ lat, lng });
          if (this.paths.length > 1) {
            const dist = this.getDistance(
              this.paths[this.paths.length - 1].lat,
              this.paths[this.paths.length - 1].lng,
              this.paths[this.paths.length - 2].lat,
              this.paths[this.paths.length - 2].lng
            );
            this.distance += dist;
            this.$emit('updatedDistance', this.distance);
          }
        }
      });
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
    }
  }
};
</script>
