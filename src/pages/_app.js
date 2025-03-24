import "../styles/globals.css";
import UserProvider from "../contexts/AccountContext";

export default function App({ Component, pageProps: { ...pageProps } }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}
