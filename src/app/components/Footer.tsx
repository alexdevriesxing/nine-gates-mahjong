import { Link } from 'react-router-dom';
import { FOOTER_SECTIONS } from '@shared/constants';

export default function Footer() {
  return (
    <footer className="bg-ink-950 border-t border-gold/10 pt-16 pb-8">
      <div className="container-wide">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-16">
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="font-display text-gold font-semibold tracking-wider mb-6">
                {section.title}
              </h3>
              <ul className="flex flex-col gap-3">
                {section.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-ink-300 hover:text-gold transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gold/5 text-ink-400 text-sm gap-4">
          <div className="flex items-center gap-3">
            <div className="gate-medallion scale-75 opacity-50">
              <span /><span /><span />
              <span /><span /><span />
              <span /><span /><span />
            </div>
            <span>Nine Gates Mahjong — Free online Mahjong and Mahjongg portal.</span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} Nine Gates Mahjong. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
