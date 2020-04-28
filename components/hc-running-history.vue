<template>
  <div v-if="runs != null && runs.length > 0">
    <hc-running-chart
      :data="runs"
      :height="300"
      class="border rounded bg-light mx-1 mt-1 mb-3"
    />
    <hr class="my-1">
    <div v-for="(run, index) in runs.slice(0, 3)" :key="run.index">
      <hc-running-history-item :run="run" :index="index" />
    </div>
  </div>
</template>>

<script>
import HcRunningChart from '~/components/hc-running-chart.vue';
import HcRunningHistoryItem from '~/components/hc-running-history-item.vue';
import firebase from '@/plugins/firebase';

export default {
  components: {
    'hc-running-history-item': HcRunningHistoryItem,
    'hc-running-chart': HcRunningChart
  },
  computed: {
    runs() {
      return this.$store.state.webapi.runs;
    }
  },
  mounted() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch('webapi/fetchRuns', { userId: user.uid });
      }
    });
  }
};
</script>>
