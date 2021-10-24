<template>
  <b-modal ref="successDialog" size="sm" hide-header hide-footer centered>
    <div class="w-100 text-center text-success">
      <a>登録に成功しました</a>
    </div>
  </b-modal>
</template>

<script>
export default {
  methods: {
    showModal() {
      this.$refs.successDialog.show();
    },
    hideModal() {
      this.$refs.successDialog.hide();
    }
  }
};
</script>
