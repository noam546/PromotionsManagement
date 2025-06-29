import { GetPromotionsOptions } from "./types/promotionType";
import { MOCK_PROMOTIONS_200 } from "./mock";

export const getPromotions = async (options?: GetPromotionsOptions) => {
    const totalItems = MOCK_PROMOTIONS_200.length;
    const limit = options?.limit || totalItems;
    const page = options?.page || 1;
    const totalPages = Math.ceil(totalItems / limit);
    
    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPromotions = MOCK_PROMOTIONS_200.slice(startIndex, endIndex);
    
    // Convert Date objects to ISO strings to match the API types
    const promotionsWithStringDates = paginatedPromotions.map(promotion => ({
        ...promotion,
        startDate: promotion.startDate.toISOString(),
        endDate: promotion.endDate.toISOString(),
    }));
    
    return {
        promotions: promotionsWithStringDates,
        pagination: {
            totalPages,
            totalItems,
            hasMore: page < totalPages,
            currentPage: page,
        },
    }
}