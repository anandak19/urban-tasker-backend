export interface ICreateCategory {
  name: string;
  image?: string;
}

export type IUpdateCategory = Partial<ICreateCategory>;

export interface ICategory {
  id: string;

  name: string;

  image: string;

  isActive: boolean;

  slug: string;
}
