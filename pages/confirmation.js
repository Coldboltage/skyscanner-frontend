import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Confirmation.module.css";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as dayjs from "dayjs";
import { useRouter } from "next/router";

// Component List
import Layout from "../components/Layout";
import ReferenceItem from "../components/ReferenceList";
import CheapestFlightsItem from "../components/CheapestFlightsItem";

export default function Ref() {
  // Console.log test
  console.log(`env ${process.env.NEXT_PUBLIC_LOCALHOST}`);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [ref, setRef] = useState("");
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [minimalHoliday, setMinimalHolday] = useState("");
  const [maximumHoliday, setMaximumHoliday] = useState("");
  const [requiredDateStart, setRequiredDateStart] = useState();
  const [requiredDateEnd, setRequiredDateEnd] = useState();

  // State specifically for /email
  const [typedState, setTypedState] = useState("");
  const [result, setResult] = useState([]);

  const Router = useRouter();

  //  Getting information from Router via index page
  useEffect(() => {
    setName(Router.query.name);
    setRef(Router.query.ref);
    setEmail(Router.query.email);
    setDeparture(Router.query.departure);
    setArrival(Router.query.arrival);
    setDepartureDate(Router.query.departureDate);
    setReturnDate(Router.query.returnDate);
    setMinimalHolday(Router.query.minimalHoliday);
    setMaximumHoliday(Router.query.maximumHoliday);

    name,
      ref,
      email,
      departure,
      arrival,
      departureDate,
      returnDate,
      minimalHoliday,
      maximumHoliday;
  }, [Router.query]);

  // useEffect(() => {
  //   airportTextCheck(departure)
  // }, departure)

  // State for managed dates

  const getEmail = async (email) => {
    console.log(
      `I'm making a call to /get-references-by-email with the email: ${email}`
    );
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_LOCALHOST ||
          "https://skyscannerplusweb.herokuapp.com"
        }/api/flights/get-references-by-email/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          cors: "no-cors",
          body: JSON.stringify({ email: email }),
        }
      );
      console.log("Sent");
      console.log(response);
      if (response.ok === true) {
        toast.success("Email found on database!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        const data = await response.json();
        // Destructure Result
        const { result, message } = data;
        setResult(result);
      } else {
        console.log("Nothing was found");
        toast.error("That email address was not found", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>Thank You for adding a flight</title>
          <meta name="Thank you page for when users create a flight for Skyscsanner Plus" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className={styles.titleDiv}>
          <h1 className={styles.title}>
            Your flight has been added:{" "}
            <span className={styles.flight}>{ref}</span>{" "}
          </h1>
        </div>
        <main className={styles.main}>
          <div>
            <div className={styles.referenceInput}>
              <h4>Details of the flight</h4>
              {/* <div className={styles.individualPara}>
                <span className={styles.titleItem}>Name</span>:{` `}
                {name}
              </div> */}
              <div className={styles.individualPara}>
                <span className={styles.titleItem}>Reference</span>:{` `}
                {ref}
              </div>
              {email && (
                <div className={styles.individualPara}>
                  <span className={styles.titleItem}>Email</span>:{` `}
                  {email}
                </div>
              )}

              <div className={styles.individualPara}>
                <span className={styles.titleItem}>Departure</span>:{` `}
                {departure}
              </div>
              <div className={styles.individualPara}>
                <span className={styles.titleItem}>Arrival</span>:{` `}
                {arrival}
              </div>
              <div className={styles.individualPara}>
                <span className={styles.titleItem}>
                  Earliest Departure Date
                </span>
                :{` `}
                {departureDate}
              </div>
              <div className={styles.individualPara}>
                <span className={styles.titleItem}>Latest Return Date</span>:
                {` `}
                {returnDate}
              </div>
              <div className={styles.individualPara}>
                <span className={styles.titleItem}>
                  Minimal Holiday Duration
                </span>
                :{` `}
                {minimalHoliday}
              </div>
              <div className={styles.individualPara}>
                <span className={styles.titleItem}>
                  Maximum Holiday Duration
                </span>
                :{` `}
                {maximumHoliday}
              </div>
              <div className={styles.individualPara}>
                <input
                  className={styles.referenceButton}
                  type="text"
                  placeholder={`Reference: ${ref || "test"}`}
                  onClick={() => Router.push(`/ref?ref=${ref}`)}
                />
              </div>
            </div>
          </div>
          {/* Check if flight exists */}
          {result.length > 0 && (
            <>
              <div className={styles.inputForm}>
                <h3>References</h3>
                <div className={styles.flightsContainer}>
                  {" "}
                  {result.map((element, index) => {
                    console.log(element);
                    return <ReferenceItem key={index} reference={element} />;
                  })}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </Layout>
  );
}
