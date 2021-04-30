import '../styles/global.scss';

import { Header } from '../components/Header';
import { Player } from '../components/Player';

import { PlayerContextProvider } from '../contexts/PLayerContext';

import styles from '../styles/app.module.scss';

function App({ Component, pageProps }) {
  return (
    <PlayerContextProvider>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>

        <Player />
      </div>
    </PlayerContextProvider>
  );
}

export default App;
