import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import CoffeeStores from "data/data.json";
import CoffeeStore from "@/types/CoffeeStore";
import Head from "next/head";

import styles from "./coffeeStore.module.css";
import Image from "next/image";

import cls from "classnames";
import fetchCoffeeStores from "lib/coffee-stores";

import { isEmpty } from "@/utils";
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
  useEffect(() => {
    if (isEmpty(props.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const findCoffeeStoreById = coffeeStores.find((coffeeStore:any) => {
          return coffeeStore.id.toString() === id; //dynamic id
        });
        setCoffeeStore(findCoffeeStoreById);
      }
    }
  }, [id]);
  if (router.isFallback) return <div>Loading...</div>;

  const {
    name,
    address = "",
    neighbourhood = "",
    imgUrl = "",
    location,
  } = coffeeStore;

  const handleUpvoteButton = () => {
    console.log("Upvote button clicked");
  };

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
            <p className={styles.text}>1</p>
          </div>
          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  );
}
