import "../styles/globals.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FpjsProvider } from "@fingerprintjs/fingerprintjs-pro-react";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <FpjsProvider
        loadOptions={{
          apiKey: "zJ53glDHCt2SApDfUYCc",
          region: "eu",
          endpoint: 'https://fp.skyscannerplus.com'
        }}
      >
        {" "}
        <Component {...pageProps} />
        <ToastContainer />
      </FpjsProvider>
    </>
  );
}

export default MyApp;
