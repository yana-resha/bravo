import { OKRDREmployeeCell } from "@/features/OKRDRTable/types/OKRDRRowProps";
import defaultAvatar from '@/shared/assets/img/users/default-avatar.png';
import { getFIOShort } from "@/shared/lib/getFIOShort";

export function EmployeeCell({employee}: OKRDREmployeeCell) {
    return (
        <div className='d-flex flex-row align-items-center' title={employee.fio??""}>
            <img src={employee.avatar ? employee.avatar : defaultAvatar} alt="" className='rounded-circle avatar-xs me-2' />
            <div>
                {getFIOShort(employee.fio??"")}
            </div>
        </div>
    )
}