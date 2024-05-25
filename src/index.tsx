import { createRoot } from 'react-dom/client';
import { App } from '@/app/ui/App';
import '@/app/assets/styles/index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

const container = document.getElementById('root');
if (!container) {
    throw new Error('Контейнер root не найден');
}

const root = createRoot(container);
root.render(<App />);