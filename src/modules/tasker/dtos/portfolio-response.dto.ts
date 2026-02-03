import { CreatePortfolioImageDto } from './create-portfolio-image.dto';

export class PortfolioResponseDto extends CreatePortfolioImageDto {
  imageUrl: string;
  id: string;
}
