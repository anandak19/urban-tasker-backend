export interface ICreateCategory {
  name: string;
  image?: string;
}

export interface ICategory {
  id: string;

  name: string;

  image: string;

  isActive: boolean;

  slug: string;
}
