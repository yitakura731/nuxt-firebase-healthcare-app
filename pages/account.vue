<template>
  <div>
    <hc-header />
    <div class="p-3">
      <div class="text-center my-3">
        <h5>新規ユーザー登録</h5>
      </div>
      <b-form>
        <b-form-group
          label="メールアドレス"
          label-for="input-email"
        >
          <b-form-input
            id="input-email"
            v-model="email"
            type="email"
            required
            placeholder="Enter your email"
          />
        </b-form-group>

        <b-form-group
          label="パスワード"
          label-for="input-passwd"
        >
          <b-form-input
            id="input-passwd"
            v-model="passwd"
            type="password"
            required
            placeholder="Enter your email"
          />
        </b-form-group>

        <b-form-group label="名前" label-for="input-name">
          <b-form-input
            id="input-name"
            v-model="name"
            type="text"
            required
            placeholder="Enter your name"
          />
        </b-form-group>

        <b-form-group label="身長" label-for="input-height">
          <b-form-input
            id="input-height"
            v-model="height"
            type="number"
            required
          />
        </b-form-group>

        <b-form-group label="体重" label-for="input-weight">
          <b-form-input
            id="input-weight"
            v-model="weight"
            type="number"
            required
          />
        </b-form-group>
      </b-form>
      
      <b-button block variant="info" class="mt-4" @click="regist">
        <span>
          {{ title }}
          <b-spinner 
            v-show="onRegist" 
            small 
            label="Loading..." 
            variant="success"
            class="ml-2"
          />
        </span>
      </b-button>
      <b-alert
        v-if="error"
        show
        variant="danger"
        dismissible
        class="mt-2"
      >
        {{ error }}
      </b-alert>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';
import Cookies from 'js-cookie';
import HCHeader from '~/components/hc-header.vue';

export default {
  components: {
    'hc-header': HCHeader
  },
  data() {
    return {
      onRegist: false,
      error: null,
      email: null,
      passwd: null,
      name: null,
      height: 0,
      weight: 0
    };
  },
  computed: {
    title() {
      if (this.onRegist) {
        return '登録中';
      } else {
        return '新規登録';
      }
    }
  },
  methods: {
    ...mapActions('webapi', ['registUser']),
    ...mapMutations('webapi', {
      commitUser: 'user'
    }),
    regist() {
      this.error = null;
      this.onRegist = true;
      this.registUser({
        email: this.email,
        passwd: this.passwd,
        name: this.name,
        height: this.height,
        weight: this.weight
      })
        .then(user => {
          this.commitUser({ uid: user.uid });
          return user.getIdToken(true);
        })
        .then(token => {
          Cookies.set('__session', token);
          this.onRegist = false;
          this.$router.push('/meal');
        })
        .catch(err => {
          this.commitUser(null);
          this.onRegist = false;
          this.error = err;
        });
    }
  }
};
</script>
