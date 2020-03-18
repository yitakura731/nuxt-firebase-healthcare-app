<template>
  <div>
    <hc-user-profile />
  </div>
</template>

<script>
import HCUserProfile from '~/components/hc-user-profile.vue';

export default {
  layout: 'main',
  components: {
    'hc-user-profile': HCUserProfile
  }
};
</script>
