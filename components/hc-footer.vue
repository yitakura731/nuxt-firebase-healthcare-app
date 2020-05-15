<template>
  <b-navbar class="border-top bg-light py-0">
    <div 
      v-if="onRunning !== 'RUNNING'" 
      class="d-flex justify-content-around w-100"
    >
      <b-button 
        class="bg-light border-0 hc-footer-text"
      >
        <nuxt-link to="/meal" class="text-dark">
          <font-awesome-icon icon="utensils" />
          <div class="text-size">
            食事管理
          </div>
        </nuxt-link>
      </b-button>
      <b-button 
        class="bg-light border-0 hc-footer-text"
      >
        <nuxt-link to="/exercise" class="text-dark">
          <font-awesome-icon icon="running" />
          <div class="text-size">
            運動管理
          </div>
        </nuxt-link>
      </b-button>
      <b-button 
        class="bg-light border-0 hc-footer-text"
      >
        <nuxt-link to="/profile" class="text-dark">
          <font-awesome-icon icon="user-circle" />
          <div class="text-size">
            アカウント
          </div>
        </nuxt-link>
      </b-button>
      <b-button 
        class="bg-light text-dark border-0 hc-footer-text" 
        @click="logout"
      >
        <font-awesome-icon icon="sign-out-alt" />
        <div class="text-size">
          サインアウト
        </div>
      </b-button>
    </div>
  </b-navbar>
</template>

<script>
import Cookies from 'js-cookie';
import { mapGetters, mapMutations } from 'vuex';
import firebase from 'firebase/app';
import 'firebase/auth';

export default {
  computed: {
    ...mapGetters('webapi', ['onRunning'])
  },
  methods: {
    ...mapMutations('webapi', {
      commitUser: 'user'
    }),
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.commitUser(null);
          Cookies.remove('__session');
          this.$router.push('/');
        });
    }
  }
};
</script>

<style scoped>
.hc-footer-text {
  font-size: 22px;
}

.text-size {
  font-size: 10px;
}
</style>
