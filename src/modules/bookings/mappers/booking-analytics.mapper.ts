import { ListCategoryCardDto } from '../dtos/popular-categories.dto';
import { IPopularCategoriesRepoResponse } from '../interfaces/repo-responses.interface';

export class BookingAnalyticsMapper {
  static toListCategoryCard(
    data: IPopularCategoriesRepoResponse,
    imageUrl: string,
  ): ListCategoryCardDto {
    return {
      description: data.description,
      id: data.id,
      image: imageUrl,
      name: data.name,
      parentCategoryId: data.parentCategoryId,
      parentCategoryName: data.parentCategoryName,
    };
  }
}
