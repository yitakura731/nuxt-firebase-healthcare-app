<template>
  <div>
    <hc-running />
  </div>
</template>

<script>
import HCRunning from '~/components/hc-running.vue';

export default {
  layout: 'main',
  components: {
    'hc-running': HCRunning
  }
};
</script>
