import ReactDOM from 'react-dom/client';
import App from './components/App/App';
import './style.scss';
import {AuthProvider} from './Contexte/authContexte'

ReactDOM.createRoot(document.getElementById('root')).render(<AuthProvider><App/></AuthProvider>);