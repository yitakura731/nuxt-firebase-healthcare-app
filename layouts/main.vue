<template>
  <div>
    <hc-header />
    <nuxt />
  </div>
</template>

<script>
import HCHeader from '~/components/hc-header.vue';

export default {
  components: {
    'hc-header': HCHeader
  }
};
</script>
