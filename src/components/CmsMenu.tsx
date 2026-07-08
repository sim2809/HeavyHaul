import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import { useNavMenu } from "@/integrations/wordpress/hooks";

/**
 * Renders a CMS-managed menu by location key (a WordPress registered menu location).
 * Usage: <CmsMenu location="footer_company" className="space-y-2" itemClassName="hover:text-primary" />
 * Note: WP native menus support nesting, but this only renders top-level items —
 * preserving the old flat-list-only behavior (the icon field also isn't wired up to
 * WP native menu items; it was only ever a Supabase-specific extension).
 */
export default function CmsMenu({
  location,
  className = "",
  itemClassName = "",
  as = "ul",
  fallback = null,
  onItemClick,
}: {
  location: string;
  className?: string;
  itemClassName?: string;
  as?: "ul" | "nav" | "div";
  fallback?: React.ReactNode;
  onItemClick?: () => void;
}) {
  const { data: items } = useNavMenu(location);

  if (items === undefined) return null; // still loading
  if (items.length === 0) return <>{fallback}</>;
  const Wrapper: any = as;

  return (
    <Wrapper className={className}>
      {items.map((it) => {
        const Icon = it.icon ? (Icons as any)[it.icon] : null;
        const inner = (
          <>
            {Icon && <Icon className="h-4 w-4 inline mr-1.5" />}
            {it.label}
          </>
        );
        const Item: any = as === "ul" ? "li" : "div";
        const isExternal = /^https?:\/\//.test(it.url) || it.open_in_new_tab;
        return (
          <Item key={it.id}>
            {isExternal ? (
              <a href={it.url} target={it.open_in_new_tab ? "_blank" : undefined} rel={it.open_in_new_tab ? "noopener noreferrer" : undefined} className={itemClassName} onClick={onItemClick}>{inner}</a>
            ) : (
              <Link to={it.url} className={itemClassName} onClick={onItemClick}>{inner}</Link>
            )}
          </Item>
        );
      })}
    </Wrapper>
  );
}
