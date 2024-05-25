import "./Notes.scss"
import { DownloadFileButton } from "@/shared/ui/DownloadFileButton";
import { InfoCollapse } from "../InfoCollapse/InfoCollapse";
import { Plug } from "../../../../../shared/ui/Plug/PLug";

export function Notes({closeCollapse = false} : {closeCollapse?: boolean}): JSX.Element {
    const isHasData: boolean = false;

    return (
        <InfoCollapse closeCollapse={closeCollapse} title="Заметки">
            <div className="notes">
                {isHasData
                    ? 
                    <ul className="notes__list">
                        <li className="notes__item">
                            <p className="notes__creator">Ковалев Роман 10.11.2023:</p>
                            <div className="notes__comment-wrapper">
                                <p className="notes__comment">Опредили Яндекс Клауд как поставщика инфраструктурных услуг</p>
                                <ul className="notes__files">
                                    <li className="notes__file"><DownloadFileButton url="file.pdf" /></li>
                                </ul>
                                <p className="notes__stats">
                                    50%
                                    {/* notes__dynamics--negative - при отрицательной динамике */}
                                    <span className="notes__dynamics">+5%</span>
                                </p>
                            </div>
                        </li>
                        <li className="notes__item">
                            <p className="notes__creator">Ковалев Роман 10.11.2023:</p>
                            <div className="notes__comment-wrapper">
                                <p className="notes__comment">Утвердили риск модель, тестируем с бизнесом</p>
                                <ul className="notes__files">
                                    <li className="notes__file"><DownloadFileButton url="file.pdf" /></li>
                                </ul>
                                <p className="notes__stats">
                                    35%
                                    {/* notes__dynamics--negative - при отрицательной динамике */}
                                    <span className="notes__dynamics notes__dynamics--negative">-15%</span>
                                </p>
                            </div>
                        </li>
                    </ul>
                    :
                    <Plug title='Заметки пока не добавлены' />
                }
                
            </div>
        </InfoCollapse>
    )
}


