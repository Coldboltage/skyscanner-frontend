import React from "react";
import * as styles from "../styles/CheapestFlightsItem.module.css";
// import Link from "next/link"

const ReferenceItem = ({ reference }) => {
  console.log(reference.ref)
  const localURL = process.env.NEXT_PUBLIC_HTTP_LOCAL_WEB
  return (
    <div className={styles.inputForm}>
      <div className={styles.individualPara}>
        <a href={`http://${localURL||""}/ref?ref=${reference.ref}`} >{reference.ref}</a>
      </div>
    </div>
  );
};

export default ReferenceItem;
