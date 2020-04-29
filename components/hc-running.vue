<template>
  <div>
    <hc-running-map />
    <div class="d-flex px-5 my-2">
      <b-button 
        v-if="onRunning !== 'RUNNING'"
        pill
        class="flex-fill bg-success border-0" 
        @click="startRun()"
      >
        <font-awesome-icon :icon="['fas', 'running']" />
        走る
      </b-button>
      <b-button 
        v-else
        pill
        class="flex-fill bg-warning border-0" 
        @click="pendingRun()"
      >
        <font-awesome-icon :icon="['fas', 'running']" />
        止まる
      </b-button>
    </div>
    <div v-if="onRunning == 'STOP'" class="m-1 bg-light border rounded">
      <div 
        class="d-flex justify-content-center align-items-center" 
        style="height: 100px"
      >
        マラソンを開始してください
      </div>
    </div>
    <div v-else-if="onRunning == 'PENDING' && runResp != null" class="m-1 border rounded">
      <div class="d-flex">
        <div class="flex-fill">
          <div class="w-100 text-center">
            <small class="mb-0">
              走行距離(km)
            </small>
          </div>
          <div class="w-100 text-center">
            <h2 class="mb-0">
              {{ runResp.distance.toFixed(2) }}
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
              {{ runResp.calorie }}
            </h2>
          </div>
        </div>
      </div>
      <div class="d-flex mt-1">
        <b-button variant="secondary" class="flex-fill m-1" @click="resetRun()">
          <a>取り消し</a>
        </b-button>
        <b-button variant="success" class="flex-fill m-1" @click="registRun()">
          <a>登録</a>
        </b-button>
      </div>
    </div>
    <div v-else class="m-1 bg-success border rounded">
      <div 
        class="d-flex justify-content-center align-items-center" 
        style="height: 100px"
      >
        マラソン中
      </div>
    </div>
  </div>
</template>

<script>
import HCRunningMap from '~/components/hc-running-map.vue';
import firebase from '@/plugins/firebase';

export default {
  components: {
    'hc-running-map': HCRunningMap
  },
  data() {
    return {
      userId: null,
      error: null
    };
  },
  computed: {
    onRunning() {
      return this.$store.state.webapi.onRunning;
    },
    runResp() {
      return this.$store.state.webapi.runResp;
    }
  },
  mounted() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch('webapi/getCurrentUser', user.uid).then(user => {
          this.userId = user.id;
        });
      }
    });
  },
  methods: {
    startRun() {
      this.$store.commit('webapi/onRunning', 'RUNNING');
    },
    pendingRun() {
      this.$store.commit('webapi/onRunning', 'PENDING');
    },
    registRun() {
      this.$store.dispatch('webapi/registRun', {
        userId: this.userId,
        date: new Date(),
        distance: this.runResp.distance,
        calorie: this.runResp.calorie
      });
      this.$store.commit('webapi/onRunning', 'STOP');
    },
    resetRun() {
      this.$store.commit('webapi/onRunning', 'STOP');
    }
  }
};
</script>
