import React, { MouseEventHandler } from "react";
import styles from "./banner.module.css";

interface Props {
  buttonText: string;
  handleOnClick: (e:  React.MouseEvent<HTMLElement>) => void;
}

export default function Banner(props: Props) {
  const handleOnButtonClick = (
    e:  React.MouseEvent<HTMLElement>
  ) => {
    props.handleOnClick(e);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <span className={styles.title1}>Coffee</span>{" "}
        <span className={styles.title2}>Connoisseur</span>
      </h1>
      <p className={styles.subTitle}>Discover your local coffee shops!</p>
      <div className={styles.buttonWrapper}>
        <button className={styles.button} onClick={handleOnButtonClick}>
          {props.buttonText}
        </button>
      </div>
    </div>
  );
}
