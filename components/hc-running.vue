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
            {{ distance }}
          </h2>
        </div>
      </div>
    </div>
    <hc-map @updateLocation="updatedLocation" />
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
        class="flex-fill pill bg-secoundary border-0 m-1"
        @click="reset()"
      >
        リセット
      </b-button>
    </div>
  </div>
</template>

<script>
import HCMap from '~/components/hc-map.vue';

export default {
  components: {
    'hc-map': HCMap
  },
  data() {
    return {
      stopWatch: Date.parse('2018/01/01 00:00:00'),
      distance: '00.00',
      beforeLocation: null,
      afterLocation: null,
      timerObj: null,
      timerOn: false
    };
  },
  methods: {
    updatedLocation(payload) {
      this.beforeLocation = this.afterLocation;
      this.afterLocation = payload;
    },
    startRun() {
      const self = this;
      this.timerObj = setInterval(() => {
        self.count();
      }, 1000);
      this.timerOn = true;
    },
    stopRun() {
      clearInterval(this.timerObj);
      this.timerOn = false;
    },
    reset() {
      clearInterval(this.timerObj);
      this.stopWatch = Date.parse('2018/01/01 00:00:00');
      this.timerOn = false;
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
