import { createApi } from "unsplash-js";

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_API_KEY!,
});

const getURLForCoffeeStores = (
  latlong?: string,
  query?: string,
  limit?: number
) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latlong}&limit=${limit}`;
};

const getListOfCoffeeStorePhotos = async (limit = 6) => {
  const photos = await unsplash.search.getPhotos({
    query: "cofee shop",
    page: 1,
    perPage: limit,
  });
  const unsplashResults = photos.response?.results;

  return unsplashResults?.map((it) => it.urls["small"]);
};

const fetchCoffeeStores = async (
  latLong: string = "40.766776,-73.972941",
  limit: number = 6
) => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY!,
    },
  };
  const photos = await getListOfCoffeeStorePhotos();
  const response = await fetch(
    getURLForCoffeeStores(latLong, "Food", limit),
    options
  );
  const data = await response.json();
  console.log("DATA", data);
  return data.results.map((it: any, i: number) => ({
    id: it.fsq_id,
    name: it.name || "",
    imgUrl: photos?.[i] || "",
    address: it?.location?.address || "",
    neighbourhood: it?.location?.neighbourhood?.[0] || "",
  }));
};

export default fetchCoffeeStores;
