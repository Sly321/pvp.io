Vue.component('match-statistic', {
    template: `
        <td>{{ statistic !== null && statistic.won }}</td>
        <td>{{ statistic !== null && statistic.lost }}</td>
        <td>{{ statistic !== null && statistic.played }}</td>`,
    props: ['statistic']
})