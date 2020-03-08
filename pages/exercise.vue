<template>
  <div>
    <hc-map />
  </div>
</template>

<script>
import HCMap from '~/components/hc-map.vue';

export default {
  layout: 'main',
  components: {
    'hc-map': HCMap
  }
};
</script>
