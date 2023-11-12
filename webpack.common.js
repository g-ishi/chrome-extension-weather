// webpack.config.jsファイルはnodejsで記述する
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
// webpack での`development`と`production`での生成物は両方読み込まれるとサイズが大きくなってしまうので、`webpack-clean-plugin`で生成前に`dist`ディレクトリを綺麗にする。
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  // modeによって動作が変わる。
  // webpack.prod.js or webpack.dev.jsで上書きする
  // mode: 'development',

  // これがない状態でdevelopmentでビルドするとエラーになるので、以下を入れる
  // デバック用にビルド結果と元のファイルとの対応関係を生成するオプション
  // webpack.prod.js or webpack.dev.jsで上書きする
  // devtool: 'cheap-module-source-map',

  // バンドルを始めて依存関係を見ていくときの最初のファイル
  entry: {
    popup: path.resolve('src/popup/popup.tsx'),
    options: path.resolve('src/options/options.tsx'),
    background: path.resolve('src/background/background.ts'),
    contentScript: path.resolve('src/contentScript/contentScript.tsx'),
  },
  // バンドルするときの追加ルールを定義する
  module: {
    rules: [
      // tsxファイルはts-loaderを利用する
      // ts-loaderはnpmでインストールしておく必要がある
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      // cssファイルはstyle-loaderとcss-loaderで処理する必要がある
      // バンドルされたcssは独立したファイルではなく、[name].jsファイル内のstyleタグに組み込まれる
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      // アセットファイルを読み込む設定
      // ソースコード上で画像をimportして使っている場合とかに必要になるっぽい
      {
        type: 'asset/resources',
        test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf)$/,
        generator: {
          filename: '[name].[ext]',
        },
      },
    ],
  },
  // moduleで処理されなかったファイルはpluginsで処理される
  plugins: [
    new CleanWebpackPlugin({
      // modeが切り替わった時のみディレクトリを綺麗にする
      cleanStaleWebpackAssets: false,
    }),
    new CopyPlugin({
      patterns: [
        // manifest.jsonファイルはそのままdistにコピーする
        {
          from: path.resolve('src/manifest.json'),
          to: path.resolve('dist'),
        },
        // staticに配置したアイコンファイル等もコピーする
        {
          from: path.resolve('src/static'),
          to: path.resolve('dist'),
        },
      ],
    }),
    // popup.htmlファイルを生成して、popup chunkをscriptタグとして挿入する。
    // chunkはoutputのfilenameを指定している。今回は作成されたpopup.jsファイルを使用している
    new HtmlPlugin({
      title: 'Boilerplate Extension',
      filename: 'popup.html',
      chunks: ['popup'],
    }),
    // popupと同様の手順でoptions.htmlファイルを生成して、options chunkをscriptタグとして��入する。
    // getHtmlPlugins関数のように関数化して外出しするのも可能
    new HtmlPlugin({
      title: 'Boilerplate Extension',
      filename: 'options.html',
      chunks: ['options'],
    }),
    // .envを使うためのプラグイン
    new Dotenv(),
    // TODO: 以下の形でdevとproductionで環境変数ファイルを変えられるようにしたい。
    // new Dotenv({
    //   path: './some.other.env', // .envファイルのパスを指定
    // }),
  ],
  resolve: {
    // モジュールをimportするときに解決する拡張子
    // これにより、拡張子を含まないファイルをimportするときに、Webpackは上記の拡張子を持つファイルを順に検索します。
    extensions: ['.tsx', '.ts', '.js'],
  },
  // buildしたファイルの出力先
  output: {
    // [name] は、entryで定義したキーの名前をファイル名に使用するwebpackの記法
    // 今回はpopup.jsファイルが作成される。
    filename: '[name].js',
    // distへの絶対パスを指定
    path: path.resolve('dist'),
  },

  optimization: {
    // chunk間でモジュールの共有を行う。
    // 今回で言うとreactモジュールはpopupとoptionsで共通して使っているので、chunk間でのモジュール共有を有効にするとdistのファイルサイズ節約になる
    // 共有されるファイルは「vendors-node_**」の名前で共有モジュールとしてバンドルされる
    splitChunks: {
      // すべてのentryでchunkの共有を行う
      // chunks: 'all',

      // contentScript以外でchunk共有を行う
      chunks(chunk) {
        return chunk.name !== 'contentScript';
      },
    },
  },
};

// webpack.config.jsはnodejsとして記述されるので、関数定義なども可能
function getHtmlPlugins(chunks) {
  return chunks.map((chunk) => {
    return new HtmlPlugin({
      title: 'Boilerplate Extension',
      filename: `${chunk}.html`,
      chunks: [chunk],
    });
  });
}
