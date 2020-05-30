Vue.component('bracket-2v2', {
    template: `<td class="space-left rating-cell">
        <div v-if="rating !== ''" class="pvp-rank-img-wrapper">
            <img v-bind:src="'/assets/pvp-rang-' + (rating < 1400 ? 1 : (rating < 1600 ? 2 : (rating < 1800 ? 3 : rating < 2100 ? 4 : rating < 2400 ? 5 : 6))) + '.png'" height="20" />
        </div>
        {{ rating }}
    </td>`,
    props: ['rating']
})

