import { Code } from 'lucide-react';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  name: string;
  href: string;
  icon?: string;
}

interface FooterProps {
  sections?: FooterSection[];
  brandName?: string;
  copyrightText?: string;
  socialLinks?: SocialLink[];
  className?: string;
}

export function Footer({
  sections = [
    {
      title: 'About',
      links: [
        { label: 'Our Story', href: '/about' },
        { label: 'Team', href: '/team' },
        { label: 'Careers', href: '/careers' }
      ]
    },
    {
      title: 'Community',
      links: [
        { label: 'Discord', href: '/discord' },
        { label: 'GitHub', href: '/github' },
        { label: 'Blog', href: '/blog' }
      ]
    },
    {
      title: 'Contact',
      links: [
        { label: 'Support', href: '/support' },
        { label: 'Help Center', href: '/help' },
        { label: 'Contact Us', href: '/contact' }
      ]
    }
  ],
  brandName = 'DevCollab',
  copyrightText = '© 2024 DevCollab. All rights reserved.',
  socialLinks = [
    { name: 'Twitter', href: '#' },
    { name: 'GitHub', href: '#' },
    { name: 'LinkedIn', href: '#' }
  ],
  className = ''
}: FooterProps) {
  return (
    <footer className={`bg-gray-50 px-6 py-12 mt-20 ${className}`}>
      <div className="max-w-6xl mx-auto">
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {sections.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold text-gray-900 mb-4">{section.title}</h4>
              <ul className="space-y-2 text-gray-600">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href={link.href} 
                      className="hover:text-gray-900 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-gray-200">
          <p className="text-gray-600 text-sm">{copyrightText}</p>
          
          {/* Social Links */}
          <div className="flex space-x-6 mt-4 sm:mt-0">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
              >
                <div className="w-5 h-5 bg-current rounded"></div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}