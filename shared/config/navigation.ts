export const navigationItems = [
  { href: "/dashboard", label: "Tableau de bord", enabled: true },
  { href: "/settings", label: "Paramètres", enabled: true },
  { href: "/settings/referentials", label: "Référentiels", enabled: true },
  { href: "/media", label: "Médias", enabled: true },
  { href: "/source-sheets", label: "Fiches sources", enabled: true },
  { href: "/planning", label: "Planning", enabled: false },
  { href: "/validation", label: "Validation", enabled: false },
] as const;
