import React from "react";
import * as styles from "../styles/CheapestFlightsItem.module.css";
import Link from "next/link"

const ReferenceItem = ({ reference }) => {
  return (
    <div className={styles.inputForm}>
      <div className={styles.individualPara}>
        <Link href={`${process.env.NEXT_PUBLIC_LOCALHOST||"https://skyscannerplusweb.herokuapp.com"}/ref?ref=${reference} `}>{reference}</Link>
      </div>
    </div>
  );
};

export default ReferenceItem;
