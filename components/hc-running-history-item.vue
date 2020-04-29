<template>
  <div>
    <div class="d-flex p-1 my-1 py-2"> 
      <div class="flex-fill text-center mt-2 mb-0">
        {{ toFormatDate(run.date) }}
      </div>
      <div class="flex-fill text-center mb-0">
        <span class="run-item">
          {{ run.distance.toFixed(2) }}
        </span>
        km
      </div>
      <div class="flex-fill text-center mb-0">
        <span class="run-item">
          {{ run.calorie }}
        </span>
        kcal
      </div>
    </div>
    <hr class="my-1">
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
.run-item {
  font-size: 1.5em;
}
</style>
