let development = process.env.NODE_ENV !== 'production'
let URL = 'https://ucadvogados.anuardaher.com'

module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - ' + 'UC Advogados',
    title: 'UC Advogados',
    meta: [
      { charset: 'utf-8' },
      { name:"robots", content:"index,follow" },
      { name:'author', content:"Anuar Daher"},
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'description', content: 'Blog, jornal, noticias e orientações jurídicas para alunos, profissionais e interessados sobre as diversas áreas do direito.' },
      { name: 'keywords', content: 'direito, advogados, constituição, lei, noticias, artigos, consumidor, direito administrativo, direito constitucional, direito civil, direito penal, direito tributário'},
      { name: 'language', content: 'Portuguese'},
      { property: 'og:locale', content: 'pt_BR'}, 
      { property: 'og:img', content: `${URL}/ucadvogados.jpg`},
      { property: 'og:image:secure_url', content: `${URL}/ucadvogados.jpg`},
      { property: 'fb:app_id', content: '365056554418853'},
      { property: 'og:ttl', content: '2419100'} 
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: "#fff", height: '4px' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/localStorage', mode: 'client' },
    '@plugins/vuetify',
    '@plugins/timeago',
    '@plugins/socialSharing',
  ],

  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/vuetify'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    'cookie-universal-nuxt'
  ],

  env: {
    BASE_URL: development ? 'http://localhost:3001' : URL
  },

  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    proxy: true,
    prefix: '/api/v1'
  },

  proxy: {
    '/api/v1': development ? 'http://localhost:3001' : URL,
  },

  router: {
    scrollBehavior: function (to, from, savedPosition) {
      return { x: 0, y: 0 }
    }
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
   
    extend (config, ctx) {
    }
  }
}
