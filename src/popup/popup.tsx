import React from 'react';
import ReactDOM from 'react-dom/client';
import './popup.css';

const test = <img src='icon.png' />;

// React 18の新しいルートAPIを使用します。
// reactをマウントする要素は自分で作成しないとwarningが出る。
const container = document.createElement('div');
document.body.appendChild(container);
const root = ReactDOM.createRoot(container);

// ↓これはダメな例
// const root = ReactDOM.createRoot(document.body);

// ルートに対してコンポーネントをレンダーします。
root.render(test);
