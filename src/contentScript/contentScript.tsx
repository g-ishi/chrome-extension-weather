import React from 'react';
import ReactDOM from 'react-dom/client';
import { Card } from '@mui/material';
import './contentScript.css';
import WeatherCard from '../components/WeatherCard/component';

/**
 * 画面の右側にスペースを作ってそこに要素を挿入
 */
// 既存のコンテンツを包含するコンテナを作成
// const container = document.createElement('div');
// container.style.display = 'flex';

// // 既存のページコンテンツをコンテナに移動
// while (document.body.firstChild) {
//   container.appendChild(document.body.firstChild);
// }

// const newElement = document.createElement('div');
// newElement.style.flexBasis = '20%'; // 20%の幅を占める
// newElement.style.height = '100vh'; // 画面の高さに合わせる
// newElement.style.background = '#f0f0f0'; // 任意の背景色
// newElement.textContent = 'ここに新しいコンテンツ'; // コンテンツを追加

// // コンテナに既存のコンテンツと新しい要素を追加
// document.body.appendChild(container);
// container.appendChild(newElement);

// const root = ReactDOM.createRoot(newElement);
// const App: React.FC<{}> = () => {
//   return (
//     <Card className='overlayCard'>
//       <WeatherCard city='Toronto' tempScale='metric' />
//     </Card>
//   );
// };
// root.render(<App />);

const App: React.FC<{}> = () => {
  return (
    <Card className='overlayCard'>
      <WeatherCard city='Toronto' tempScale='metric' />
    </Card>
  );
};

const container = document.createElement('div');
document.body.appendChild(container);
const root = ReactDOM.createRoot(container);

root.render(<App />);
