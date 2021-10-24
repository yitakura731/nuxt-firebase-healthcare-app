<template>
  <div>
    <hc-user-profile />
  </div>
</template>

<script>
import HCUserProfile from '~/components/hc-user-profile.vue';

export default {
  components: {
    'hc-user-profile': HCUserProfile
  },
  layout: 'main'
};
</script>
