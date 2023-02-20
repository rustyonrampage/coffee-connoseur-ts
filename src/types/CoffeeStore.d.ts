import CoffeeStore from "@/pages/coffee-store/[id]";

interface CoffeeStore {
  id: string;
  name: string;
  imgUrl: string;
  websiteUrl: string;
  address: string;
  neighbourhood: string;
  location: {
    address: string;
    neighbourhood: string[]
  }
}

export default CoffeeStore;
