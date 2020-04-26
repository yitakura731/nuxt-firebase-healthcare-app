<script>
import { HorizontalBar } from 'vue-chartjs';

export default {
  name: 'HCChart',
  extends: HorizontalBar,
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      options: {
        legend: {
          display: false
        }
      }
    };
  },
  mounted() {
    this.renderChart(this.data, this.options);
  }
};
</script>
