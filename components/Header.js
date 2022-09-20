import { useEffect, useState } from "react";
import styles from "../styles/Header.module.css";
import Link from "next/link";

// NavigationLinksComponents
import mainNavigationLinks from "../constant/mainNavigationLinks";
import HeaderNavigationLinksGenerator from "./HeaderNavigationLinks";
import { FaGithub } from "react-icons/fa";
import { useUser } from "@auth0/nextjs-auth0";

const Header = () => {
  const [isLoadingOn, setIsLoadingOn] = useState(false);
  const { user, error, isLoading } = useUser();

  useEffect(() => {
    isLoadingOn === false && setIsLoadingOn(false);
    console.log(user);
    console.log(`State of isLoading: ${isLoading}`);
    console.log(`Checking env ${process.env.NEXT_PUBLIC_LOCALHOST}`)
  }, [isLoading]);


  return (
    <div className={styles.navContainer}>
      <nav className={styles.nav}>
        <div className={styles.leftSide}>
          <Link href="/">Skyscanner Plus</Link>
        </div>
        <div className={styles.rightSide}>
          {mainNavigationLinks.map((element, index) => {
            return (
              <HeaderNavigationLinksGenerator key={index} linkInfo={element} />
            );
          })}
          <div className={styles.navLink}>
            <a href="https://github.com/Coldboltage">
              <FaGithub />
            </a>
          </div>
          {!user ? (
            <div className={styles.navLink}>
              <a
                href={`http://${
                  process.env.NEXT_PUBLIC_LOCALHOST || "skyscannerplus.com"
                }/api/auth/login`}
              >
                Login
              </a>
            </div>
          ) : (
            <div className={styles.navLink}>
              <a
                href={`http://${
                  process.env.NEXT_PUBLIC_LOCALHOST || "skyscannerplus.com"
                }/api/auth/logout`}
              >
                Logout
              </a>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Header;

export async function getServerSideProps(context) {
  const { user, error, isLoading } = useUser();
  console.log(`What is user: ${user}`);
  return {
    props: { user, isLoading }, // will be passed to the page component as props
  };
}
