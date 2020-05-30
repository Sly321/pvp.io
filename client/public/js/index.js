

var auth = new Vue({
    el: '#auth',
    data: {
      loggedIn: undefined,
      user: undefined
    },
    created: function() {
      fetch("/api/v1/profile").then(res => {
        if (res.status == 404) {
          this.loggedIn = false
        } else {
          this.loggedIn = true
          res.json().then(v => this.user = v)
        }
      }).catch(e => console.log(e))
    },
    methods: {
      reverseMessage: function () {
        this.message = this.message.split('').reverse().join('')
      }
    }
})

Vue.component('bracket-2v2', {
  data: function() {
    return { rating: "<no rating>" }
  },
  mounted () {
    fetch(`/api/v1/rating?bracket=2v2&name=${this.name.toLowerCase()}&realmSlug=${this.realmSlug}`).then(res => {
      res.json().then(rating => {
        this.rating = rating.rating
      }).catch(() => {

      })
    })
  },
  template: "<span>{{ rating }}</span>",
  props: ['realmSlug', 'name']
})

Vue.component('bracket-3v3', {
  data: function() {
    return { rating: "<no rating>" }
  },
  mounted () {
    fetch(`/api/v1/rating?bracket=3v3&name=${this.name.toLowerCase()}&realmSlug=${this.realmSlug}`).then(res => {
      res.json().then(rating => {
        this.rating = rating.rating
      }).catch(() => {

      })
    })
  },
  template: "<span>{{ rating }}</span>",
  props: ['realmSlug', 'name']
})

Vue.component('character', {
  data: function() {
    return {
        rating: {
          twos: "null",
          threes: "null"
      }
    }
  },
  
  // created: () => console.log("character created"),
  template: '\
    <tr v-if="character.level === 120">\
      <td>{{ character.name }}</td>\
      <td>{{ character.realm.name }}</td>\
      <td>{{ character.level }}</td>\
      <td><bracket-2v2 v-bind:realmSlug="character.realm.slug" v-bind:name="character.name" /></td>\
      <td><bracket-3v3 v-bind:realmSlug="character.realm.slug" v-bind:name="character.name" /></td>\
    </tr>\
  ',
  props: ['character']
})

const characters = new Vue({
  el: '#characters',
  data: {
    characters: [],
  },
  created: function() {
    fetch("/api/v1/characters").then(res => {
      res.json().then(chars => {
        this.characters = chars
        console.log(chars)
      })
    })
  },
})