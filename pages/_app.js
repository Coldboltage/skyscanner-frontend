import "../styles/globals.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FpjsProvider } from "@fingerprintjs/fingerprintjs-pro-react";
import { UserProvider } from "@auth0/nextjs-auth0";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <UserProvider>
        <FpjsProvider
          loadOptions={{
            apiKey: "zJ53glDHCt2SApDfUYCc",
            region: "eu",
            endpoint: "https://fp.skyscannerplus.com",
          }}
        >
          {" "}
          <Component {...pageProps} />
          <ToastContainer />
        </FpjsProvider>
      </UserProvider>
    </>
  );
}

export default MyApp;
