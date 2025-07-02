import { GetPromotionsOptions } from "./types";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export type { GetPromotionsOptions };

export const getPromotions = async (options?: GetPromotionsOptions) => {
    const params = new URLSearchParams();
    
    // Pagination
    if (options?.page) params.append('page', options.page.toString());
    if (options?.limit) params.append('limit', options.limit.toString());
    
    // Search and filtering
    if (options?.search) params.append('search', options.search);
    if (options?.type) params.append('type', options.type);
    if (options?.startDate) params.append('startDate', options.startDate);
    if (options?.endDate) params.append('endDate', options.endDate);
    
    // Sorting
    if (options?.sortBy) params.append('sortBy', options.sortBy);
    if (options?.sortOrder) params.append('sortOrder', options.sortOrder);
    
    const url = `${API_BASE_URL}/promotions${params.toString() ? `?${params.toString()}` : ''}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const res = await response.json();
        return {
            promotions: res.data,
            pagination: {
                totalPages: res.pagination.totalPages,
                totalItems: res.pagination.total,
                hasMore: res.pagination.page < res.pagination.totalPages,
                currentPage: res.pagination.page,
            },
        }
    } catch (error) {
        console.error('Error fetching promotions:', error);
        throw error;
    }
};





