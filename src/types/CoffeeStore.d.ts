import CoffeeStore from "@/pages/coffee-store/[id]";

interface CoffeeStore {
  fsq_id: string;
  name: string;
  imgUrl: string;
  websiteUrl: string;
  address: string;
  neighborhood: string;
}

export default CoffeeStore;
