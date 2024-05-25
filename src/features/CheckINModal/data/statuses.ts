import { CheckinStatus } from "@/entities/checkIn/types/CheckinType"
import { bgThemeEnum } from "@/shared/ui/Badge/types/badgeProps"

export const statuses = [
    {
        id: CheckinStatus.normal,
        description: CheckinStatus.normal,
        theme: bgThemeEnum.success,
    },

    {
        id: CheckinStatus.warning,
        description: CheckinStatus.warning,
        theme: bgThemeEnum.warning,
    },

    {
        id: CheckinStatus.danger,
        description: CheckinStatus.danger,
        theme: bgThemeEnum.danger,
    }
]