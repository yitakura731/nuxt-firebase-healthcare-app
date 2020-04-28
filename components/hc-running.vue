<template>
  <div class="p-1">
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
    <hc-map @updatedDistance="updatedDistance" />
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
            走行距離(km)
          </small>
        </div>
        <div class="w-100 text-center">
          <h2 class="mb-0">
            {{ runnedDistance.toFixed(2) }}
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

    <h6 class="pl-1 pt-3">
      <bold>最近のランニング</bold>
    </h6>
    <hc-running-history />
  </div>
</template>

<script>
import HCMap from '~/components/hc-map.vue';
import HcRunningHistory from '~/components/hc-running-history.vue';
import firebase from '@/plugins/firebase';

export default {
  components: {
    'hc-map': HCMap,
    'hc-running-history': HcRunningHistory
  },
  data() {
    return {
      stopWatch: Date.parse('2018/01/01 00:00:00'),
      distance: 0,
      runnedDistance: 0,
      calorie: 0,
      currUser: {},
      timerObj: null,
      timerOn: false
    };
  },
  computed: {
    onRunning() {
      return this.$store.state.webapi.onRunning;
    }
  },
  mounted() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch('webapi/getCurrentUser', user.uid).then(user => {
          this.currUser.weight = user.weight;
          this.currUser.id = user.id;
        });
      }
    });
  },
  methods: {
    regist() {
      this.$store.dispatch('webapi/registRun', {
        userId: this.currUser.id,
        date: new Date(),
        distance: this.runnedDistance,
        calorie: this.calorie
      });
      clearInterval(this.timerObj);
      this.stopWatch = Date.parse('2018/01/01 00:00:00');
      this.distance = 0;
      this.calorie = 0;
      this.$store.commit('webapi/onRunning', false);
    },
    updatedDistance(payload) {
      this.distance = payload;
    },
    startRun() {
      const self = this;
      this.timerObj = setInterval(() => {
        self.stopWatch += 1000;
      }, 1000);
      this.timerOn = true;
      this.$store.commit('webapi/onRunning', true);
    },
    stopRun() {
      clearInterval(this.timerObj);
      this.timerOn = false;
      this.runnedDistance = this.distance;
      this.calorie = Math.round(this.runnedDistance * this.currUser.weight);
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
