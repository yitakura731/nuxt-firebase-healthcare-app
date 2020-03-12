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
      </GmapMap>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      error: null,
      location: { lng: 0, lat: 0 },
      icon: {
        url: require('@/static/circle.png'),
        size: { width: 20, height: 20, f: 'px', b: 'px' },
        scaledSize: { width: 20, height: 20, f: 'px', b: 'px' }
      },
      timerObj: null,
      timerOn: false
    };
  },
  mounted() {
    const self = this;
    this.timerObj = setInterval(() => {
      self.updatePosition();
    }, 1000);
    this.timerOn = true;
  },
  methods: {
    updatePosition() {
      this.getPosition({ enableHighAccuracy: true })
        .then(data => {
          this.location.lat = data.coords.latitude;
          this.location.lng = data.coords.longitude;
          this.$refs.gmap.$mapPromise.then(map => {
            map.panTo(this.location);
            this.$emit('updateLocation', this.location);
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
    }
  }
};
</script>
