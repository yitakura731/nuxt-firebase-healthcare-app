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
    <div class="d-flex px-5 py-1">
      <b-button 
        v-if="!timerOn"
        pill
        class="flex-fill bg-success border-0" 
        @click="startRun()"
      >
        <font-awesome-icon :icon="['fas', 'running']" />
        走る
      </b-button>
      <b-button 
        v-if="timerOn"
        pill
        class="flex-fill bg-warning border-0" 
        @click="stopRun()"
      >
        <font-awesome-icon :icon="['fas', 'running']" />
        止まる
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
            {{ calorie }}
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
  computed: {
    user() {
      return this.$store.state.webapi.user;
    }
  },
  methods: {
    regist() {
      this.$store.dispatch('webapi/registRun', {
        distance: this.distance,
        calorie: this.calorie
      });
      clearInterval(this.timerObj);
      this.stopWatch = Date.parse('2018/01/01 00:00:00');
      this.distance = 0;
      this.calorie = 0;
      this.timerOn = false;
      this.onRunning = false;
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
      this.calorie = Math.round(this.distance * this.user.weight);
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
