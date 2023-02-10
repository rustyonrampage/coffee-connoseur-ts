import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import Banner from "components/banner";
import Card from "components/card";
import CoffeeStores from "data/data.json";

import CoffeeStore from "@/types/CoffeeStore";

interface Props {
  coffeeStores: CoffeeStore[];
}

export async function getStaticProps(context: any) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: process.env.FOURSQUARE_API_KEY!,
    },
  };

  const response = await fetch(
    "https://api.foursquare.com/v3/places/search?query=Food&ll=30.286580%2C71.931984&limit=6",
    options
  );
  const data = await response.json();
  console.log("data is ", data);
  return {
    props: {
      coffeeStores: data.results,
    },
  };
}

export default function Home(props: Props) {
  const { coffeeStores } = props;
  return (
    <>
      <Head>
        <title>Coffee Connoiseur</title>
        <meta
          name="description"
          content="Get to know the best coffee locations"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Image
          className={styles.heroImage}
          src="/hero-image.png"
          alt="Hero Image"
          width={700}
          height={400}
        />

        <Banner
          buttonText="View Stores Banner"
          handleOnClick={() => console.log("asdsa")}
        />
        {coffeeStores?.length > 0 && (
          <>
            <h2 className={styles.heading2}>Toronot stores</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((it) => {
                return (
                  <Card
                    key={it.fsq_id}
                    name={it.name}
                    href={`/coffee-store/${it.fsq_id}`}
                    imgUrl={
                      it.imgUrl ||
                      "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                    }
                  />
                );
              })}
            </div>
          </>
        )}
      </main>
    </>
  );
}
