<template>
  <div>
    <hc-header />
    <hc-camera />
    <hc-site />
  </div>
</template>

<script>
import HCHeader from '~/components/hc-header.vue';
import HCCamera from '~/components/hc-camera.vue';
import HCSite from '~/components/hc-site.vue';

export default {
  components: {
    'hc-header': HCHeader,
    'hc-camera': HCCamera,
    'hc-site': HCSite
  }
};
</script>
