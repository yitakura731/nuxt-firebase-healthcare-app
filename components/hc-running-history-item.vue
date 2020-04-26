<template>
  <div class="d-flex p-1 rounded-lg my-1 p-2 border border-success"> 
    <p class="flex-fill mb-0">
      {{ toFormatDate(run.date) }}
    </p>
    <p class="flex-fill mb-0">
      {{ run.distance.toFixed(2) }} km
    </p>
    <p class="mb-0">
      {{ run.calorie }} kcal
    </p>
  </div>
</template>

<script>
export default {
  props: {
    run: {
      type: Object,
      required: true,
      validator(obj) {
        return typeof obj.distance === 'number';
      }
    }
  },
  methods: {
    toFormatDate(input) {
      return this.$moment(input).format('YYYY/MM/DD');
    }
  }
};
</script>

<style scoped>
.history-item {
  background-color: rgb(166, 219, 166);
}
</style>
