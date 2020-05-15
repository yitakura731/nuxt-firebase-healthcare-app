<template>
  <div class="vh-100 d-flex flex-column">
    <nuxt class="flex-grow-1" />
    <hc-footer />
  </div>
</template>

<script>
import HCFooter from '~/components/hc-footer.vue';

export default {
  components: {
    'hc-footer': HCFooter
  }
};
</script>
