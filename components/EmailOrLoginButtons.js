import React from "react";
import styles from "../styles/EmailOrLoginButtons.module.css";
import { FaFacebook, FaTwitter, FaApple, FaGoogle } from "react-icons/fa";
import { BsApple } from "react-icons/bs";

import { useUser } from "@auth0/nextjs-auth0";

const EmailOrLoginButtons = ({setEmail, ValidateEmail, email}) => {
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={(e) => ValidateEmail(e.target.value)}
          />
          <span>Or</span>
          <div>
            <a
              className={styles.loginButton}
              href={`http://${
                process.env.NEXT_PUBLIC_HTTP_LOCAL_WEB || "skyscannerplus.com"
              }/api/auth/login`}
            >
              <>
                <FaGoogle />
                <FaFacebook />
                <FaTwitter />
                <BsApple />
              </>
              <>{` Login with`}</>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailOrLoginButtons;
