import Head from "next/head";
import Image from "next/image";
import styles from "../styles/About.module.css";

// Component List
import Layout from "../components/Layout";

const about = () => {
  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>Skyscanner Plus - About Page</title>
          <meta name="I built this project because I wanted a way to find cheaper flights using the resources that already existed" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className={styles.titleDiv}>
          <h1 className={styles.title}>
            Skyscanner Plus -{" "}
            <span className={styles.flight}>{"Why build this?"}</span>{" "}
          </h1>
        </div>
        <main className={styles.main}>
          <div>
            <div className={styles.mainContainer}>
              <h5 className={styles.titleItem}>To the point</h5>
              <p>
                {`I like how Skyscanner works but it doens't have a feature to
                allow someone to look for many of flights at one time. I built
                Skyscanner Plus to check for more flights and as a result, find
                prices on holidays which suit the user. You generally look for a
                trip in advance and therefore have tolerance with the days you
                fly out and in return flights, when to return. As you search for
                more than one flight, you're more likely to get cheaper flights
                than what Skyscanner would offer. I made this comparison page to
                show the differences of Skyscanner and how much cheaper Skyscanner Plus can be. `}
              </p>
              <h5 className={styles.titleItem}>
                {`How does Skyscanner Plus offer cheaper flights?`}
              </h5>
              <p>
                {`Rather than looking at one date per like most flight
                aggregators, I use Skyscanner to look at a date range. As a
                result, I have far more dates to look from.`}
              </p>
            </div>
            <div className={styles.mainContainer}>
              <h5 className={styles.titleItem}>
                {`How is this different than Skyscanner?`}
              </h5>
              <p>
                {`Skyscanner looks at one flight while I look up to many. In some
                cases, that can be 100. As a result, I have far more flights to
                choose from. As a result, you're more likely to find a cheaper flight.`}
              </p>
            </div>
            <div className={styles.mainContainer}>
              <h5 className={styles.titleItem}>Why do you use a date range?</h5>
              <p>
                {`This gives me more flights to look at and then the option for a
                user to determine how short or long they want to go on holiday
                for. If you knew you were free for January and were to go on
                holiday for 10 to 14 days, this would allow Skyscanner Plus to
                scan all of January for flights which lasted 10 to 14 days. As
                you can tell, this would look through hundreds of flights rather
                than one or three.`}
              </p>
            </div>
            <div className={styles.mainContainer}>
              <h5 className={styles.titleItem}>{`What's the catch?`}</h5>
              <p>
                {`Searches aren't instant. You will have to wait for Skyscanner
                Plus to go through all the flights within the date range before
                you get a result. You'll be given a reference number however,
                the email you used can be used to search for flights you
                previously searched for.`}
              </p>
            </div>
            <div className={styles.mainContainer}>
              {" "}
              <h5 className={styles.titleItem}>Why should I have to wait?</h5>
              <p>
                {`You stand not to lose anything by using this free service and
                you're more likely to find a cheaper flight here than anywhere
                else. While Skyscanner Plus is scanning for a flight, you can
                sit back and wait or find a flight while you wait. Ultimately I
                am fairly sure you won't find a cheaper flight elsewhere within
                the date range you specified.`}
              </p>
            </div>
            <div className={styles.mainContainer}>
              {" "}
              <h5 className={styles.titleItem}>
                What else do you do to find cheaper flights?
              </h5>
              <p>
                {`There's nothing else that Skyscanner Plus does to find cheaper
                flights. I'll add more ways to tailor the flights searched to
                what you want. Be it a weekend only flight, the day of the week
                you want to begin your holiday or a set date the date range must
                have.`}
              </p>
            </div>
            <div className={styles.mainContainer}>
              <h5 className={styles.titleItem}>
                How long does it take to setup a flight?
              </h5>
              <p>
                {`About one minute give or take. I require some extra information
                like the amount of days you want to go on holiday for minimally
                and the max.`}
              </p>
            </div>
            <div className={styles.mainContainer}></div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default about;
