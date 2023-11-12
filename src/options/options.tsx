import React from 'react';
import ReactDOM from 'react-dom/client';
import './options.css';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
} from '@mui/material';

const App: React.FC<{}> = () => {
  return (
    <Box mx='10%' my='2%'>
      <Card>
        <CardContent>
          <Grid container direction='column'>
            <Grid item>
              <Typography variant='h4'>Weather Extension Options</Typography>
            </Grid>
            <Grid item>
              <Typography variant='body1'>Home city name</Typography>
              <TextField fullWidth placeholder='Enter a home city name' />
            </Grid>
            <Grid item>
              <Typography variant='body1'>Home city name</Typography>
              <TextField fullWidth placeholder='Enter a home city name' />
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
