import React from "react";
import * as styles from "../styles/CheapestFlightsItem.module.css";
// import Link from "next/link"

const UserFlightList = ({ element }) => {
  const localURL = process.env.NEXT_PUBLIC_LOCALHOST_DEV
  return (
    <div className={styles.inputForm}>
      <div className={styles.individualPara}>
        <a href={`${localURL||""}/ref?ref=${element.ref}`} target="_blank" rel="noopener noreferrer">{element.ref}</a>

      </div>
    </div>
  );
};

export default UserFlightList;
