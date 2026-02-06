import { PortfolioResponseDto } from '../dtos/portfolio-response.dto';
import { IPortfolioImageAggregationResult } from '../interfaces/portfolio-image.interface';

export class PortfolioImageMapper {
  static toResponse(
    data: IPortfolioImageAggregationResult,
    imageUrl: string,
  ): PortfolioResponseDto {
    return {
      id: data.id,
      caption: data.caption,
      imageUrl,
    };
  }
}
