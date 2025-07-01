import { GetPromotionsOptions } from "./types/promotionType";
import { Promotion } from "./types/promotionType";

const API_BASE_URL = 'http://localhost:8000/api';

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

export const getPromotion = async (id: string): Promise<Promotion> => {
    try {
        const response = await fetch(`${API_BASE_URL}/promotions/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching promotion:', error);
        throw error;
    }
};

export const createPromotion = async (promotion: Omit<Promotion, 'id'>): Promise<Promotion> => {
    try {
        const response = await fetch(`${API_BASE_URL}/promotions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(promotion),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error creating promotion:', error);
        throw error;
    }
};

export const updatePromotion = async (id: string, promotion: Omit<Promotion, 'id'>): Promise<Promotion> => {
    try {
        const response = await fetch(`${API_BASE_URL}/promotions/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(promotion),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error updating promotion:', error);
        throw error;
    }
};

export const deletePromotion = async (id: string): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE_URL}/promotions/${id}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error deleting promotion:', error);
        throw error;
    }
};

