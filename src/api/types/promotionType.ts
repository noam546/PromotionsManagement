import { z } from "zod"

export const promotionSchema = z.object({
  id: z.string(),
  promotionName: z.string(),
  type: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  userGroupName: z.string(),
  createdAt: z.string().optional(),
})

export type Promotion = z.infer<typeof promotionSchema>

export const responseSchema = z.object({
  promotions: z.array(promotionSchema),
  pagination: z.object({
    totalPages: z.number(),
    totalItems: z.number(),
    hasMore: z.boolean(),
    currentPage: z.number(),
  }),
})

export type GetPromotionsResponse = z.infer<typeof responseSchema>

export const GetPromotionsParamsSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  // Search and filtering
  search: z.string().optional(),
  type: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  // Sorting
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
})

export type GetPromotionsOptions = z.infer<typeof GetPromotionsParamsSchema>

