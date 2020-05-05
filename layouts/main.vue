<template>
  <div class="vh-100">
    <hc-header />
    <nuxt />
    <hc-footer />
  </div>
</template>

<script>
import HCHeader from '~/components/hc-header.vue';
import HCFooter from '~/components/hc-footer.vue';

export default {
  components: {
    'hc-header': HCHeader,
    'hc-footer': HCFooter
  }
};
</script>
