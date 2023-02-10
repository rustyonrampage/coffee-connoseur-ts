import React from "react";
import styles from "./card.module.css";

import cls from "classnames";

import Image from "next/image";
import Link from "next/link";

interface Props {
  name: string;
  imgUrl: string;
  href: string;
  className?: string;
}

export default function Card(props: Props) {
  const { name, imgUrl, href, className = "" } = props;
  return (
    <Link href={href} className={cls(styles.cardLink, className)}>
      <div className={cls("glass", styles.container)}>
        <div className={styles.cardHeaderWrapper}>
          <h2 className={styles.cardHeader}>{name}</h2>
        </div>
        <div className={styles.cardImageWrapper}>
          <Image
            className={styles.cardImage}
            src={imgUrl}
            width={260}
            height={160}
            alt="Card Image"
            style={{
              objectFit: "cover",
            }}
          />
        </div>
      </div>
    </Link>
  );
}
