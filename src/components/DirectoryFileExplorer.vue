<template>
    <div id="directoryFileExplorer">

    </div>
</template>

<script>
export default {
  name: 'App',
  props : ["api_url", "root"],
  data () {
      return {
          dirs : [],
          files : []
      }
  },
  mounted() {
      fetch(this.api_url)
      .then(response => response.json())
      .then(result => {
          this.dirs = result.dirs;
          this.files = result.files;
      });
  },
  methods() {
      //
  }
}
</script>

<style>
</style>
