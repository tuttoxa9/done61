import { ChevronRight, Home } from "lucide-react";
import { Link } from "wouter";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="py-4" itemScope itemType="https://schema.org/BreadcrumbList">
      <div className="container-custom">
        <ol className="flex items-center space-x-2 text-sm">
          <li itemScope itemProp="itemListElement" itemType="https://schema.org/ListItem">
            <Link href="/">
              <div className="flex items-center text-muted-foreground hover:text-primary transition-colors">
                <Home className="h-4 w-4" />
                <span className="sr-only" itemProp="name">Главная</span>
              </div>
            </Link>
            <meta itemProp="position" content="1" />
          </li>

          {items.map((item, index) => (
            <li
              key={index}
              className="flex items-center"
              itemScope
              itemProp="itemListElement"
              itemType="https://schema.org/ListItem"
            >
              <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
              {item.href ? (
                <Link href={item.href}>
                  <span
                    className="text-muted-foreground hover:text-primary transition-colors"
                    itemProp="name"
                  >
                    {item.label}
                  </span>
                </Link>
              ) : (
                <span className="text-foreground font-medium" itemProp="name">
                  {item.label}
                </span>
              )}
              <meta itemProp="position" content={String(index + 2)} />
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
