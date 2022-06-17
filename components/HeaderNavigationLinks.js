import React from 'react'
import Link from "next/link"
import * as styles from "../styles/Header.module.css"

const HeaderNavigationLinks = ({linkInfo}) => {
  return (
    <div className={styles.navLink}>
      <Link href={linkInfo.link}>{linkInfo.name}</Link>
    </div>
  )
}

export default HeaderNavigationLinks