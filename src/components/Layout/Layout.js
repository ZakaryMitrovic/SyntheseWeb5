import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';

const Layout = () => {
    return (
		<div>
			<Header/>
			<main className="container">
				<div>
					<Outlet/>
				</div>
			</main>
		</div>
    );
};

export default Layout;
