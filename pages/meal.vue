<template>
  <div>
    <hc-camera />
    <hc-food />
  </div>
</template>

<script>
import HCCamera from '~/components/hc-camera.vue';
import HCFood from '~/components/hc-food.vue';

export default {
  layout: 'main',
  components: {
    'hc-camera': HCCamera,
    'hc-food': HCFood
  }
};
</script>
