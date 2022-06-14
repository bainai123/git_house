const app = Vue.createApp({
    data() {
        return {
            bangId: 93,
            pn: 1,
            rn: 30,
            bangMenu: [],
            curBang: '官方',
            bangList: [],
            curBangList: '酷我飙升榜',
            // 歌曲数组
            musicList: [],
            // 更新时间
            pub: '',
            // 歌曲数
            num: 0,
            // 鼠标移入背景变色
            curSongIndex: 0,
            page: 0,
            // 播放列表
            playList: [],
            // 当前音乐播放地址
            musicUrl: '',
            // 单个歌曲id
            rid: 0,
            // 歌曲是否暂停
            is_stop: true,
            // 当前歌曲索引
            songIndex: 0,
            showList: false,
            // 当前音频长度，以秒计算
            duration: 0,
            // 当前播放到了哪
            currentTime: 0,
            // 进度条的value
            rangValue: 0,
            // 音量
            volume: 0,
            // 单个歌曲的信息
            singleSong: [],
            // 锁标志
            isLock: false,
            type: 'music',
            mvUrl: ''

        }
    },
    created() {
        this.getBangMenu();
        this.getSongData();
        // this.getSong() 

    },
    methods: {
        // 获取左侧榜单菜单数据
        getBangMenu() {
            let url = `http://192.168.209.49:3000/api/www/bang/bang/bangMenu`
            axios.get(url).then(data => {
                this.bangMenu = data.data.data.slice(0, 3)
                this.changeTab(this.bangId, this.curBang, this.curBangList)
            })
        },
        // 获取歌曲数据
        getSongData() {
            let url = `http://192.168.209.49:3000/api/www/bang/bang/musicList`
            axios.get(url, {
                params: {
                    bangId: this.bangId,
                    pn: this.pn,
                    rn: this.rn
                }
            }).then(data => {
                let dataArr = data.data.data
                this.pub = dataArr.pub;
                this.num = dataArr.num;
                this.musicList = dataArr.musicList
                this.getNum(this.num)
                this.rid = this.musicList[0].rid
                // console.log(this.rid);
                this.getSong()
                this.getSongInfo()
            })
        },
        // 左侧切换官方
        changeTab(id, name, bangName) {
            this.bangId = id
            this.curBang = name;
            this.curBangList = bangName;
            this.pn = 1;
            this.getBangList();
            this.getSongData();

        },
        getBangList() {
            this.bangList = this.bangMenu.find(item => item.name == this.curBang)
        },
        // 左侧切换榜单类
        changeSongList(id, name) {
            this.bangId = id;
            this.curBangList = name;
            this.pn = 1;
            this.getSongData()
        },
        //处理前三的歌曲
        getStyle(i) {
            if (i == 0) {
                return `rank_num top1 `
            } else if (i == 1) {
                return `rank_num top2 `
            } else if (i == 2) {
                return `rank_num top3 `
            } else {
                return `rank_num `
            }
        },
        // 处理鼠标进入背景色变色
        mouseEnter(index) {
            this.curSongIndex = index
        },
        mouseLeave() {
            this.curSongIndex = 0
        },
        getNum(i) {
            this.page = Math.ceil(i * 1 / 30)
        },
        changePage(page) {
            this.pn = page
            this.getSongData()
            this.playList = []
        },
        // 下一页
        prePage() {
            if (this.pn > 1) {
                this.pn--
            } else {
                this.pn = 1
            }
            console.log(this.pn);
        },
        // 上一页
        nextPage() {
            console.log(this.page);
            if (this.pn < this.page) {
                this.pn++
            } else {
                this.pn = this.page
            }

            console.log(this.pn);

        },
        // 获取歌曲数据
        getSong() {
            let url = `http://192.168.209.49:3000/api/v1/www/music/playUrl`
            axios.get(url, {
                params: {
                    mid: this.rid,
                    type: this.type
                }
            }).then(data => {
                this.musicUrl = data.data.data.url
                // console.log(this.musicUrl);

            })
        },
        getSongInfo() {
            let url = `http://192.168.209.49:3000/api/www/music/musicInfo`
            axios.get(url, {
                params: {
                    mid: this.rid
                }
            }).then(data => {
                this.singleSong = data.data.data
                this.duration = this.singleSong.duration
            })
        },
        getMv(id) {
            this.rid = id;
            console.log(this.rid);
            let url = `http://192.168.209.49:3000/api/v1/www/music/playUrl`
            axios.get(url, {
                params: {
                    mid: this.rid,
                    type: 'mv'
                }
            }).then(data => {
                this.mvUrl = data.data.data.url
            })
        },
        playAll() {
            // this.playList = JSON.parse(JSON.stringify(this.musicList))
            this.musicList.forEach((ele) => {
                if (this.playList.indexOf(ele) === -1) this.playList.push(ele);
            });


        },
        playSong(id) {
            console.log(id);
            this.rid = id
            this.getSong()
            this.getSongInfo()
        },
        plays() {
            if (this.is_stop) {
                this.$refs.audio.play()
            } else {
                this.$refs.audio.pause()
            }
            this.is_stop = !this.is_stop
        },
        nextSong() {
            if (this.playList) {
                if (this.songIndex < this.playList.length - 1) {
                    this.songIndex++;
                } else {
                    this.songIndex = this.playList.length - 1
                }
                this.rid = this.playList[this.songIndex].rid;
                this.getSong();
                this.getSongInfo();
            }

        },
        prevSong() {
            if (this.playList) {
                if (this.songIndex > -1) {
                    this.songIndex--;
                } else {
                    this.songIndex = 0
                }
                this.rid = this.playList[this.songIndex].rid
                this.getSong();
                this.getSongInfo();
            }

        },
        // 删除列表中的某首歌曲
        deleteSong(i) {
            console.log(i);
            this.playList.splice(i, 1);
        },
        clearList() {
            this.playList = [];
        },
        closeList() {
            this.showList = false
        },
        toggleList() {
            this.showList = !this.showList
        },
        //秒数转化为mm:ss形式
        toTime(sec) {
            let s = sec % 60 < 10 ? ('0' + sec % 60) : sec % 60
            let min = Math.floor(sec / 60) < 10 ? ('0' + Math.floor(sec / 60)) : Math.floor(sec / 60)
            return min + ':' + s
        },
        // 动态获取当前时间
        getCurTime() {
            this.currentTime = parseInt(this.$refs.audio.currentTime)
            this.toTime(this.currentTime)
        },
        // 通过input 控制 时长
        changeLong(e) {
            this.rangValue = e.target.value
            this.$refs.audio.currentTime = this.rangValue
        },
        // 调节当前音量
        changeVolum(e) {
            this.volume = e.target.value
            this.$refs.audio.volume = this.volume / 100
        },
        showLock() {
            this.isLock = !this.isLock;
            if (this.isLock) {
                this.$refs.playControl.style.bottom = '0px'
            } else {
                this.$refs.playControl.style.bottom = '-70px'
            }
        },
        // 向播放列表中添加歌曲
        addSong(item) {
            /*   this.rid = sid;
              let res = this.musicList.find((item) => {
                  return item.rid == sid
  
              })
              console.log(res);
              console.log(this.playList); */

            /*    Array.prototype.unshiftNoRepeat = function () {
                   for (var i = 0; i < arguments.length; i++) {
                       var ele = arguments[i];
                       if 0(this.indexOf(ele) == -1) {
                           this.unshift(ele);
                       }
                   }
               }; */
            console.log(item);
            console.log(this.playList);
            if (this.playList.indexOf(item) === -1)
                this.playList.unshift(item);

            console.log(this.playList);
        }
    },


})
const vm = app.mount("#app")



