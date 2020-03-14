<template>
  <div v-if="runs != null && runs.length > 0" class="p-2">
    履歴
    <div v-for="(run, index) in runs" :key="run.index">
      <hc-running-history-item :run="run" :index="index" />
    </div>
  </div>
</template>>

<script>
import HcRunningHistoryItem from '~/components/hc-running-history-item.vue';

export default {
  components: {
    'hc-running-history-item': HcRunningHistoryItem
  },
  computed: {
    runs() {
      return this.$store.state.webapi.runs;
    }
  }
};
</script>>
