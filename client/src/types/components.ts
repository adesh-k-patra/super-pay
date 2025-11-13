/**
 * Global Component Type Definitions
 * Centralized type definitions for all UI components
 */

import { HTMLAttributes, ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';

// =============================================================================
// BASE TYPES
// =============================================================================

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type Variant = 'default' | 'primary' | 'secondary' | 'ghost' | 'outline' | 'link';
export type ColorVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';
export type Status = 'pending' | 'active' | 'completed' | 'rejected' | 'approved' | 'processing';

// =============================================================================
// ATOMS - BUTTON
// =============================================================================

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'link' | 'icon' | 'fab' | 'danger' | 'success' | 'outline';
  size?: Size;
  isLoading?: boolean;
  isDisabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  'data-testid'?: string;
}

// =============================================================================
// ATOMS - TYPOGRAPHY
// =============================================================================

export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'label';
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption' | 'overline';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  color?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
  truncate?: boolean;
  lines?: number;
  'data-testid'?: string;
}

// =============================================================================
// ATOMS - ICON
// =============================================================================

export interface IconProps {
  name: string;
  size?: Size;
  color?: string;
  className?: string;
  strokeWidth?: number;
  'data-testid'?: string;
}

// =============================================================================
// ATOMS - INPUT CONTROLS
// =============================================================================

export interface BaseInputProps {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  'data-testid'?: string;
}

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>, BaseInputProps {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
}

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, BaseInputProps {
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  minRows?: number;
  maxRows?: number;
}

export interface NumberInputProps extends Omit<TextInputProps, 'type'> {
  min?: number;
  max?: number;
  step?: number;
  showStepper?: boolean;
  formatValue?: (value: number) => string;
  precision?: number;
}

export interface PasswordInputProps extends Omit<TextInputProps, 'type'> {
  showToggle?: boolean;
  strengthIndicator?: boolean;
}

export interface SearchInputProps extends Omit<TextInputProps, 'type'> {
  onSearch?: (value: string) => void;
  debounceMs?: number;
  showClearButton?: boolean;
  suggestions?: SearchSuggestion[];
}

export interface SearchSuggestion {
  id: string;
  label: string;
  value: string;
  icon?: React.ReactNode;
}

// =============================================================================
// ATOMS - SELECT & PICKERS
// =============================================================================

export interface SelectOption<T = string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  isDisabled?: boolean;
}

export interface SelectProps<T = string> extends BaseInputProps {
  options: SelectOption<T>[];
  value?: T | T[];
  onChange: (value: T | T[]) => void;
  placeholder?: string;
  isMulti?: boolean;
  isSearchable?: boolean;
  isDisabled?: boolean;
  isClearable?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export interface AsyncSelectProps<T = string> extends Omit<SelectProps<T>, 'options'> {
  loadOptions: (inputValue: string) => Promise<SelectOption<T>[]>;
  cacheOptions?: boolean;
  defaultOptions?: SelectOption<T>[] | boolean;
}

export interface ComboBoxProps<T = string> extends BaseInputProps {
  options: SelectOption<T>[];
  value?: T;
  onChange: (value: T) => void;
  placeholder?: string;
  emptyMessage?: string;
  createable?: boolean;
  onCreate?: (value: string) => void;
}

// =============================================================================
// ATOMS - FORM CONTROLS
// =============================================================================

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>, BaseInputProps {
  indeterminate?: boolean;
}

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>, BaseInputProps {
  // Single radio props
}

export interface RadioGroupProps extends BaseInputProps {
  options: RadioOption[];
  value?: string;
  onChange: (value: string) => void;
  name: string;
  orientation?: 'horizontal' | 'vertical';
}

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>, BaseInputProps {
  size?: 'sm' | 'md' | 'lg';
}

// =============================================================================
// ATOMS - FEEDBACK
// =============================================================================

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline' | 'secondary';
  size?: Size;
  dot?: boolean;
  pulse?: boolean;
  rounded?: boolean;
}

export interface SpinnerProps {
  size?: Size;
  color?: string;
  thickness?: number;
  'data-testid'?: string;
}

export interface ProgressProps {
  value: number;
  max?: number;
  variant?: 'linear' | 'circular';
  size?: Size;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  showLabel?: boolean;
  indeterminate?: boolean;
  'data-testid'?: string;
}

export interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  count?: number;
  animation?: 'pulse' | 'wave' | 'none';
  'data-testid'?: string;
}

// =============================================================================
// MOLECULES - CARD
// =============================================================================

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass' | 'gradient' | 'neu';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hoverable?: boolean;
  clickable?: boolean;
  colorScheme?: 'default' | 'red' | 'green' | 'blue' | 'purple' | 'yellow' | 'teal';
  'data-testid'?: string;
}

export interface InfoCardProps extends CardProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  value?: string | number;
  footer?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export interface ProductCardProps extends CardProps {
  image: string;
  title: string;
  price: number;
  currency?: string;
  rating?: number;
  reviews?: number;
  badge?: string;
  onAddToCart?: () => void;
  onQuickView?: () => void;
}

export interface TransactionCardProps extends CardProps {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  date: Date;
  status?: Status;
  category?: string;
  icon?: React.ReactNode;
}

export interface ExpandableCardProps extends CardProps {
  header: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  onExpandChange?: (expanded: boolean) => void;
}

// =============================================================================
// MOLECULES - AVATAR
// =============================================================================

export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  initials?: string;
  size?: Size;
  shape?: 'circle' | 'square' | 'rounded';
  status?: 'online' | 'offline' | 'away' | 'busy';
  badge?: React.ReactNode;
  borderColor?: string;
  'data-testid'?: string;
}

export interface AvatarGroupProps {
  avatars: AvatarProps[];
  max?: number;
  size?: Size;
  spacing?: 'tight' | 'normal' | 'loose';
  'data-testid'?: string;
}

// =============================================================================
// MOLECULES - FORM FIELD
// =============================================================================

export interface FormFieldProps {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
  tooltip?: string;
  children: React.ReactNode;
  orientation?: 'vertical' | 'horizontal';
  'data-testid'?: string;
}

export interface FormRowProps extends HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
}

export interface FormGroupProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

// =============================================================================
// MOLECULES - DATE & TIME
// =============================================================================

export interface DatePickerProps extends BaseInputProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  format?: string;
  disabled?: (date: Date) => boolean;
  highlightDates?: Date[];
}

export interface DateRangePickerProps extends BaseInputProps {
  from?: Date;
  to?: Date;
  onSelect: (range: { from?: Date; to?: Date }) => void;
  minDate?: Date;
  maxDate?: Date;
  numberOfMonths?: number;
}

export interface TimePickerProps extends BaseInputProps {
  value?: string;
  onChange: (time: string) => void;
  format?: '12h' | '24h';
  step?: number;
  minTime?: string;
  maxTime?: string;
}

// =============================================================================
// MOLECULES - FILE UPLOAD
// =============================================================================

export interface FileUploadProps extends BaseInputProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  onUpload: (files: File[]) => void;
  onRemove?: (file: File) => void;
  dragAndDrop?: boolean;
  showPreview?: boolean;
  previewType?: 'list' | 'grid';
}

// =============================================================================
// MOLECULES - TOOLTIP & POPOVER
// =============================================================================

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  delay?: number;
  arrow?: boolean;
  maxWidth?: number;
  'data-testid'?: string;
}

export interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  offset?: number;
  arrow?: boolean;
  closeOnOutsideClick?: boolean;
  'data-testid'?: string;
}

// =============================================================================
// ORGANISMS - HEADER
// =============================================================================

export interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  badge?: number;
  children?: NavigationItem[];
  onClick?: () => void;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  isRead: boolean;
  type?: 'info' | 'success' | 'warning' | 'error';
  icon?: React.ReactNode;
  onClick?: () => void;
}

export interface UserMenuProps {
  user: {
    name: string;
    email?: string;
    avatar?: string;
  };
  menuItems: {
    label: string;
    icon?: React.ReactNode;
    href?: string;
    onClick?: () => void;
    divider?: boolean;
  }[];
}

export interface HeaderProps {
  variant?: 'default' | 'transparent' | 'sticky' | 'fixed' | 'glass';
  logo?: React.ReactNode;
  navigation?: NavigationItem[];
  searchBar?: boolean;
  notifications?: NotificationItem[];
  userMenu?: UserMenuProps;
  actions?: React.ReactNode;
  height?: 'sm' | 'md' | 'lg';
  'data-testid'?: string;
}

// =============================================================================
// ORGANISMS - SIDEBAR
// =============================================================================

export interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  badge?: number | string;
  children?: SidebarItem[];
  onClick?: () => void;
}

export interface SidebarProps {
  items: SidebarItem[];
  collapsed?: boolean;
  onToggle?: (collapsed: boolean) => void;
  variant?: 'permanent' | 'temporary' | 'collapsible';
  position?: 'left' | 'right';
  width?: number;
  collapsedWidth?: number;
  'data-testid'?: string;
}

// =============================================================================
// ORGANISMS - DATA TABLE
// =============================================================================

export interface Column<T = any> {
  id: string;
  header: string | React.ReactNode;
  accessor: keyof T | ((row: T) => any);
  cell?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: number | string;
  minWidth?: number;
  maxWidth?: number;
  align?: 'left' | 'center' | 'right';
  sticky?: boolean;
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export interface SortingConfig {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export interface FilteringConfig {
  filters: Record<string, any>;
  onFilterChange: (filters: Record<string, any>) => void;
}

export interface SelectionConfig<T = any> {
  selectedRows: T[];
  onSelectionChange: (rows: T[]) => void;
  isRowSelectable?: (row: T) => boolean;
}

export interface TableAction<T = any> {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: T) => void;
  isDisabled?: (row: T) => boolean;
  variant?: 'default' | 'danger';
}

export interface DataTableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  pagination?: PaginationConfig;
  sorting?: SortingConfig;
  filtering?: FilteringConfig;
  selection?: SelectionConfig<T>;
  actions?: TableAction<T>[];
  rowActions?: TableAction<T>[];
  virtualization?: boolean;
  stickyHeader?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  'data-testid'?: string;
}

// =============================================================================
// ORGANISMS - PAGINATION
// =============================================================================

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  showFirstLast?: boolean;
  showPageSize?: boolean;
  showPageInfo?: boolean;
  siblingCount?: number;
  'data-testid'?: string;
}

// =============================================================================
// ORGANISMS - BREADCRUMBS
// =============================================================================

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  maxItems?: number;
  itemsBeforeCollapse?: number;
  itemsAfterCollapse?: number;
  'data-testid'?: string;
}

// =============================================================================
// ORGANISMS - TABS
// =============================================================================

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
  badge?: number | string;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'pills' | 'underline' | 'enclosed';
  size?: 'sm' | 'md' | 'lg';
  fitted?: boolean;
  'data-testid'?: string;
}

// =============================================================================
// ORGANISMS - TIMELINE
// =============================================================================

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  timestamp?: Date;
  icon?: React.ReactNode;
  status?: 'completed' | 'active' | 'pending' | 'error';
  content?: React.ReactNode;
}

export interface TimelineProps {
  items: TimelineItem[];
  variant?: 'default' | 'alternate' | 'left' | 'right';
  showConnector?: boolean;
  'data-testid'?: string;
}

// =============================================================================
// ORGANISMS - WIZARD / STEPPER
// =============================================================================

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  isValid?: boolean;
  isOptional?: boolean;
  canSkip?: boolean;
}

export interface WizardProps {
  steps: WizardStep[];
  currentStep: number;
  onStepChange: (step: number) => void;
  onComplete: () => void;
  onCancel?: () => void;
  orientation?: 'horizontal' | 'vertical';
  showStepNumber?: boolean;
  allowStepClick?: boolean;
  'data-testid'?: string;
}

// =============================================================================
// ORGANISMS - CALENDAR
// =============================================================================

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
  description?: string;
}

export interface CalendarProps {
  mode?: 'single' | 'multiple' | 'range';
  selected?: Date | Date[] | { from?: Date; to?: Date };
  onSelect: (date: Date | Date[] | { from?: Date; to?: Date } | undefined) => void;
  disabled?: (date: Date) => boolean;
  minDate?: Date;
  maxDate?: Date;
  events?: CalendarEvent[];
  showOutsideDays?: boolean;
  showWeekNumbers?: boolean;
  numberOfMonths?: number;
  'data-testid'?: string;
}

// =============================================================================
// ORGANISMS - CAROUSEL
// =============================================================================

export interface CarouselProps {
  items: React.ReactNode[];
  autoPlay?: boolean;
  interval?: number;
  showIndicators?: boolean;
  showControls?: boolean;
  loop?: boolean;
  itemsPerView?: number;
  gap?: number;
  orientation?: 'horizontal' | 'vertical';
  'data-testid'?: string;
}

// =============================================================================
// OVERLAYS - MODAL / DIALOG
// =============================================================================

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  centered?: boolean;
  scrollBehavior?: 'inside' | 'outside';
  'data-testid'?: string;
}

export interface AlertDialogProps extends Omit<ModalProps, 'children'> {
  variant?: 'info' | 'warning' | 'danger' | 'success';
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  isDestructive?: boolean;
}

// =============================================================================
// OVERLAYS - DRAWER
// =============================================================================

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  position?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'full';
  children: React.ReactNode;
  title?: string;
  footer?: React.ReactNode;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  'data-testid'?: string;
}

// =============================================================================
// OVERLAYS - TOAST
// =============================================================================

export interface ToastProps {
  id?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  title?: string;
  description: string;
  duration?: number;
  isClosable?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  'data-testid'?: string;
}

// =============================================================================
// OVERLAYS - CONTEXT MENU
// =============================================================================

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  shortcut?: string;
  divider?: boolean;
  children?: ContextMenuItem[];
}

export interface ContextMenuProps {
  trigger: React.ReactNode;
  items: ContextMenuItem[];
  'data-testid'?: string;
}

// =============================================================================
// LAYOUT COMPONENTS
// =============================================================================

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: boolean;
  centered?: boolean;
}

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  responsive?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  direction?: 'horizontal' | 'vertical';
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  wrap?: boolean;
}

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'colored' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type ComponentVariant = 'default' | 'primary' | 'secondary' | 'ghost' | 'outline';
export type ColorScheme = 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'teal' | 'gray';
export type Placement = 'top' | 'bottom' | 'left' | 'right' | 'auto';
export type Orientation = 'horizontal' | 'vertical';

// Helper type for extracting data-testid
export type WithTestId<T = {}> = T & { 'data-testid'?: string };
