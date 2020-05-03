<template>
  <div>
    <hc-running-map />
    <div class="d-flex px-5 my-1">
      <b-button 
        v-if="onRunning !== 'RUNNING'"
        pill
        variant="success"
        class="flex-fill border-0" 
        @click="startRun()"
      >
        <font-awesome-icon :icon="['fas', 'running']" />
        走る
      </b-button>
      <b-button 
        v-if="onRunning === 'RUNNING'"
        pill
        variant="warning" 
        class="flex-fill border-0" 
        @click="pendingRun()"
      >
        <font-awesome-icon :icon="['fas', 'walking']" />
        止まる
      </b-button>
      <b-button 
        v-if="onRunning === 'PENDING'"
        pill
        variant="secondary" 
        class="flex-fill border-0 ml-1" 
        @click="stopRun()"
      >
        <font-awesome-icon :icon="['fas', 'stop-circle']" />
        終わる
      </b-button>
    </div>
    <div v-if="onRunning === 'STOP'" class="m-1 bg-light border rounded">
      <div 
        class="d-flex justify-content-center align-items-center" 
        style="height: 100px"
      >
        マラソンを開始してください
      </div>
    </div>
    <div v-else-if="onRunning === 'PENDING' && runResp != null" class="m-1 border rounded">
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
        <b-button
          v-b-modal.site-modal 
          variant="danger"
          class="flex-fill m-1"
        >
          <font-awesome-icon :icon="['fas', 'registered']" />
          <a>楽天</a>
        </b-button>
        <b-button variant="success" class="flex-fill m-1" @click="storeRun()">
          <font-awesome-icon :icon="['fas', 'cloud-upload-alt']" />
          <a>登録</a>
        </b-button>
      </div>
      <b-alert variant="success" :show="successRegist" class="my-1 mx-2 p-1 text-center">
        登録に成功しました
      </b-alert>
      <b-alert variant="warning" :show="error != null" class="my-1 mx-2 p-1 text-center">
        {{ error }}
      </b-alert>
    </div>
    <div v-else class="m-1 running-area border rounded">
      <div 
        class="d-flex justify-content-center align-items-center" 
        style="height: 100px"
      >
        <font-awesome-icon :icon="['fas', 'running']" class="mr-2" />
        マラソン中
        <b-spinner label="Loading..." variant="success" class="ml-2" />
      </div>
    </div>
    <hc-site :calorie="queryCalorie" />
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import firebase from 'firebase/app';
import HCRunningMap from '~/components/hc-running-map.vue';
import HCSite from '~/components/hc-site.vue';
import 'firebase/auth';

export default {
  components: {
    'hc-running-map': HCRunningMap,
    'hc-site': HCSite
  },
  data() {
    return {
      userId: null,
      successRegist: false,
      error: null
    };
  },
  computed: {
    ...mapGetters({
      onRunning: 'webapi/onRunning',
      runResp: 'webapi/runResp'
    }),
    queryCalorie() {
      let retVal = -1;
      if (this.runResp != null) {
        retVal = this.runResp.calorie;
        const numlen = String(retVal).length;
        if (numlen > 2) {
          const base = Math.pow(10, numlen - 2);
          retVal = Math.floor(retVal / base) * base;
        }
      }
      return retVal;
    }
  },
  watch: {
    runResp(newVal, oldVal) {
      if (!newVal) {
        this.successRegist = false;
        this.error = null;
      }
    }
  },
  mounted() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.getCurrentUser(user.uid).then(user => {
          this.userId = user.id;
        });
      }
    });
  },
  methods: {
    ...mapMutations({
      commitOnRunning: 'webapi/onRunning'
    }),
    ...mapActions('webapi', ['getCurrentUser', 'registRun']),
    startRun() {
      this.commitOnRunning('RUNNING');
    },
    pendingRun() {
      this.commitOnRunning('PENDING');
    },
    stopRun() {
      this.commitOnRunning('STOP');
    },
    storeRun() {
      this.registRun({
        userId: this.userId,
        date: new Date(),
        distance: this.runResp.distance,
        calorie: this.runResp.calorie
      })
        .then(() => {
          this.successRegist = true;
        })
        .catch(err => {
          if (
            err.response != null &&
            err.response.data != null &&
            err.response.data.error != null
          ) {
            this.error = 'Firebase Error : ' + err.response.data.error;
          } else {
            this.error = err;
          }
        });
    }
  }
};
</script>

<style scoped>
.running-area {
  background-color: rgb(149, 211, 160);
}
</style>
