<template>
  <div class="hc-header d-flex justify-content-center align-items-center">
    <div class="d-flex flex-grow-1 justify-content-center align-items-center">
      <img src="~/static/icon.png" width="30px" height="30px" class="mr-2">
      <div class="pt-1">
        HC Demo App
      </div>
    </div>
    <div v-if="onRunning != 'STOP'">
      <div class="mr-3">
        <font-awesome-icon :icon="['fas', 'running']" />
      </div>
    </div>
    <div v-else class="mr-2 border-0 rounded">
      <b-dropdown right no-caret variant="bg-primary" menu-class="customDropDownMenu">
        <template v-slot:button-content>
          <font-awesome-icon :icon="['fas', 'align-justify']" />
        </template>
        <b-dropdown-item> 
          <nuxt-link to="/meal" class="text-dark">
            <font-awesome-icon icon="utensils" />
            <a class="ml-2">食事</a>
          </nuxt-link>
        </b-dropdown-item>
        <hr class="my-1">
        <b-dropdown-item>
          <nuxt-link to="/exercise" class="text-dark">
            <font-awesome-icon icon="running" />
            <a class="ml-2">運動</a>
          </nuxt-link>
        </b-dropdown-item>
        <hr class="my-1">
        <b-dropdown-item>
          <nuxt-link to="/profile" class="text-dark">
            <font-awesome-icon icon="user-circle" />
            <a class="ml-2">アカウント</a>
          </nuxt-link>
        </b-dropdown-item>
        <hr class="my-1">
        <b-dropdown-item class="text-dark" @click="logout">
          <font-awesome-icon icon="sign-out-alt" />
          <a class="ml-2">ログアウト</a>
        </b-dropdown-item>
      </b-dropdown>
    </div>
  </div>
</template>

<script>
import firebase from '@/plugins/firebase';
export default {
  computed: {
    onRunning() {
      return this.$store.state.webapi.onRunning;
    }
  },
  methods: {
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push('/');
        });
    }
  }
};
</script>

<style scoped>
.hc-header {
  background-color: lightskyblue;
  font-family: 'Hiragino Kaku Gothic Pro', 'ヒラギノ角ゴ Pro W3', メイリオ,
    Meiryo, 'ＭＳ Ｐゴシック', sans-serif;
  font-weight: bold;
  font-size: 24px;
  width: 100%;
  height: 44px;
}

.customDropDownMenu {
  color: red;
  background-color: red;
}
</style>
