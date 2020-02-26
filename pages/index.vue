<template>
  <div>
    <hc-header />
    <hc-camera />
    <hc-product />
    <hc-site />
  </div>
</template>

<script>
import HCHeader from '~/components/hc-header.vue';
import HCCamera from '~/components/hc-camera.vue';
import HCProduct from '~/components/hc-product.vue';
import HCSite from '~/components/hc-site.vue';

export default {
  components: {
    'hc-header': HCHeader,
    'hc-camera': HCCamera,
    'hc-product': HCProduct,
    'hc-site': HCSite
  }
};
</script>
