<template>
  <div class="d-flex flex-column">
    <b-button-group class="py-1 px-4 hc-meal-tabs">
      <b-button
        variant="primary"
        class="px-0"
        :pressed="target === 'running'"
        @click="setTarget('running')"
      >
        <div class="d-flex justify-content-center align-items-center">
          <font-awesome-icon :icon="['fas', 'running']" />
          <div class="text-white">ランニング</div>
        </div>
      </b-button>
      <b-button
        variant="primary"
        :pressed="target === 'history'"
        @click="setTarget('history')"
      >
        <div class="d-flex justify-content-center align-items-center">
          <font-awesome-icon :icon="['fas', 'chart-bar']" />
          <div class="text-white">履歴</div>
        </div>
      </b-button>
    </b-button-group>
    <div v-show="target === 'running'" class="flex-grow-1">
      <hc-running />
    </div>
    <div v-show="target === 'history'" class="flex-grow-1">
      <hc-running-history />
    </div>
  </div>
</template>

<script>
import HCRunning from '~/components/hc-running.vue';
import HcRunningHistory from '~/components/hc-running-history.vue';

export default {
  components: {
    'hc-running': HCRunning,
    'hc-running-history': HcRunningHistory
  },
  layout: 'main',
  data() {
    return {
      target: 'running'
    };
  },
  methods: {
    setTarget(input) {
      this.target = input;
    }
  }
};
</script>

<style>
.hc-exercise-tabs {
  background-color: rgb(115, 160, 243);
}
</style>
