import styles from "../styles/Footer.module.css";
import Link from "next/link";

// NavigationLinksComponents
import mainNavigationLinks from "../constant/footerLink";
import HeaderNavigationLinksGenerator from "./HeaderNavigationLinks";

const Footer = () => {
  return (
    <div className={styles.navContainer}>
      <nav className={styles.nav}>
        <div className={styles.leftSide}>
        </div>
        <div className={styles.rightSide}>
          {mainNavigationLinks.map((element,index) => {
            return (
              <HeaderNavigationLinksGenerator key={index} linkInfo={element}/>
            )
          })}

        </div>
      </nav>
    </div>
  );
};

export default Footer;
