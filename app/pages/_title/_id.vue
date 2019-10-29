<template>
  <div class="article">
    <v-row align="center" justify="center">
      <v-col
      md="8"
      lg="6"
      sm='11'
      xs="12">
        <v-sheet
          tile
          :class="sheetClass"
          max-width="100%"
          elevation="4"
        >
          <v-row class="mb-1" v-if="article.tags">
            <v-chip
              v-for="tag in article.tags"
              :key="tag._id"
              class="ma-1"
            >
              <strong>{{ tag.name  }}</strong>&nbsp;
            </v-chip>
          </v-row>
          <v-row>
            <h1>{{article.title}}</h1>
          </v-row>
          <v-row>
            <span class="subtitle-1">{{article.subtitle}}</span>
          </v-row>
          <v-row class="mt-2">
            <!-- <v-btn icon @click="thumbsUp">
              <v-icon :color='thumbColor'>mdi-heart</v-icon>
            </v-btn>
            <span v-show="thumbs > 0"> {{thumbs}}</span>
            <v-spacer></v-spacer> -->
            <social-sharing
              :url="postUrl"
              :title="article.title"
              :description="article.subtitle"
              :quote="article.title"
              :hashtags="covertTagsToString"
              twitter-user="ucadvogados"
              inline-template>
              <div class="social-icons ml-auto">
                <network network="facebook">
                  <button class="mdi mdi-facebook mdi-24px"></button>
                </network>
                 <network network="twitter">
                  <button class="mdi mdi-twitter mdi-24px"></button>
                </network>
                 <network network="linkedin">
                  <button class="mdi mdi-linkedin mdi-24px"></button>
                </network>
              </div>
            </social-sharing>
          </v-row>
          <v-divider class='mb-4'></v-divider>
          <v-row>
            <div class="mr-2 float-left">
              <v-avatar
              size="44px"
              v-if="article.author.img">
                <img
                :src="imageUrl(article.author.img)"
                :alt="article.author.firstname"
                >
              </v-avatar>
              <v-avatar
              v-if="!article.author.img" 
              color="grey"
              size="44px">
                <span class="white--text headline">{{article.author.firstname.charAt(0).toUpperCase()}}</span>
              </v-avatar>              
            </div>
            <div>  
              <a 
              @click="$router.push(`/${article.author.username}`)" 
              class="text--primary font-weight-bold">
              {{ `${this.article.author.firstname} ${this.article.author.lastname}`}}
              </a><br/>
              <span><timeago :datetime='article.createdAt'></timeago></span>
            </div>                          
          </v-row>
          <v-row class="my-4" align="center" justify="center">
            <v-img
              v-if="article.img"
              :src='imageUrl(article.img)'
              aspect-ratio="1.5"
              :max-width="coverImageSize"
            >
            </v-img>
          </v-row>
          <v-row class="text-body" v-html="article.text">
          </v-row>
        </v-sheet>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import EventBus from '../../event-bus';

export default {
  head() {
    return {
      title: this.article.title,
      meta: [
        { hid: 'description', name: 'description', content: this.article.preview },
        { hid: 'author', name: 'author', content: `${this.article.author.firstname} ${this.article.author.lastname}` },
        { hid: 'og:type', property: 'og:type', content: 'article' },
        { hid: 'og:url', property: 'og:url', content: this.postUrl},
        { hid: 'og:title', property: 'og:title', content: this.article.title},
        { hid: 'og:description', property: 'og:description', content: this.article.preview},
        { hid: 'og:site_name', property: 'og:site_name', content: 'UC Advogados'},
        { hid: 'og:image', property: 'og:image', content: this.imageUrl(this.article.img) },
        { hid: 'og:image:secure_url', property: 'og:image', content: this.imageUrl(this.article.img) },
        { hid: 'og:image:width', property: 'og:image:width', content: '400' },
        { hid: 'og:image:height', property: 'og:image:height', content: '300' },
        { hid: 'article:author', property: 'article:author', content: `${this.article.author.firstname} ${this.article.author.lastname}` },
        { hid: 'article:section' ,property: 'article:section', content: this.article.type},
        { hid: 'article:tag', property: 'article:tag', content: this.covertTagsToString },
        { hid: 'article:published', property: 'article:published_time', content: this.article.createdAt},
        { hid: 'twitter:card', name: 'twitter:card', value: 'summary' },
        { hid: 'twitter:site' ,name: 'twitter:site', content: '@ucadvogados' },
        { hid: 'twitter:title', name: 'article:tag', content: this.article.title },
        { hid: 'twitter:description', name: 'twitter:description', content: this.article.preview},
        { hid: 'twitter:image', name: 'twitter:image', content: this.imageUrl(this.article.img) },
      ]
    }
  },
  data() {
    return {
      BASE_URL: process.env.BASE_URL,
      article: { author: { name: ''} },
      thumbs: 0,
      thumbColor: null,
    }
  },
  async asyncData({ $axios, params, redirect }) {
    try {
      const article = await $axios.$post(`/articles/post/${params.id}`);
      article.author = await $axios.$post(`/users/post/${article.author.id}`)
      return article ? { article } : redirect('/notfound')
  } catch (e) {
      console.error(e.message)
      redirect('/notfound')
    }
  },
  methods: {
     imageUrl (path) {
      if (!path) return
      if (/https/.test(path))
        return path
      return `${this.BASE_URL}/${path}`
    },
  },
  computed: {
     covertTagsToString() {
      if (this.article.tags) {
        const tags = this.article.tags.map((tag) => tag.name);
        const formatedTags = tags.toString().replace(/\s/g, '');
        return formatedTags;
      }
    },
    postUrl () {
      return  `${this.BASE_URL}/${this.$route.params.title}/${this.$route.params.id}`
    },
    sheetClass () { 
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 'sheet-mobile'
        default: return 'sheet'
    }
  },
    coverImageSize () {
       switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '100%'
        case 'sm': return '100%'
        default: return '80%'
      }
    }
  },
}
</script>

<style>
.sheet {
  padding: 40px 80px 40px 80px;
}
.sheet-mobile {
  padding: 15px 25px 15px 25px;
}
.text-body > h1, h2, h3, h4, h5, ol, ul {
  width: 100%;
}
@media only screen and (max-width: 600px) {
.text-body p {
  font-size: 18px !important;
}
}
.text-body p {
  font-size: 21px;
  word-break: break-word;
}
.text-body p img {
  max-width: 100%;
  max-height: 700px;
}

.social-icons .mdi {
  margin-left: 7px;
  margin-right: 7px;
  color: #0000008a;
}
</style>