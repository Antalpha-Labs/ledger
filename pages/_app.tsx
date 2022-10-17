import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import store from '../store';
import '../styles/globals.css'

const NEXT_PUBLIC_ALCHEMY = process.env.NEXT_PUBLIC_ALCHEMY as string;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <div className="container mx-auto">
        <Component {...pageProps} />
      </div>
    </Provider>
  )
}

export default MyApp
