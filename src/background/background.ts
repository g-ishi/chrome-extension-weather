import { fetchOpenWeatherData } from '../utils/api';
import {
  getStoredCities,
  getStoredOptions,
  setStoredCities,
  setStoredOptions,
} from '../utils/storage';

chrome.runtime.onInstalled.addListener(() => {
  // local storageの初期化(初期値の設定)
  setStoredCities([]);
  setStoredOptions({
    hasAutoOverlay: false,
    homeCity: '',
    tempScale: 'metric',
  });

  // contextMenusの設定
  chrome.contextMenus.create({
    contexts: ['selection'],
    title: 'Add city to weather extension',
    id: 'weatherExtension',
  });

  chrome.alarms.create({
    periodInMinutes: 1 / 6,
  });
});

// contextMenusの設定はインストール時に行うが、Listenerの設定はページロード時に行う
// service workerが起動するたびに設定する必要があるため
chrome.contextMenus.onClicked.addListener((event) => {
  getStoredCities().then((cities) => {
    setStoredCities([...cities, event.selectionText]);
  });
});

chrome.alarms.onAlarm.addListener(() => {
  getStoredOptions().then((options) => {
    if (options.homeCity === '') {
      return;
    }
    fetchOpenWeatherData(options.homeCity, options.tempScale).then((data) => {
      const temp = Math.round(data.main.temp);
      const symbol = options.tempScale === 'metric' ? '\u2103' : '\u2109';
      chrome.action.setBadgeText({
        text: `${temp}${symbol}`,
      });
    });
  });
});
