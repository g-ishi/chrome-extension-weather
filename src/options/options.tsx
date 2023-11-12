import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './options.css';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
} from '@mui/material';
import {
  setStoredOptions,
  getStoredOptions,
  type LocalStorageOptions,
} from '../utils/storage';

type FormState = 'ready' | 'saving';

const App: React.FC<{}> = () => {
  const [options, setOptions] = useState<LocalStorageOptions | null>(null);
  const [formState, setFormState] = useState<FormState>('ready');

  // local storageに設定されているoptionsをstateに読み込む
  useEffect(() => {
    getStoredOptions().then((options) => {
      setOptions(options);
    });
  }, []);

  const handleHomeCityChange = (homeCity: string) => {
    console.log('homeCity: ', homeCity);
    setOptions({
      ...options,
      homeCity,
    });
  };

  const handleSaveButtonClick = () => {
    setFormState('saving');
    setStoredOptions(options).then(() => {
      // local storageに保存が環境する時間が短すぎで、ユーザに保存したことが伝わりづらいので、
      // 保存後にいくらかのfractionを設定する
      setTimeout(() => {
        setFormState('ready');
      }, 1000);
    });
  };

  // この後の処理で、optionsを使うのでlocal storageからの読み出しが完了するのをまつ。
  // local storageからの読み出しは、非常に短い時間(ユーザが気が付かないくらいの時間)で完了するのでローディングアイコンとかはださなくても大丈夫。
  if (!options) {
    return null;
  }

  // 既存のstateから計算できるものは計算して出すようにする。(無闇にstateを増やさない。)
  const isFieldsDisabled = formState === 'saving';

  return (
    <Box mx='10%' my='2%'>
      <Card>
        <CardContent>
          <Grid container direction='column' spacing={4}>
            <Grid item>
              <Typography variant='h4'>Weather Extension Options</Typography>
            </Grid>
            <Grid item>
              <Typography variant='body1'>Home city name</Typography>
              <TextField
                fullWidth
                placeholder='Enter a home city name'
                onChange={(event) => {
                  handleHomeCityChange(event.target.value);
                }}
                disabled={isFieldsDisabled}
              />
            </Grid>
            <Grid item>
              <Button
                variant='contained'
                color='primary'
                onClick={handleSaveButtonClick}
                disabled={isFieldsDisabled}
              >
                {formState === 'ready' ? 'Save' : 'Saving...'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

// React 18の新しいルートAPIを使用します。
// reactをマウントする要素は自分で作成しないとwarningが出る。
const container = document.createElement('div');
document.body.appendChild(container);
const root = ReactDOM.createRoot(container);

// ルートに対してコンポーネントをレンダーします。
root.render(<App />);
