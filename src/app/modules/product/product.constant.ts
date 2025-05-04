export type TMainCategory =
  | 'Electronics'
  | 'Fashion'
  | 'Home & Furniture'
  | 'Grocery & Essentials'
  | 'Beauty & Health'
  | 'Sports & Outdoors'
  | 'Books & Media'
  | 'Toys, Baby & Kids'
  | 'Automotive & Tools'
  | 'Office & Stationery'
  | 'Pet Supplies'
  | 'Jewelry & Accessories'
  | 'Musical Instruments'
  | 'Gaming'
;

export type TSubCategory =
  // Electronics
  | 'Smartphones'
  | 'Laptops'
  | 'Tablets'
  | 'Cameras'
  | 'Televisions'
  | 'AudioDevices'
  | 'Wearables'
  | 'ComputerAccessories'
  | 'GamingConsoles'

  // Fashion
  | 'MensClothing'
  | 'WomensClothing'
  | 'KidsClothing'
  | 'Footwear'
  | 'Watches'
  | 'Bags'
  | 'Eyewear'

  // Home & Furniture
  | 'Beds'
  | 'Sofas'
  | 'Chairs'
  | 'Tables'
  | 'Lighting'
  | 'HomeDecor'
  | 'KitchenAppliances'
  | 'Storage'

  // Grocery & Essentials
  | 'FruitsVegetables'
  | 'Beverages'
  | 'Snacks'
  | 'Bakery'
  | 'CleaningSupplies'
  | 'HealthCare'

  // Beauty & Health
  | 'Makeup'
  | 'Skincare'
  | 'Haircare'
  | 'Perfumes'
  | 'Supplements'

  // Sports & Outdoors
  | 'FitnessEquipment'
  | 'Cycling'
  | 'CampingHiking'
  | 'TeamSports'
  | 'Swimming'

  // Books & Media
  | 'Literature'
  | 'Academic'
  | 'Comics'
  | 'Magazines'
  | 'MusicCDs'
  | 'Movies'

  // Toys, Baby & Kids
  | 'EducationalToys'
  | 'SoftToys'
  | 'RemoteControlToys'
  | 'BabyGear'
  | 'BabyCare'

  // Automotive & Tools
  | 'CarAccessories'
  | 'BikeAccessories'
  | 'CarParts'
  | 'GarageTools'
  | 'CarCleaning'

  // Office & Stationery
  | 'Stationery'
  | 'OfficeFurniture'
  | 'Printers'
  | 'LaptopsForWork'

  // Pet Supplies
  | 'DogFood'
  | 'CatFood'
  | 'PetToys'
  | 'PetHealth'

  // Jewelry & Accessories
  | 'Earrings'
  | 'Necklaces'
  | 'Rings'
  | 'Bracelets'

  // Musical Instruments
  | 'Guitars'
  | 'Keyboards'
  | 'Drums'
  | 'StudioRecording'

  // Gaming
  | 'GamingLaptops'
  | 'GameConsoles'
  | 'GameDiscs'
  | 'GameAccessories'
;


export const ProductSearchableFields = [
  'name',
  'email',
  'phone',
  'role',
  'status',
];