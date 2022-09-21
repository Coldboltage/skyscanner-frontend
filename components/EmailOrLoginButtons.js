import React from "react";
import styles from "../styles/EmailOrLoginButtons.module.css";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaTwitter, FaApple } from "react-icons/fa";
import { useUser } from "@auth0/nextjs-auth0";

const EmailOrLoginButtons = () => {
  const { user, error, isLoading } = useUser();
  return (
    <div className={styles.emailOrLoginDiv}>
      <div className={styles.titleDiv}>
        <p className={styles.title}>Please use the following</p>
      </div>
      <div className={styles.mainContainer}>
        <div className={styles.innerContainer}>
          <input
            style={{ marginBottom: "0px", textAlign: "center" }}
            type="email"
            placeholder="Email Address"
          />
          <span>Or</span>
          <div>
            <a
              className={styles.loginButton}
              href={`http://${
                process.env.NEXT_PUBLIC_LOCALHOST || "skyscannerplus.com"
              }/api/auth/login`}
            >
              <>
                <FcGoogle />
                <FaFacebook />
                <FaTwitter />
                <FaApple />
              </>
              <>{` Login with `}</>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailOrLoginButtons;
