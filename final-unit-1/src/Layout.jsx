import Navbar from './components/Navbar';
import { Outlet } from 'react-router-dom';

function Layout() {
    return (
        <>
            <header>
                <h1>August's Movie Recommendations!</h1>
                <Navbar />
            </header>
            <main>
                <Outlet />
                {/* The <Outlet /> component is used as a placeholder for nested routes. When you define nested routes, the parent component uses <Outlet /> to specify where the child route's component should render. */}
            </main>
            <footer>
                <p>Author: August Keller</p>
                <p>My Instagram: <a href="https://www.instagram.com/augustkellerwrites/" target="_blank">@augustkellerwrites</a></p>
                <p>My YouTube: <a href="https://www.youtube.com/@augustkellerwrites" target="_blank">@augustkellerwrites</a></p>
            </footer>
        </>
    )
}

export default Layout;