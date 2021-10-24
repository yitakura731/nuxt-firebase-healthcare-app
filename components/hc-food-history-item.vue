<template>
  <div>
    <div class="d-flex p-1 my-1 py-1">
      <div class="flex-fill text-center mb-0 mt-2">
        {{ toFormatDate(food.date) }}
      </div>
      <div class="flex-fill text-center mb-0 mt-2 ml-2">
        {{ food.name }}
      </div>
      <div class="flex-fill text-center mb-0 ml-2">
        <span class="food-item">
          {{ food.calorie }}
        </span>
        kcal
      </div>
    </div>
    <hr class="my-1" />
  </div>
</template>

<script>
export default {
  props: {
    food: {
      type: Object,
      required: true,
      validator(obj) {
        return typeof obj.name === 'string';
      }
    }
  },
  methods: {
    toFormatDate(date) {
      return this.$moment(date).format('YYYY/MM/DD');
    }
  }
};
</script>

<style scoped>
.food-item {
  font-size: 1.5em;
}
</style>
