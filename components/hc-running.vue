<template>
  <div>
    <div class="d-flex">
      <div class="flex-fill">
        <div class="w-100 text-center">
          <small class="mb-0">
            時間
          </small>
        </div>
        <div class="w-100 text-center">
          <h2 class="mb-0">
            {{ toFormatString(new Date(stopWatch)) }}
          </h2>
        </div>
      </div>
      <div class="flex-fill">
        <div class="w-100 text-center">
          <small class="mb-0">
            距離(km)
          </small>
        </div>
        <div class="w-100 text-center">
          <h2 class="mb-0">
            {{ distance.toFixed(2) }}
          </h2>
        </div>
      </div>
    </div>
    <hc-map :on-running="onRunning" @updatedDistance="updatedDistance" />
    <div class="d-flex">
      <b-button 
        v-if="!timerOn"
        class="flex-fill pill bg-success border-0 m-1" 
        @click="startRun()"
      >
        <font-awesome-icon :icon="['fas', 'running']" />
        走る
      </b-button>
      <b-button 
        v-if="timerOn"
        class="flex-fill pill bg-warning border-0 m-1" 
        @click="stopRun()"
      >
        <font-awesome-icon :icon="['fas', 'running']" />
        止まる
      </b-button>
      <b-button 
        class="flex-fill pill bg-info border-0 m-1"
        @click="completeRun()"
      >
        おしまい
      </b-button>
    </div>
    <div v-if="onRunning && !timerOn" class="d-flex border m-1 rounded">
      <div class="flex-fill">
        <div class="w-100 text-center">
          <small class="mb-0">
            走行距離(lm)
          </small>
        </div>
        <div class="w-100 text-center">
          <h2 class="mb-0">
            {{ distance.toFixed(2) }}
          </h2>
        </div>
      </div>
      <div class="flex-fill">
        <div class="w-100 text-center">
          <small class="mb-0">
            消費カロリー(kcal)
          </small>
        </div>
        <div class="w-100 text-center">
          <h2 class="mb-0">
            {{ Math.round(calorie, 1) }}
          </h2>
        </div>
      </div>
      <div class="p-2">
        <b-button pill variant="info" class="mt-3" @click="regist()">
          <a>登録</a>
        </b-button>
      </div>
    </div>
    <hc-running-history />
  </div>
</template>

<script>
import HCMap from '~/components/hc-map.vue';
import HcRunningHistory from '~/components/hc-running-history.vue';

export default {
  components: {
    'hc-map': HCMap,
    'hc-running-history': HcRunningHistory
  },
  data() {
    return {
      stopWatch: Date.parse('2018/01/01 00:00:00'),
      distance: 0,
      calorie: 0,
      timerObj: null,
      timerOn: false,
      onRunning: false
    };
  },
  methods: {
    regist() {
      this.$store.dispatch('webapi/registRun', {
        distance: this.distance,
        calorie: this.calorie
      });
    },
    updatedDistance(payload) {
      this.distance = payload;
    },
    startRun() {
      const self = this;
      this.timerObj = setInterval(() => {
        self.count();
      }, 1000);
      this.timerOn = true;
      this.onRunning = true;
    },
    stopRun() {
      clearInterval(this.timerObj);
      this.timerOn = false;
      this.calorie = this.distance * 60;
    },
    completeRun() {
      clearInterval(this.timerObj);
      this.stopWatch = Date.parse('2018/01/01 00:00:00');
      this.timerOn = false;
      this.onRunning = false;
    },
    count() {
      this.stopWatch += 1000;
    },
    toFormatString(date) {
      const hour = ('0' + date.getHours()).slice(-2);
      const min = ('0' + date.getMinutes()).slice(-2);
      const sec = ('0' + date.getSeconds()).slice(-2);
      return `${hour}:${min}:${sec}`;
    }
  }
};
</script>
