<template>
    <div id="app">
        <div id="header"> Acme CMS Viewer </div>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Montserrat">
        <div id="content-area">
            {{ content }}
        </div>
        <transition name="slide-fade" appear>
            <div id="control-buttons">
                <input type="button" id="my-button" v-on:click="makeRequest('refresh')" value="REFRESH">
                <div v-if="currentPath != (PATH_SLASH + 'content')">
                    <input type="button" id="my-button" v-on:click="makeRequest('escalate')" value="ESCALATE">
                </div>
                <div v-else>
                    <input type="button" id="my-button" value="ESCALATE" disabled>
                </div>
            </div>
        </transition>
        <div id="directory-file-explorer">
            <br>
            <div v-if="dirs.length != 0">
                <div id="dir-tag">Directories:</div>
                <!-- Assign an index for safety -->
                <div v-for="(directory, index) in dirs" :key="`directory-${index}`">
                    <div id="each-dir">
                        <div id="directories">
                            <transition name="fade" appear>
                                <input type="button" id="my-button" v-on:click="makeRequest(directory)" :key="`directory-${index}`" :value="directory">
                            </transition>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="files.length != 0">
            <div id="file-tag">Files:</div>
            <div id="file-explorer">
                <div v-for="(file, index) in files" :key="`file-${index}`">
                    <div id="each-file">
                        <div id="files">
                            <transition name="fade" appear>
                                <input type="button" id="my-button" v-on:click="makeRequest(file)" :value="file">
                            </transition>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/* The server maintains a full file path, all front-end code will refer to file
paths with relation to 'content\'*/
const W_PATH_SLASH = '\\';
// Uncomment this if you need to use it
//const L_PATH_SLASH = '/';

/* WARNING : CHANGE THE DIRECTORY SEPARATOR SLASH DEPENDING ON YOUR OPERATING
SYSTEM. WINDOWS USES W_PATH_SLASH, UNIX AND ITS DERIVATIVES WITH L_PATH_SLASH.
YOU WILL NEED TO DO THIS ON THE FRONT AND BACK END.*/
const PATH_SLASH = W_PATH_SLASH;

export default {
    name: 'App',
    data () {
      return {
          content : "Content goes here!",
          api_url : "http://localhost:3000",
          files : [],
          dirs : [],
          currentPath : '',
          lastStatus : -1,
          PATH_SLASH : PATH_SLASH
      }
    },
    mounted() {
        this.makeRequest('content');
    },
    methods : {
        /* Make the request to the node endpoint with the path we have
        appropriately set as the sole header the server uses*/
        makeRequest : function(path) {
            var pathToUse = this.discernPath(path);
            fetch(this.api_url, {
                method : 'GET',
                headers : {
                    Path : pathToUse
                }
            })
            /* The response relies only on setting the value of dynamically
            rendered data in the current model-view-viewmodel*/
            .then(async response => {
                console.log("status: " + response.status);
                this.lastStatus = response.status;
                if (!(response.status == 404)) {
                    var responseData = await response.json();
                    this.currentPath = pathToUse;
                    this.files = responseData.files;
                    this.content = responseData.content;
                    this.dirs = responseData.dirs;
                } else {
                    this.content = "404: Not Found";
                }
            });
        },
        /* Set the request path to the parent directory, current directory,
        and appropriate child directory respectively*/
        discernPath : function(path) {
            if (path == "escalate") {
                return this.discernEscalatedDirectoryPath();
            } else if (path == "refresh") {
                return this.currentPath;
            } else {
                return this.currentPath + PATH_SLASH + path;
            }
        },
        /* Re-formats the current directory path to the parent by: splitting the
        path by its delimiter, and rebuilding it with the omission of the last
        directory in the path*/
        discernEscalatedDirectoryPath : function() {
            let ret = '';
            let parts = this.currentPath.split(PATH_SLASH);
            for (let i = 0; i < parts.length-1; i++) {
                if (i != parts.length-2) {
                    ret += parts[i] + PATH_SLASH;
                } else {
                    ret += parts[i];
                }
            }
            return ret;
        }
    }
}
</script>

<style>
* {
    background-color: #dedb7e;
    font-family: 'Montserrat', serif;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: black;
  margin-top: 60px;
}
#header {
    font-size: 32px;
    text-decoration: underline;
}
#content-area {
    padding: 20px;
    font-size: 20px;
}
#directories, #files {
    padding : 15px;
}
#directories-file-explorer, #file-explorer, #control-buttons {
    padding : 5px;
    text-align: center;
    display: flex;
    justify-content: space-around;
}
#file-tag, #dir-tag {
    padding: 10px;
}
#each-dir, #each-file {
    padding : 5px;
}
#my-button {
    font-size: 20px;
    border-radius: 10px;
}

.fade-enter-active,
.fade-leave-active {
  opacity: 1;
  transition: opacity 2s;
}

.fade-leave-to,
.fade-enter {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 2s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
