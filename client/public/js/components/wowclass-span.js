Vue.component('wowclass-span', {
    template: `<span v-bind:class="'class-' + wowclass.toLowerCase().replace(' ', '-')">
        <slot></slot>
    </span>`,
    props: ['wowclass']
})