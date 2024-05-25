import { FileIcon, defaultStyles } from 'react-file-icon';
import './DownloadFileButton.scss';

type DownloadFileButtonProps = {
  url: string;
}

export const DownloadFileButton = ({url}: DownloadFileButtonProps) => {
  /* --------------------------------------
  У пакета плохая поддержка TypeScript при динамической передаче 
  расширения файлов. Поэтому типы приведены к any. При передаче несуществующего 
  расширения будут передаваться пустые стили и это не вызовет ошибки.
  -------------------------------------- */
  /* eslint-disable */
  const extension = url.split('.').pop() as any;
  const iconStyles = (defaultStyles as any)[extension] || {};
  /* eslint-enable */
  
  return (
      <a className='download-file' href={url} download aria-description='Скачать файл'>
        <FileIcon extension={extension} {...iconStyles}/>
      </a>
  );
};
