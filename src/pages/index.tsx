import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import Banner from "components/banner";
import Card from "components/card";
import CoffeeStores from "data/data.json";

import CoffeeStore from "@/types/CoffeeStore";
import fetchCoffeeStores from "lib/coffee-stores";
import { MouseEventHandler, useEffect, useState } from "react";
import useTrackLocation from "hooks/use-track.location";
import { ACTION_TYPES, StoreContext } from "@/store/store-context";
import { useContext } from "react";

interface Props {
  coffeeStores: CoffeeStore[];
}

export async function getStaticProps(context: any) {
  const coffeeStores = await fetchCoffeeStores();
  return {
    props: {
      coffeeStores,
    },
  };
}

export default function Home(props: Props) {
  // const { coffeeStores } = props;

  // const [coffeeStores, setCoffeeStores] = useState([]);
  const [coffeeStoresError, setCoffeeStoresError] = useState(null);
  const { dispatch, state } = useContext(StoreContext) as any;
  const { coffeeStores, latLong } = state;

  const { handleTrackLocation, locationErrorMsg, isFindingLocation } =
    useTrackLocation();

  const handleOnBannerBtnClick = (e: React.MouseEvent<HTMLElement>) => {
    handleTrackLocation();
  };

  const fetchStores = async (latLong: string, limit: number) => {
    const fetchedCoffeeStores = await fetchCoffeeStores(latLong, limit);
    dispatch({
      type: ACTION_TYPES.SET_COFFEE_STORES,
      payload: {
        coffeeStores: fetchedCoffeeStores,
      },
    });
  };
  useEffect(() => {
    console.log(latLong);
    if (latLong) {
      try {
        fetchStores(latLong, 30);
      } catch (error: any) {
        setCoffeeStoresError(
          error?.message || "Error has occured while fetching stores"
        );
      }
    }
  }, [latLong]);

  console.log("props", props);
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
          buttonText={isFindingLocation ? "Loading..." : "View Stores Banner"}
          handleOnClick={handleOnBannerBtnClick}
        />
        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
        {coffeeStoresError && <p>Something went wrong: {coffeeStoresError}</p>}

        <div className={styles.sectionWrapper}>
          {coffeeStores?.length > 0 && (
            <>
              <h2 className={styles.heading2}>Stores near me</h2>
              <div className={styles.cardLayout}>
                {coffeeStores?.map((it: CoffeeStore) => {
                  return (
                    <Card
                      key={it.id}
                      name={it.name}
                      href={`/coffee-store/${it.id}`}
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
        </div>
        <div className={styles.sectionWrapper}>
          {props.coffeeStores?.length > 0 && (
            <>
              <h2 className={styles.heading2}>NY stores</h2>
              <div className={styles.cardLayout}>
                {props.coffeeStores?.map((it: CoffeeStore) => {
                  return (
                    <Card
                      key={it.id}
                      name={it.name}
                      href={`/coffee-store/${it.id}`}
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
        </div>
      </main>
    </>
  );
}
