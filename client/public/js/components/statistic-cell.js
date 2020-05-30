Vue.component('statistic-cell', {
    template: `<td class="statistic-cell" v-bind:class="className">{{ value }}</td>`,
    props: ['value', "className"]
})