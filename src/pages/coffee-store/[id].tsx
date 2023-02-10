import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import CoffeeStores from "data/data.json";
import CoffeeStore from "@/types/CoffeeStore";
import Head from "next/head";

import styles from "./coffeeStore.module.css";
import Image from "next/image";

import cls from "classnames";

interface Props {
  coffeeStore: CoffeeStore;
}

export function getStaticProps(context: any) {
  const { params } = context;
  return {
    props: {
      coffeeStore: CoffeeStores?.find((it) => {
        return it.id === params.id;
      }),
    },
  };
}

// For dynamic routes getStaticPath is required with getStaticProps for pre-rendering
export function getStaticPaths() {
  const paths = CoffeeStores.map((it) => ({
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
  const { coffeeStore } = props;
  if (router.isFallback) return <div>Loading...</div>;

  const { name, address, neighborhood, imgUrl } = coffeeStore;

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
            <Link href="/">Back to home </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={imgUrl}
            width={600}
            height={360}
            className={styles.storeImg}
            alt={name}
          />
        </div>
        <div className={cls("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image src="/icons/places.svg" width={24} height={24} alt="address icon" />
            <p className={styles.text}>{address}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image src="/icons/nearMe.svg" width={24} height={24} alt="address icon" />
            <p className={styles.text}>{neighborhood}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image src="/icons/star.svg" width={24} height={24} alt="address icon" />
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
