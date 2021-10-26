<template>
  <div class="d-flex flex-column">
    <b-button-group class="py-1 px-4 hc-meal-tabs">
      <b-button
        variant="primary"
        class="px-0"
        :pressed="target === 'camera'"
        @click="setTarget('camera')"
      >
        <div class="d-flex justify-content-center align-items-center">
          <font-awesome-icon :icon="['fas', 'camera']" class="mr-2" />
          <div class="text-white">カロリー計測</div>
        </div>
      </b-button>

      <b-button
        variant="primary"
        :pressed="target === 'history'"
        @click="setTarget('history')"
      >
        <div class="d-flex justify-content-center align-items-center">
          <font-awesome-icon :icon="['fas', 'chart-bar']" />
          <div class="ml-1 text-white">履歴</div>
        </div>
      </b-button>
    </b-button-group>

    <div v-show="target === 'camera'" class="flex-grow-1">
      <hc-food />
    </div>

    <div v-show="target === 'history'" class="flex-grow-1">
      <hc-food-history />
    </div>
  </div>
</template>

<script>
import HCFoodHistory from '~/components/hc-food-history.vue';

import HCFood from '~/components/hc-food.vue';

export default {
  components: {
    'hc-food': HCFood,

    'hc-food-history': HCFoodHistory
  },

  layout: 'main',

  data() {
    return {
      target: 'camera'
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
.hc-meal-tabs {
  background-color: rgb(115, 160, 243);
}
</style>
