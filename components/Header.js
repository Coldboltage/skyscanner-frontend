import styles from "../styles/Header.module.css";
import Link from "next/link";

// NavigationLinksComponents
import mainNavigationLinks from "../constant/mainNavigationLinks";
import HeaderNavigationLinksGenerator from "./HeaderNavigationLinks";
import { FaGithub } from 'react-icons/fa';


const Header = () => {
  return (
    <div className={styles.navContainer}>
      <nav className={styles.nav}>
        <div className={styles.leftSide}>
          <Link href="/">Skyscanner Plus</Link>
        </div>
        <div className={styles.rightSide}>
          {mainNavigationLinks.map((element,index) => {
            return (
              <HeaderNavigationLinksGenerator key={index} linkInfo={element}/>
            )
          })}
          <div className={styles.navLink}>
            <a href="https://github.com/Coldboltage"><FaGithub/></a>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
