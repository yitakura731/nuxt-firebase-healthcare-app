<template>
  <div class="p-1">
    <b-tabs class="mt-1" fill>
      <b-tab title-link-class="text-dark">
        <template v-slot:title>
          <font-awesome-icon :icon="['fas', 'running']" />
          <a class="ml-1">ランニング</a>
        </template>
        <hc-running />
      </b-tab>
      <b-tab title-link-class="text-dark">
        <template v-slot:title>
          <font-awesome-icon :icon="['fas', 'chart-bar']" />
          <a class="ml-1">履歴</a>
        </template>
        <hc-running-history />
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import HCRunning from '~/components/hc-running.vue';
import HcRunningHistory from '~/components/hc-running-history.vue';

export default {
  layout: 'main',
  components: {
    'hc-running': HCRunning,
    'hc-running-history': HcRunningHistory
  }
};
</script>
