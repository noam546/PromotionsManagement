enum PromotionType {
    Epic = "Epic",
    Common = "Common",
    Basic = "Basic"
}

interface Promotion {
    promotionName: string;
    type: PromotionType;
    startDate: Date;
    endDate: Date;
    userGroupName: string;
}

const BASE_PROMOTIONS: Omit<Promotion, 'promotionName' | 'startDate' | 'endDate'>[] = [
    { type: PromotionType.Epic, userGroupName: "Premium Users" },
    { type: PromotionType.Common, userGroupName: "All Users" },
    { type: PromotionType.Basic, userGroupName: "New Users" },
    { type: PromotionType.Epic, userGroupName: "VIP Members" },
    { type: PromotionType.Common, userGroupName: "Active Players" },
    { type: PromotionType.Basic, userGroupName: "Birthday Users" },
    { type: PromotionType.Epic, userGroupName: "Event Participants" },
    { type: PromotionType.Common, userGroupName: "Referrers" },
    { type: PromotionType.Basic, userGroupName: "Loyal Customers" },
    { type: PromotionType.Epic, userGroupName: "Flash Sale Users" },
];

const NAMES = [
    "Summer Sale", "Holiday Special", "New User Bonus", "VIP Exclusive",
    "Weekend Warrior", "Birthday Bash", "Seasonal Event", "Referral Rewards",
    "Loyalty Program", "Flash Sale"
];

function randomDate(base: Date, range: number = 30): Date {
    const offset = Math.floor(Math.random() * (2 * range + 1)) - range;
    const newDate = new Date(base);
    newDate.setDate(newDate.getDate() + offset);
    return newDate;
}

export const MOCK_PROMOTIONS_200: Promotion[] = Array.from({ length: 1000 }, (_, i) => {
    const index = i % BASE_PROMOTIONS.length;
    const base = BASE_PROMOTIONS[index];
    const name = NAMES[index];
    const baseStart = new Date(2024, 0, 1 + index * 20); // staggered base date
    const startDate = randomDate(baseStart);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + Math.floor(Math.random() * 90 + 7)); // duration 1–3 months

    return {
        promotionName: `${name} #${i + 1}`,
        type: base.type,
        userGroupName: base.userGroupName,
        startDate,
        endDate
    };
});