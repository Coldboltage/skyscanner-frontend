import Head from "next/head";
import Image from "next/image";
import styles from "../styles/ref.module.css";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as dayjs from "dayjs";

// Component List
import Layout from "../components/Layout";
import AirportList from "../components/AirportList";
import CheapestFlightsItem from "../components/CheapestFlightsItem";

export default function Ref({ query: { ref: queryRef } }) {
  // Console.log test
  console.log(`env ${process.env.NEXT_PUBLIC_LOCALHOST}`);
  console.log(queryRef);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [ref, setRef] = useState(queryRef || "");
  // Needed
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [minimalHoliday, setMinimalHolday] = useState("");
  const [maximumHoliday, setMaximumHoliday] = useState("");
  // Special
  const [requiredDateStart, setRequiredDateStart] = useState();
  const [requiredDateEnd, setRequiredDateEnd] = useState();
  const [weekendOnly, setWeekendOnly] = useState(false);

  // State specifically for /ref
  const [typedState, setTypedState] = useState(queryRef || "");
  const [cheapestFlights, setCheapestFlights] = useState([]);
  const [bestFlights, setBestFlights] = useState([]);

  const [departureAirportFiltered, setDepartureAirportFiltered] = useState([]);
  const [arrivalAirportFiltered, setArivalAirportFiltered] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await testReference(typedState);
    };
    if (ref) {
      fetchData();
    }
  }, []);

  console.log(cheapestFlights);

  // useEffect(() => {
  //   airportTextCheck(departure)
  // }, departure)

  // State for managed dates

  // Makes sure the code is set correctly for API consumption
  const formValidation = ({}) => {
    // Check if Reference exists. True or false

    if ((status = true)) {
      console.log("Validation successful");
      if (
        requiredDateStartTransform === undefined ||
        requiredDateEndTransform === undefined
      ) {
        console.log(payload);
        delete payload.dates.requiredDayStart;
        delete payload.dates.requiredDayEnd;
        console.log(`Changes have been made`);
      }
      console.log(payload);
      // Payload is ready
      return { payload, status: true };
    } else {
      console.log("Something is missing from the form. Please check the form");
      // toast("Please check the form", {
      //   position: "top-right",
      //   autoClose: 5000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      // });
      return { status: false };
    }
  };

  const validateAndSend = async () => {
    // We should be using higher order functions here but I want to work on this now. TODO
    const testObject = transformFormToDataTypes();
    const { payload, status } = formValidation(testObject);
    console.log(payload);
    if (status) {
      try {
        const response = await fetch(
          // "https://skyscannerplusweb.herokuapp.com/api/users/create/",
          // "http://localhost:8001/api/users/create/",

          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(payload),
            cors: "no-cors",
          }
        );
        const data = await response.json();
        console.log(data);
        toast("✅ The flight has been added!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      ("We didn't make a call to the server as a result of validation failure");
      toast.error("Error with the form!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const testReference = async (reference) => {
    console.log(
      `I'm making a call to /reference-info-latest-flight with the reference: ${reference}`
    );
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_HTTP_LOCAL_WEB ||
          "https://skyscannerplusweb.herokuapp.com"
        }/api/flights/reference-info-latest-flight/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          cors: "no-cors",
          body: JSON.stringify({ reference: reference }),
        }
      );
      console.log("Sent");
      console.log(response);
      console.log("Checking response");
      const data = await response.json();
      console.log(data);
      if (response.ok === true) {
        toast.success("Flight found!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        // const data = await response.json();
        // Destructure Result
        const {
          user: { name, email },
          ref,
          flights: { arrival, departure },
          dates: {
            departureDate,
            returnDate,
            minimalHoliday,
            maximumHoliday,
            weekendOnly,
          },
        } = data.result;
        console.log(`What is weekendOnly: ${weekendOnly}`);
        setName(name);
        setEmail(email);
        setRef(ref);
        setArrival(arrival);
        setDeparture(departure);
        setDepartureDate(dayjs(departureDate).format("DD, MMMM YYYY"));
        setReturnDate(dayjs(returnDate).format("DD, MMMM YYYY"));
        setMinimalHolday(minimalHoliday);
        setMaximumHoliday(maximumHoliday);
        setWeekendOnly(weekendOnly === true ? "Yes" : "No");
        // Checking latestFlight
        const { bestFlightsOrderMax, cheapestFlightsOrderMax } =
          data.latestFlights;
        setCheapestFlights(cheapestFlightsOrderMax);
        setBestFlights(bestFlightsOrderMax);
      } else if (data.error === "No scan has been done yet") {
        toast.warn(data.error, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        const {
          user: { name, email },
          ref,
          flights: { arrival, departure },
          dates: {
            departureDate,
            returnDate,
            minimalHoliday,
            maximumHoliday,
            weekendOnly,
          },
        } = data.result;
        setName(name);
        setEmail(email);
        setRef(ref);
        setArrival(arrival);
        setDeparture(departure);
        setDepartureDate(dayjs(departureDate).format("DD, MMMM YYYY"));
        setReturnDate(dayjs(returnDate).format("DD, MMMM YYYY"));
        setMinimalHolday(minimalHoliday);
        setMaximumHoliday(maximumHoliday);
        setCheapestFlights([]);
        setBestFlights([]);
        setWeekendOnly(weekendOnly === "true" ? "Yes" : "No");
      } else {
        console.log("Nothing was found");
        toast.error("No flight could be found with that reference", {
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
          <title>Create Flight</title>
          <meta name="description" content="Find your flight by reference" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className={styles.titleDiv}>
          <h1 className={styles.title}>
            Find your flight by a{" "}
            <span className={styles.flight}>Reference</span>{" "}
          </h1>
        </div>
        <main className={styles.main}>
          <div>
            <div className={styles.referenceInput}>
              <h3>Your reference</h3>
              <div>
                <div>
                  <label>Your reference</label>
                  <input
                    type="text"
                    value={typedState}
                    onChange={(e) => setTypedState(e.target.value)}
                  />
                </div>
                <input
                  type="submit"
                  onClick={() => testReference(typedState)}
                />
              </div>
            </div>
            {/* <form> */}
            <div className={styles.inputForm}>
              <h3>General Details</h3>
              <div className={styles.inputCollection}>
                <div className={styles.individualInput}>
                  {" "}
                  <label htmlFor="name">Name</label>
                  <input
                    disabled
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    type="text"
                    placeholder="name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="reference">Reference</label>
                  <input
                    disabled
                    value={ref}
                    onChange={(e) => setRef(e.target.value)}
                    type="text"
                    placeholder="reference"
                  />
                </div>
                <div>
                  <label htmlFor="email">Email Address</label>
                  <input
                    disabled
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="email address"
                  />
                </div>
              </div>
            </div>
            <div className={styles.inputForm}>
              <h3>Flight information</h3>
              <div className={styles.inputCollection}>
                <div>
                  {" "}
                  <label htmlFor="departure">Departure</label>
                  {/* Departure Dropdown */}
                  <div className={styles.dropdown}>
                    <input
                      disabled
                      className={styles.dropbtn}
                      value={departure}
                      onChange={(e) => setDeparture(e.target.value)}
                      type="text"
                      placeholder="departure"
                    />
                    <div className={styles.dropdownContent}>
                      <AirportList
                        text={departure}
                        state={setDeparture}
                        setAirportFiltered={setDepartureAirportFiltered}
                      />{" "}
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="arrival">Arrival</label>
                  <div className={styles.dropdown}>
                    <input
                      disabled
                      className={styles.dropbtn}
                      value={arrival}
                      onChange={(e) => setArrival(e.target.value)}
                      type="text"
                      placeholder="arrival"
                    />
                    <div className={styles.dropdownContent}>
                      <AirportList
                        text={arrival}
                        state={setArrival}
                        setAirportFiltered={setArivalAirportFiltered}
                      />{" "}
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="departureDate">Earliest Departure Date</label>
                  <input
                    disabled
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    type="text"
                    placeholder="departure date"
                  />
                </div>
                <div>
                  <label htmlFor="returnDate">Latest Return Date</label>
                  <input
                    disabled
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    type="text"
                    placeholder="return date"
                  />
                </div>
                <div>
                  <label htmlFor="minimalHoliday">
                    Minimal Holiday Duration
                  </label>
                  <input
                    disabled
                    value={minimalHoliday}
                    onChange={(e) => setMinimalHolday(e.target.value)}
                    type="number"
                    placeholder="minimal holiday"
                  />
                </div>
                <div>
                  <label htmlFor="maximumHoliday">
                    Maximum Holiday Duration
                  </label>
                  <input
                    disabled
                    value={maximumHoliday}
                    onChange={(e) => setMaximumHoliday(e.target.value)}
                    type="number"
                    placeholder="maximum holiday"
                  />
                </div>
              </div>
            </div>
            <div className={styles.inputForm}>
              <h3>Special Information</h3>
              <div className={styles.inputCollection}>
                <div>
                  <label htmlFor="requiredDateBeginning">Reserved Start</label>
                  <input
                    disabled
                    value={requiredDateStart}
                    onChange={(e) => setRequiredDateStart(e.target.value)}
                    type="date"
                    placceholder="departure date"
                  />
                </div>
                <div>
                  <label htmlFor="requiredDateEnding">Reserved Ending</label>
                  <input
                    disabled
                    value={requiredDateEnd}
                    onChange={(e) => setRequiredDateEnd(e.target.value)}
                    type="date"
                    placeholder="return date"
                  />
                </div>
                <div>
                  <label htmlFor="weekendOnly">Weekend Only</label>
                  <input
                    disabled
                    value={`${weekendOnly}`}
                    onChange={(e) => setWeekendOnly(e.target.value)}
                    type="text"
                    // placeholder="return date"
                  />
                </div>
              </div>
            </div>
            {/* <input disabled
              style={{ marginTop: "30px" }}
              type="submit"
              onClick={validateAndSend}
            /> */}
            {/* </form> */}
          </div>
          {/* Check if flight exists */}
          {cheapestFlights.length > 0 && (
            <>
              <div className={styles.inputForm}>
                <h3>Cheapest Flights</h3>
                <div className={styles.flightsContainer}>
                  {" "}
                  {cheapestFlights.map((element, index) => {
                    return (
                      <CheapestFlightsItem
                        key={index}
                        flight={element}
                        bestOrCheapest="cheapest"
                      />
                    );
                  })}
                </div>
              </div>
            </>
          )}
          {bestFlights.length > 0 && (
            <>
              <div className={styles.inputForm}>
                <h3>Best Flights</h3>
                <div className={styles.flightsContainer}>
                  {" "}
                  {cheapestFlights.map((element, index) => {
                    return (
                      <CheapestFlightsItem
                        key={index}
                        flight={element}
                        bestOrCheapest="best"
                      />
                    );
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

export async function getServerSideProps(context) {
  console.log(context.query);
  return {
    props: { query: context.query },
  };
}
