<script>
import { Bar } from 'vue-chartjs';

export default {
  mixins: [Bar],
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  watch: {
    data() {
      this.render();
    }
  },
  mounted() {
    this.render();
  },
  methods: {
    render() {
      let dataMap = [];
      const now = this.$moment();
      now.set('millisecond', 0);
      now.set('second', 0);
      now.set('minute', 0);
      now.set('hour', 0);
      const keyDay = now.subtract(now.isoWeekday() - 1, 'd');
      for (let index = 0; index < 6; index++) {
        dataMap.push({
          key: this.$moment(keyDay),
          value: 0
        });
        keyDay.subtract(7, 'd');
      }
      this.data.forEach((elem) => {
        const runDate = this.$moment(elem.date);
        for (let index = 0; index < dataMap.length; index++) {
          if (runDate.isAfter(dataMap[index].key)) {
            dataMap[index].value += elem.calorie;
            break;
          }
        }
      });
      dataMap = dataMap.reverse();
      const chartData = {
        labels: dataMap.map((elem) => elem.key.format('YYYY / MM / DD')),
        datasets: [
          {
            label: 'Bar Dataset',
            data: dataMap.map((elem) => elem.value),
            backgroundColor: 'rgba(75,192,192,0.4)'
          }
        ]
      };
      const options = {
        legend: {
          display: false
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                min: 0,
                stepSize: 100
              }
            }
          ]
        }
      };
      this.renderChart(chartData, options);
    }
  }
};
</script>
