import { PaginatedResponseDto } from '../pagination/response/pagination-response.dto';

export interface PaginationParams {
  page: number;
  limit: number;
}

export class PaginationHelper {
  /**
   * Calculate skip value for pagination
   */
  static getSkip(page: number, limit: number): number {
    return (page - 1) * limit;
  }

  /**
   * Generic paginate function for Prisma queries with transformation
   */
  static async paginate<T, U>(
    model: any,
    where: any,
    { page = 1, limit = 10 }: PaginationParams,
    options: {
      orderBy?: any;
      select?: any;
      include?: any;
    } = {},
    transform: (item: T) => U,
  ): Promise<PaginatedResponseDto<U>> {
    const skip = this.getSkip(page, limit);

    const [data, total] = await Promise.all([
      model.findMany({
        where,
        skip,
        take: limit,
        ...options,
      }) as Promise<T[]>,
      model.count({ where }),
    ]);

    const transformedData = data.map(transform);

    return new PaginatedResponseDto(transformedData, total, page, limit);
  }

  /**
   * Generic paginate function for Prisma queries without transformation
   */
  static async paginateRaw<T>(
    model: any,
    where: any,
    { page = 1, limit = 10 }: PaginationParams,
    options: {
      orderBy?: any;
      select?: any;
      include?: any;
    } = {},
  ): Promise<PaginatedResponseDto<T>> {
    const skip = this.getSkip(page, limit);

    const [data, total] = await Promise.all([
      model.findMany({
        where,
        skip,
        take: limit,
        ...options,
      }) as Promise<T[]>,
      model.count({ where }),
    ]);

    return new PaginatedResponseDto(data, total, page, limit);
  }
}
