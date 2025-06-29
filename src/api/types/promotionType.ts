import { z } from "zod"

export const promotionSchema = z.object({
  promotionName: z.string(),
  type: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  userGroupName: z.string(),
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
})

export type GetPromotionsOptions = z.infer<typeof GetPromotionsParamsSchema>

export const promotion = {
  promotionName: "Promotion 1",
  type: "Type 1",
  startDate: new Date().toDateString(),
  endDate: new Date().toDateString(),
  userGroupName: "Group 1",
}
