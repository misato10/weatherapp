

if ('serviceWorker' in navigator) {
	// ServiceWorkerを登録
	navigator.serviceWorker.register('/service-worker.js', {
		scope: '/',
	}).then(function(registration) {
		// 登録成功時
    console.log('ServiceWorker登録成功です');
    //alert('ServiceWorker登録成功です');

		if ('onbeforeinstallprompt' in window) {
			// Web App Banner対応
      console.log('Web App Banner に対応しています');
     // alert('Web App Banner に対応しています');
      window.addEventListener('beforeinstallprompt', (event) => {
        // log the platforms provided as options in an install prompt 
        console.log(event.platforms); // e.g., ["web", "android", "windows"] 
        installPromptEvent = event;
        alert('動くよ');
      });
      installPromptEvent.prompt();
		} else {
			// Web App Banner未対応
      console.log('Web App Banner 未対応');
      //alert('Web App Banner 未対応');
		}
	}).catch(function(error) {
		// 登録失敗時
    console.log('ServiceWorker登録失敗です');
    //alert('ServiceWorker登録失敗です');
		//console.log(error);
	});
} else {
  console.log('ServiceWorker 未対応です');
  //alert('ServiceWorker 未対応です');
}

Vue.filter('integerFilter', function (value) {
  // 処理された値を返す
  return value = Math.floor(value)
})

Vue.filter('tempchangeFilter', function (value) {
  // 処理された値を返す
  return value = (value * 9 / 5) +32
})

Vue.filter('tempFilter', function (value) {
  // 処理された値を返す
  return value = value
})

Vue.filter('timeFilter', function (value) {
  // 処理された値を返す
  value = (value.slice(11, 13)* 1)+9;
  if(23<value){
    return value = value -24
  } else {
    return value

  }
})

Vue.component('every-item', {
  props: ['every','url','file','cels'],
  template: '<li><span class="time">{{ every.dt_txt | timeFilter }}時</span><img v-bind:src="`${url}${every.weather[0].icon}${file}`"  alt=""><span class="temp"><span v-if="cels">{{ every.main.temp | tempFilter  | integerFilter }}</span><span v-else>{{ every.main.temp | tempFilter | tempchangeFilter | integerFilter }}</span>°</span></li>',
})

let api01 = 'https://api.openweathermap.org/data/2.5/weather?&lang=ja&units=metric',
    api02 = 'https://api.openweathermap.org/data/2.5/forecast?&lang=ja&units=metric',
    id = '&appid=1f124fc9e5784daca45445daad4bfbc3',
    initialCity = 'Tokyo,jp';

let WeatherApp = new Vue({
  el: '#weatherApp',
  data: {
    todayWhether: null,
    everyWhether: null,
    city: '',  // 都市名
    todayImage: '',  // 天気用アイコン(今日)
    todayDes: '',  // 天気説明文(今日)
    todayTemp: '',  // 気温(今)
    maxTemp: '',  // 最高気温(今日)
    minTemp: '',  // 最低気温(今日)
    todayWeekStr: '',  // 曜日(今日),
    celsius:true,  // 温度表記の切替 
    every3Hour : null,
    imageUrl: 'https://openweathermap.org/img/wn/',
    imageFile: '@2x.png',
    hasError: false,
    loading: true,
    search: false,
    keyword: '',
    errTxt: '天気の取得に失敗しました。'
  },
  methods: {
    // 曜日取得
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    getDate (){
      var date = new Date ();
      var dayOfWeek = date.getDay() ;	// 曜日(数値)
      this.todayWeekStr = [ "日", "月", "火", "水", "木", "金", "土" ][dayOfWeek]; 
    },

    // 天気取得処理
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    getWeather(getPos, txt) {   

    // 現在の天気のデータをＡＰＩから取得
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      axios.get(api01 + getPos + id).then(function(response) {
        console.log(response.data)
        
          // APIからの情報をもとにdataに格納していく
          // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          this.todayWhether = response.data
          this.city = response.data.name
          this.todayImage = this.imageUrl + response.data.weather[0].icon + this.imageFile
          this.todayDes = response.data.weather[0].description
          this.todayTemp = response.data.main.temp
          this.maxTemp = response.data.main.temp_max
          this.minTemp = response.data.main.temp_min

      }.bind(this))
      
      // ３時間ごとの天気のデータをＡＰＩから取得
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      axios.get(api02 + getPos + id).then(function(response) {
          console.log(response.data)
          this.everyWhether = response.data
          this.every3Hour = response.data.list

      }.bind(this))

      .catch(function(error) { //通信エラーのキャッチを行う処理
        console.log('エラーです')
        this.hasError = true
        this.loading = false
        this.errTxt = txt
      }.bind(this))

     .finally(function() {　 //.finally は通信に関するすべての処理が終わった時に実行される
        this.loading = false　 // loding の真偽値を false にする
     }.bind(this)) //プロパティ loding に変更した値を返す


    },


    // 初期表示処理（東京）
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    firstWeather() {
      this.loading = true
      this.hasError = false
      this.getWeather('&q='+ initialCity, '天気の取得に失敗しました。')
      this.getDate ()
      
    },

    // 現在位置取得処理
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    geolocation() {
      navigator.geolocation.getCurrentPosition(this.buildUrl, this.geoError)
    },
    buildUrl(position) {
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;
      //
      this.getWeather('&lat=' + lat + '&lon=' + lon, '現在位置から天気の取得に失敗しました。')
    },
    geoError(error) {
      //this.getWeather('&lat=0&lon=0', '現在位置から天気の取得に失敗しました。')
      this.hasError = true
      this.loading = false
      this.errTxt = '現在位置から天気の取得に失敗しました。'
    },

    // 現在位置取得ボタンを押したときの処理
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    getlocal() {
      this.resetData()
      this.geolocation()
    },

    // 検索イベント
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    searchWeather() {
      this.hasError = false
      this.resetData()
      this.getWeather('&q=' + this.keyword, '検索結果は見つかりません。')
      this.search = false
      this.keyword = ''
    },

    // dataリセット処理
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    resetData() {
      this.loading = true
      this.todayWhether = null
      this.everyWhether = null
      this.city = ''
      this.todayImage = ''
      this.todayDes = ''
      this.todayTemp = ''
      this.maxTemp = ''
      this.minTemp = ''
      this.every3Hour = ''
    },
  },

  // 読み込み時表示
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  beforeMount() {
    this.firstWeather()
  },

})