import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-ink-950 text-ivory">
      <a className="skip-link" href="#page-content">Skip to main content</a>
      <Header />
      <div id="page-content" tabIndex={-1} className="flex-grow flex flex-col relative pt-[72px] min-w-0 w-full">
        {/* pt-[72px] offsets the fixed header for most pages except Home which underlaps it */}
        <div className="flex-grow flex flex-col min-w-0 w-full">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
}
