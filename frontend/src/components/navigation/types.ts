// Navigation types and interfaces (Interface Segregation Principle)
export interface NavigationItem {
  id: string;
  label: string;
  icon?: string;
  path?: string;
  isActive?: boolean;
  children?: NavigationItem[];
}

export interface NavigationProps {
  items: NavigationItem[];
  onItemClick?: (item: NavigationItem) => void;
  className?: string;
}

export interface BreadcrumbProps extends NavigationProps {
  currentPath?: string;
  showIcons?: boolean;
}