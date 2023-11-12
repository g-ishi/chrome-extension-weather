import { setStoredCities, setStoredOptions } from '../utils/storage';

chrome.runtime.onInstalled.addListener(() => {
  // local storageの初期化(初期値の設定)
  setStoredCities([]);
  setStoredOptions({
    tempScale: 'metric',
  });
});
