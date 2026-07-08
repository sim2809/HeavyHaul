import { ReactNode, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Phone, Menu, X, ChevronDown, Facebook, Instagram, Linkedin, Youtube, Twitter } from "lucide-react";
import Logo from "./Logo";
import { StickyCallBar, TopAlertStrip, PHONE, DISPLAY } from "./StickyCall";
import ScrollToTop from "./ScrollToTop";
import LiveActivity from "./LiveActivity";
import ExitIntentPopup from "./ExitIntentPopup";
import CmsMenu from "./CmsMenu";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useSiteContent } from "@/hooks/useSiteContent";


import { categories } from "@/data/categories";
import { cn } from "@/lib/utils";

const Layout = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const loc = useLocation();
  const settings = useSiteSettings();
  const { get } = useSiteContent();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopAlertStrip />

      <header className="bg-secondary text-secondary-foreground border-b border-white/5 sticky top-0 z-40">
        <div className="container-tight flex items-center justify-between gap-4 h-14 lg:h-16">
          <Logo />



          <nav className="hidden lg:flex items-center gap-7 text-sm font-bold uppercase tracking-wider">
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button className="flex items-center gap-1 hover:text-primary transition-colors py-3">
                {get("header","services_label","Services")} <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {servicesOpen && (
                <div className="absolute left-0 top-full w-[640px]">
                  <div className="bg-white text-secondary rounded-md shadow-card border border-border p-2 max-h-[70vh] overflow-y-auto">
                    {/* Featured: Tractor Shipping */}
                    <Link
                      to="/services/agricultural-equipment-transport/tractor-transport"
                      className="group flex items-center gap-3 px-4 py-3 rounded bg-primary/10 hover:bg-primary hover:text-primary-foreground border border-primary/30 transition-colors mb-2"
                    >
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded bg-primary text-primary-foreground text-[10px] font-extrabold uppercase tracking-widest">{get("header","featured_service_badge","New")}</span>
                      <span className="min-w-0">
                        <span className="block font-sans font-bold text-[15px] leading-tight">{get("header","featured_service_title","Tractor Shipping Services")}</span>
                        <span className="block text-[11px] text-muted-foreground group-hover:text-primary-foreground/80 mt-0.5">{get("header","featured_service_desc","Compact, row-crop, 4WD & high-HP tractors nationwide")}</span>
                      </span>
                    </Link>
                    <div className="grid grid-cols-2">
                    {categories.map((c) => {
                      const taglines: Record<string, string> = {
                        "construction-equipment-transport": "Excavators, dozers, cranes & more",
                        "agricultural-equipment-transport": "Combines, tractors & farm machinery",
                        "industrial-machinery-transport": "CNC, generators & factory equipment",
                        "heavy-duty-truck-transport": "Semis, dump trucks & vocational rigs",
                        "canada-shipping-service": "Cross-border hauls to Canada",
                        "mexico-shipping-service": "Cross-border hauls to Mexico",
                        "catastrophic-recovery": "Accident & disaster recovery",
                        "rigging-and-lifting-service": "Crane lifts & precision rigging",
                        "heavy-machinery-towing": "24/7 heavy equipment towing",
                        "pilot-car-service": "Escort & pilot car coordination",
                        "partial-load-shipping": "LTL & shared-trailer hauls",
                      };
                      return (
                        <Link
                          key={c.slug}
                          to={`/services/${c.slug}`}
                          className="group px-4 py-3 rounded hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          <div className="font-sans font-semibold text-[15px] leading-tight">{c.name}</div>
                          <div className="text-[11px] text-muted-foreground group-hover:text-primary-foreground/80 font-normal mt-1">
                            {taglines[c.slug] ?? "Nationwide heavy haul"}
                          </div>
                        </Link>
                      );
                    })}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div
              className="relative"
              onMouseEnter={() => setAboutOpen(true)}
              onMouseLeave={() => setAboutOpen(false)}
            >
              <button className="flex items-center gap-1 hover:text-primary transition-colors py-3">
                {get("header","about_label","About")} <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {aboutOpen && (
                <div className="absolute left-0 top-full w-[240px]">
                  <div className="bg-white text-secondary rounded-md shadow-card border border-border p-2">
                    {[
                      ["/about#who-we-are","Who We Are"],
                      ["/about#our-team","Our Team"],
                      ["/about#states-we-serve","States We Serve"],
                      ["/about#contact-us","Contact Us"],
                    ].map(([to,label]) => (
                      <Link key={to} to={to} className="block px-4 py-2.5 rounded font-sans font-semibold text-[14px] hover:bg-primary hover:text-primary-foreground transition-colors">
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <CmsMenu
              location="header_primary"
              as="div"
              className="flex items-center gap-7"
              itemClassName="hover:text-primary transition-colors"
              fallback={
                <>
                  <NavLink to="/blog" className={({isActive}) => cn("hover:text-primary transition-colors", isActive && "text-primary")}>{get("header","blog_label","News & Guides")}</NavLink>
                </>
              }
            />
            <Link to="/contact#quote" className="bg-gradient-amber text-secondary px-4 py-2 rounded-md shadow-cta hover:brightness-110 transition">
              {get("header","cta_label","Get Quote")}
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <a href={`tel:${settings.phone_primary}`} className="hidden sm:flex items-center gap-2.5 group">
              <span className="h-10 w-10 rounded-md bg-gradient-amber flex items-center justify-center shadow-cta">
                <Phone className="h-5 w-5 text-secondary" />
              </span>
              <span className="leading-tight">
                <span className="block text-[9px] uppercase tracking-widest text-white/55">{get("header","tagline","24/7 Dispatch")}</span>
                <span className="block stencil text-base lg:text-lg text-primary group-hover:text-primary-glow">{settings.phone_primary_display}</span>
              </span>
            </a>
            <button
              className="lg:hidden p-2 text-white"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden border-t border-white/10 bg-secondary">
            <div className="container-tight py-4 space-y-1">
              <div className="py-1">
                <div className="text-[10px] uppercase tracking-widest text-primary font-bold pt-2 pb-1">Services</div>
                <Link to="/services/agricultural-equipment-transport/tractor-transport" className="block py-2 text-sm font-bold pl-2 text-primary" onClick={() => setOpen(false)}>
                  ★ Tractor Shipping Services
                </Link>
                {categories.map((c) => (
                  <Link key={c.slug} to={`/services/${c.slug}`} className="block py-2 text-sm font-semibold pl-2 hover:text-primary" onClick={() => setOpen(false)}>
                    {c.name}
                  </Link>
                ))}
              </div>
              <div className="py-1">
                <div className="text-[10px] uppercase tracking-widest text-primary font-bold pt-2 pb-1">About</div>
                {[
                  ["/about#who-we-are","Who We Are"],
                  ["/about#our-team","Our Team"],
                  ["/about#states-we-serve","States We Serve"],
                  ["/about#contact-us","Contact Us"],
                ].map(([to,label]) => (
                  <Link key={to} to={to} className="block py-2 text-sm font-semibold pl-2 hover:text-primary" onClick={() => setOpen(false)}>{label}</Link>
                ))}
              </div>
              <Link to="/blog" className="block py-2 font-bold uppercase tracking-wider text-sm" onClick={() => setOpen(false)}>News & Guides</Link>
              <Link to="/contact#quote" className="block py-2 font-bold uppercase tracking-wider text-sm text-primary" onClick={() => setOpen(false)}>Get Quote</Link>
            </div>
          </div>
        )}
      </header>

      <div className="h-1.5 bg-gradient-stripe" aria-hidden />

      <main className="flex-1">{children}</main>

      <Footer />
      <StickyCallBar />
      <ScrollToTop />
      <LiveActivity />
      <ExitIntentPopup />

    </div>
  );
};

const socialIcons: Record<string, any> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  x: Twitter,
  twitter: Twitter,
};

const Footer = () => {
  const s = useSiteSettings();
  const { get } = useSiteContent();
  const socials = Object.entries(s.social_links).filter(([, url]) => !!url);
  return (
    <footer className="bg-secondary text-secondary-foreground border-t border-white/10 pt-14 pb-24 md:pb-10">
      <div className="container-tight grid md:grid-cols-5 gap-10 text-sm">
        <div className="md:col-span-2">
          <Logo size="lg" />

          <p className="mt-4 text-white/60 max-w-sm">
            {s.footer_content || get("footer","description","Nationwide heavy haul, oversize load, and equipment transport, built on safety, speed, and straight talk.")}
          </p>
          <a href={`tel:${s.phone_primary}`} className="mt-5 inline-flex items-center gap-3 group">
            <span className="h-11 w-11 rounded-md bg-gradient-amber flex items-center justify-center shadow-cta">
              <Phone className="h-5 w-5 text-secondary" />
            </span>
            <span>
              <span className="block text-[10px] uppercase tracking-widest text-white/55">{get("footer","call_label","Call 24/7")}</span>
              <span className="block stencil text-xl text-primary group-hover:text-primary-glow">{s.phone_primary_display}</span>
            </span>
          </a>
          {s.email && (
            <a href={`mailto:${s.email}`} className="mt-3 block text-xs text-white/60 hover:text-primary">{s.email}</a>
          )}
          {s.address && <p className="mt-2 text-xs text-white/55 max-w-sm">{s.address}</p>}
          {socials.length > 0 && (
            <div className="mt-4 flex gap-2">
              {socials.map(([key, url]) => {
                const Icon = socialIcons[key.toLowerCase()] || Facebook;
                return (
                  <a key={key} href={url} target="_blank" rel="noopener noreferrer"
                    className="h-9 w-9 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-primary hover:border-primary transition-colors"
                    aria-label={key}>
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          )}
        </div>
        <div>
          <p className="font-display text-base uppercase mb-3 text-primary">{get("footer","services_heading","Services")}</p>
          <ul className="space-y-2 text-white/70">
            {categories.map((c) => (
              <li key={c.slug}><Link to={`/services/${c.slug}`} className="hover:text-primary">{c.short}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-display text-base uppercase mb-3 text-primary">{get("footer","company_heading","Company")}</p>
          <CmsMenu
            location="footer_company"
            className="space-y-2 text-white/70"
            itemClassName="hover:text-primary"
            fallback={
              <ul className="space-y-2 text-white/70">
                <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
                <li><Link to="/blog" className="hover:text-primary">News & Guides</Link></li>
                <li><Link to="/contact#quote" className="hover:text-primary">Get A Quote</Link></li>
              </ul>
            }
          />
        </div>
        <div>
          <p className="font-display text-base uppercase mb-3 text-primary">{get("footer","resources_heading","Resources")}</p>
          <CmsMenu
            location="footer_resources"
            className="space-y-1.5 text-white/60"
            itemClassName="hover:text-primary"
            fallback={
              <ul className="space-y-1.5 text-white/60">
                <li>DOT Compliant</li>
                <li>Fully Insured</li>
                <li>MC & USDOT Authority</li>
                <li>Cargo Insurance Up To $250K</li>
              </ul>
            }
          />
        </div>
      </div>
      <div className="container-tight mt-10 pt-6 border-t border-white/10 text-xs text-white/45 flex flex-wrap justify-between gap-2">
        <p>{s.copyright_text || `© ${new Date().getFullYear()} ${s.company_name}. All rights reserved.`}</p>
        <p>{get("footer","tagline","heavyhaulgroup.com · Nationwide Service")}</p>
      </div>
    </footer>
  );
};

export default Layout;
