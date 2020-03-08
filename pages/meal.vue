<template>
  <div>
    <hc-camera />
    <hc-calorie />
    <hc-vision-detail />
    <hc-site />
  </div>
</template>

<script>
import HCCamera from '~/components/hc-camera.vue';
import HCCalorie from '~/components/hc-calorie.vue';
import HCVisionDetail from '~/components/hc-vision-detail.vue';
import HCSite from '~/components/hc-site.vue';

export default {
  layout: 'main',
  components: {
    'hc-camera': HCCamera,
    'hc-calorie': HCCalorie,
    'hc-vision-detail': HCVisionDetail,
    'hc-site': HCSite
  }
};
</script>
