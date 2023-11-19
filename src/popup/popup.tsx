import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Box, InputBase, IconButton, Paper, Grid } from '@mui/material';
import { Add, Message, PictureInPicture } from '@mui/icons-material';
import './popup.css';
import WeatherCard from '../components/WeatherCard/component';
import {
  setStoredCities,
  getStoredCities,
  setStoredOptions,
  getStoredOptions,
  type LocalStorageOptions,
} from '../utils/storage';
import { Messages } from '../utils/messages';

// TODO: templateの方に反映する
const App: React.FC = () => {
  const [cities, setCities] = useState<string[]>([]);
  const [options, setOptions] = useState<LocalStorageOptions | null>(null);
  const [cityInput, setCityInput] = useState<string>('');

  // 初期描画時にのみlocal storageを確認して、stateにセットする
  useEffect(() => {
    getStoredCities().then((cities) => setCities([...cities]));
    getStoredOptions().then((options) => setOptions(options));
  }, []);

  const handleCityButtonClick = () => {
    if (cityInput === '') {
      return;
    }

    // ここの処理順はlocal storageとstateでは、local storageの方を先に更新した方がいい気がする
    const updatedCities = [...cities, cityInput];
    setStoredCities(updatedCities).then(() => {
      setCities(updatedCities);
      setCityInput('');
    });

    setCityInput('');
  };

  const handleCityDeleteButtonClick = (index: number) => {
    cities.splice(index, 1);

    setStoredCities(cities).then(() => {
      setCities([...cities]);
    });
  };

  const handleTempScaleButtonClick = () => {
    const updateOptions: LocalStorageOptions = {
      ...options,
      tempScale: options.tempScale === 'metric' ? 'imperial' : 'metric',
    };
    setStoredOptions(updateOptions).then(() => {
      setOptions(updateOptions);
    });
  };

  const handleOverlayButtonClick = () => {
    // activeなタブを探して、そのタブに対してメッセージを送る。
    chrome.tabs.query(
      {
        active: true,
        // 複数のwindowを開いている場合があるので、このプロパティで現在のwindowを指定する
        currentWindow: true,
      },
      (tabs) => {
        if (tabs.length > 0) {
          chrome.tabs.sendMessage(tabs[0].id, Messages.TOGGLE_OVERLAY);
        }
      }
    );
  };

  // この後の処理で、optionsを使うのでlocal storageからの読み出しが完了するのをまつ。
  // local storageからの読み出しは、非常に短い時間(ユーザが気が付かないくらいの時間)で完了するのでローディングアイコンとかはださなくても大丈夫。
  if (!options) {
    return null;
  }

  return (
    <>
      <Box mx='8px' my='16px'>
        <Grid container justifyContent={'space-evenly'} alignItems={'center'}>
          <Grid item>
            <Paper>
              <Box px='15px' py='5px'>
                <InputBase
                  placeholder='Add a city name'
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                />
                <IconButton
                  onClick={() => {
                    handleCityButtonClick();
                  }}
                >
                  <Add />
                </IconButton>
              </Box>
            </Paper>
          </Grid>
          <Grid item>
            <Paper>
              <Box>
                <IconButton onClick={handleTempScaleButtonClick}>
                  {/* 天気の単位はユニコードで定義されてるので、アイコン画像とかを使う必要はない */}
                  {options.tempScale === 'metric' ? '\u2103' : '\u2109'}
                </IconButton>
              </Box>
            </Paper>
          </Grid>

          <Grid item>
            <Paper>
              <Box>
                <IconButton onClick={handleOverlayButtonClick}>
                  <PictureInPicture />
                </IconButton>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      {options.homeCity !== '' && (
        <WeatherCard city={options.homeCity} tempScale={options.tempScale} />
      )}
      {cities.map((city, index) => {
        return (
          <WeatherCard
            city={city}
            tempScale={options.tempScale}
            key={index}
            // 関数に引数を渡した状態のハンドラーを渡したい場合は関数でラップする
            // Closerの形
            onDelete={() => {
              handleCityDeleteButtonClick(index);
            }}
          />
        );
      })}
      <Box height={'16px'} />
    </>
  );
};

// React 18の新しいルートAPIを使用します。
// reactをマウントする要素は自分で作成しないとwarningが出る。
const container = document.createElement('div');
document.body.appendChild(container);
const root = ReactDOM.createRoot(container);

// ルートに対してコンポーネントをレンダーします。
root.render(<App />);
