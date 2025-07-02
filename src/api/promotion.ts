import { GetPromotionsOptions } from "./types";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getPromotions = async (options?: GetPromotionsOptions) => {
    const params = new URLSearchParams();
    if (options?.page) params.append('page', options.page.toString());
    if (options?.limit) params.append('limit', options.limit.toString());
    
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





