import { NextApiRequest, NextApiResponse } from "next";
import fetchCoffeeStores from "lib/coffee-stores";
interface Data {}

const getCoffeeStoresByLocation = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { latLong = "", limit = "0" } = req.query;
  const limitNumber = Number(limit as string);
  try {
    const fetchedCoffeeStores = await fetchCoffeeStores(
      latLong as string,
      limitNumber
    );
    res.status(200).json(fetchedCoffeeStores);
  } catch (e) {
    console.error("There was an error ", e);
    res.status(500).json({ message: "Oh no! Something went wrong " + e });
  }
};

export default getCoffeeStoresByLocation;
