import _ from "lodash";

export default {
  data() {
    return {
      page: +this.$route.query.page || 1,
      itemsOnPage: 5,
      pagesCount: 0,
      chunckedItems: [],
      currentItems: [],
    };
  },
  methods: {
    setupPagination(allItmes) {
      this.chunckedItems = _.chunk(allItmes, this.itemsOnPage);
      this.pagesCount = _.size(this.chunckedItems);
      this.currentItems =
        this.chunckedItems[this.page - 1] || this.chunckedItems[0];
    },
    onPaginate(page) {
      this.$router.push(`${this.$route.path}?page=${page}`);
      this.currentItems = this.chunckedItems[page - 1] || this.chunckedItems[0];
    },
  },
};
