<template>
  <b-modal 
    ref="accountModal"
    hide-header
    hide-footer
    body-class="p-0"
  >
    <div class="text-center py-2 text-white bg-info">
      <h5 class="mb-0">
        新規ユーザー登録
      </h5>
    </div>
    <hr class="y-0 my-0">
    <div class="p-3">
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
            :disabled="mode === 'social'"
            placeholder="Enter your email"
          />
        </b-form-group>

        <b-form-group
          v-if="mode === 'local'"
          label="パスワード"
          label-for="input-passwd"
        >
          <b-form-input
            id="input-passwd"
            v-model="passwd"
            type="password"
            required
            placeholder="Enter your password"
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
      
      <div class="d-flex w-100">
        <b-button class="flex-fill m-1" @click="hideModal">
          キャンセル
        </b-button>
        <b-button class="flex-fill m-1" variant="info" @click="regist">
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
      </div>

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
  </b-modal>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';
import Cookies from 'js-cookie';
import firebase from 'firebase/app';
import 'firebase/auth';

export default {
  data() {
    return {
      onRegist: false,
      error: null,
      email: null,
      passwd: null,
      name: null,
      height: 160,
      weight: 50,
      mode: null
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
    ...mapActions('webapi', ['registUser', 'updateUser']),
    ...mapMutations('webapi', {
      commitUser: 'user'
    }),
    showModal(arg, cbk) {
      this.mode = arg.mode;
      this.email = arg.email;
      this.$refs.accountModal.show();
    },
    hideModal() {
      this.onRegist = false;
      this.error = null;
      this.email = null;
      this.passwd = null;
      this.name = null;
      this.height = 160;
      this.weight = 50;
      this.mode = null;
      this.$refs.accountModal.hide();
    },
    async regist() {
      this.error = null;
      this.onRegist = true;
      try {
        let user = null;
        if (this.mode === 'local') {
          user = await this.registUser({
            email: this.email,
            passwd: this.passwd
          });
        } else {
          user = firebase.auth().currentUser;
        }
        await this.updateUser({
          uid: user.uid,
          name: this.name,
          height: this.height,
          weight: this.weight
        });
        const token = await user.getIdToken(true);
        Cookies.set('__session', token);
        this.commitUser({ uid: user.uid });
        this.onRegist = false;
        this.$refs.accountModal.hide();
        this.$router.push('/meal');
      } catch (err) {
        Cookies.remove('__session');
        this.commitUser({ uid: null });
        this.onRegist = false;
        this.error = err;
      }
    }
  }
};
</script>
