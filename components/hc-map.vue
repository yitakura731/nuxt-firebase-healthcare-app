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
        <GmapMarker :position="maplocation" :icon="icon" />
      </GmapMap>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      error: null,
      maplocation: { lng: 0, lat: 0 },
      icon: {
        url: require('@/static/circle.png'),
        size: { width: 20, height: 20, f: 'px', b: 'px' },
        scaledSize: { width: 20, height: 20, f: 'px', b: 'px' }
      }
    };
  },
  mounted() {
    this.getPosition({ enableHighAccuracy: true })
      .then(data => {
        this.maplocation.lat = data.coords.latitude;
        this.maplocation.lng = data.coords.longitude;
        this.$refs.gmap.$mapPromise.then(map => {
          map.panTo(this.maplocation);
        });
      })
      .catch(err => {
        this.error = err;
      });
  },
  methods: {
    getPosition(options) {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });
    }
  }
};
</script>
