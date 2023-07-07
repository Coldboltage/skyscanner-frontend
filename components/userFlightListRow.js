import React from "react";
import * as styles from "../styles/CheapestFlightsItem.module.css";
import dayjs from "dayjs"
// import Link from "next/link"

const UserFlightListRow = ({ element }) => {
  console.log(element)
  const localURL = process.env.NEXT_PUBLIC_LOCALHOST_DEV;
  return (
    
    <tr id="row-1">
      
      <td className={styles.individualPara}>
        <a
          href={`${localURL || ""}/ref?ref=${element.ref}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {element.ref}
        </a>
      </td>
      <td>
        {element.flights.departure}
      </td>
      <td>
        {element.flights.arrival}
      </td>
      <td>
        {dayjs(element.dates.departureDate).format('DD/MM/YYYY')}
      </td>
      <td>
        {dayjs(element.dates.returnDate).format('DD/MM/YYYY')}
      </td>
      <td>
        {element.cheapest}
      </td>
    </tr>
  );
};

export default UserFlightListRow;
