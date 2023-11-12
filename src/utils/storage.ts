import { OpenweatherTempScale } from './api';

export type LocalStorage = {
  cities?: string[];
  options?: LocalStorageOptions;
};

export type LocalStorageOptions = {
  tempScale: OpenweatherTempScale;
};

export type LocalStorageKeys = keyof LocalStorage;

/**
 * citiesのgetter/setter
 */
export function setStoredCities(cities: string[]): Promise<void> {
  // 事前に変数に代入して、適切な型をつけることでtypescriptの恩恵を受けられる
  const values: LocalStorage = {
    cities,
  };

  return new Promise<void>((resolve, reject) => {
    // local storageへのsetが完了したらresolve
    chrome.storage.local.set(values, () => resolve());
  });
}

export function getStoredCities(): Promise<string[]> {
  const keys: LocalStorageKeys[] = ['cities'];
  // TODO: chromeAPIを使用する際はPermissonを忘れずに！
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(keys, (res: LocalStorage) => {
      console.log(res.cities);
      // local storageがundefinedの場合を常に意識してコーディングするのは大変なので、
      // backgroundスクリプトを使ってlocal storageに初期値を設定するのがよいプラクティスとされている。
      resolve(res.cities ?? []);
      // resolve(res.cities);
    });
  });
}

/**
 * optionsのgetter/setter
 */
export function setStoredOptions(options: LocalStorageOptions): Promise<void> {
  const values: LocalStorage = {
    options,
  };

  return new Promise((resolve, reject) => {
    chrome.storage.local.set(values, () => {
      resolve();
    });
  });
}

export function getStoredOptions(): Promise<LocalStorageOptions> {
  const keys: LocalStorageKeys[] = ['options'];

  return new Promise((resolve, reject) => {
    chrome.storage.local.get(keys, (res: LocalStorage) => {
      console.log(res.options);
      resolve(res.options);
    });
  });
}
