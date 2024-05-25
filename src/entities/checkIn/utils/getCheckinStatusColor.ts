import { bgThemeEnum } from "@/shared/ui/Badge/types/badgeProps";
import { CheckinStatus } from "../types/CheckinType";

const getCheckinStatusColor = (checkinStatus: CheckinStatus) => {
    switch (checkinStatus) {
        case CheckinStatus.danger: 
            return bgThemeEnum.danger;
        case CheckinStatus.warning: 
            return bgThemeEnum.warning;
        case CheckinStatus.normal:
            return bgThemeEnum.success;
        default: 
            return bgThemeEnum.warning;
    }
}

export default getCheckinStatusColor;