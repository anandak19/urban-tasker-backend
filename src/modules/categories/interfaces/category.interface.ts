export interface ICreateCategory {
  name: string;
  image?: string;
}

export type IUpdateCategory = Partial<ICreateCategory>;

// have this in f
export interface ICategoryCard {
  id: string;
  name: string;
  image: string;
}

export interface ICategory extends ICategoryCard {
  isActive: boolean;
  slug: string;
  isDeleted: boolean;
}
