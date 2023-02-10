import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";

interface Props {}

export default function TestRoute(props: Props) {
  const router = useRouter();
  const {query} = router ?? {}
  const id = query.id
  return <div>
    <Head>
      <title>{id}</title>
    </Head>
    Page {id}</div>;
}
