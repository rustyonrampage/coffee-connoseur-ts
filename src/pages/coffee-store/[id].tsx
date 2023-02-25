import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import CoffeeStores from "data/data.json";
import CoffeeStore from "@/types/CoffeeStore";
import Head from "next/head";
import useSWR from "swr";

import styles from "./coffeeStore.module.css";
import Image from "next/image";

import cls from "classnames";
import fetchCoffeeStores from "lib/coffee-stores";

import { isEmpty, fetcher } from "@/utils";
import { StoreContext } from "@/store/store-context";

interface Props {
  coffeeStore: CoffeeStore;
}

export async function getStaticProps(context: any) {
  const { params } = context;
  const coffeeStores: CoffeeStore[] = await fetchCoffeeStores();

  return {
    props: {
      coffeeStore:
        coffeeStores?.find((it) => {
          return it.id === params.id;
        }) ?? {},
    },
  };
}

// For dynamic routes getStaticPath is required with getStaticProps for pre-rendering
export async function getStaticPaths() {
  const coffeeStores: CoffeeStore[] = await fetchCoffeeStores();

  const paths = coffeeStores.map((it) => ({
    params: {
      id: it.id,
    },
  }));
  return {
    paths,
    fallback: true,
  };
}

// [id].tsx can be [slug].tsx [whatever].tsx
export default function CoffeeStoreCard(props: Props) {
  const router = useRouter();
  const id = router.query.id;

  const [coffeeStore, setCoffeeStore] = useState(props.coffeeStore);
  const {
    state: { coffeeStores },
  } = useContext(StoreContext) as any;

  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

  useEffect(() => {
    if (data && data.length > 0) {
      console.log("data from SWR", data);
      setCoffeeStore(data[0]);
      setVotingCount(data[0].voting);
    }
  }, [data]);

  const handleCreateCoffeeStore = async (coffeeStore: any) => {
    try {
      const { id, name, voting, imgUrl, neighbourhood, address } = coffeeStore;
      const response = await fetch("/api/createCoffeeStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          voting: 0,
          imgUrl,
          neighbourhood: neighbourhood || "",
          address: address || "",
        }),
      });

      const dbCoffeeStore = await response.json();
      console.log({ dbCoffeeStore });
    } catch (err) {
      console.error("Error creating coffee store", err);
    }
  };

  const [votingCount, setVotingCount] = useState(0);

  useEffect(() => {
    if (isEmpty(props.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const findCoffeeStoreById = coffeeStores.find((coffeeStore: any) => {
          return coffeeStore.id.toString() === id; //dynamic id
        });
        setCoffeeStore(findCoffeeStoreById);
        handleCreateCoffeeStore(findCoffeeStoreById);
      }
    } else {
      // SSG
      handleCreateCoffeeStore(props.coffeeStore);
    }
  }, [id, props.coffeeStore]);
  if (router.isFallback) return <div>Loading...</div>;

  const {
    name,
    address = "",
    neighbourhood = "",
    imgUrl = "",
    location,
  } = coffeeStore;

  const handleUpvoteButton = async () => {
    try {
      const response = await fetch("/api/favouriteCoffeeStoreById", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      const dbCoffeeStore = await response.json();

      if (dbCoffeeStore && dbCoffeeStore.length > 0) {
        let count = votingCount + 1;
        setVotingCount(count);
      }
    } catch (err) {
      console.error("Error upvoting the coffee store", err);
    }
  };

  if (error) {
    return <div>Something went wrong retrieving coffee store page</div>;
  }

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">← Back to home </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={
              imgUrl ||
              "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            }
            width={600}
            height={360}
            className={styles.storeImg}
            alt={name}
          />
        </div>
        <div className={cls("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image
              src="/icons/places.svg"
              width={24}
              height={24}
              alt="address icon"
            />
            <p className={styles.text}>{address}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image
              src="/icons/nearMe.svg"
              width={24}
              height={24}
              alt="address icon"
            />
            <p className={styles.text}>{neighbourhood}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image
              src="/icons/star.svg"
              width={24}
              height={24}
              alt="address icon"
            />
            <p className={styles.text}>{votingCount}</p>
          </div>
          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  );
}
