import React from "react";
import * as styles from "../styles/CheapestFlightsItem.module.css";
// import Link from "next/link"

const ReferenceItem = ({ reference }) => {
  const localURL = process.env.NEXT_PUBLIC_LOCALHOST_DEV
  return (
    <div className={styles.inputForm}>
      <div className={styles.individualPara}>
        <a href={`${localURL||""}/ref?ref=${reference}`} target="_blank" rel="noopener noreferrer">{reference}</a>
      </div>
    </div>
  );
};

export default ReferenceItem;
