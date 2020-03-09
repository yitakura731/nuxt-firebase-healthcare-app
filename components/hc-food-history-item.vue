<template>
  <div>
    <div class="d-flex p-1"> 
      <p class="flex-fill mb-0">
        {{ food.name }}
      </p>
      <p class="mb-0">
        {{ food.calorie }} kcal
      </p>
    </div>
    <hr class="my-1">
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
    toFormatString(date) {
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    }
  }
};
</script>
