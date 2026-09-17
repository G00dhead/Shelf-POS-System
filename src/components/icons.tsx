import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Activity01Icon,
  AlertCircleIcon,
  TriangleAlertIcon,
  ArrowRight01Icon,
  ArrowUpRight01Icon,
  Award01Icon,
  Money01Icon,
  BarChartIcon,
  BarcodeIcon as RawBarcodeIcon,
  BellIcon,
  Package01Icon,
  Building01Icon,
  Building02Icon,
  Calculator01Icon,
  Calendar01Icon,
  Camera01Icon,
  CheckIcon,
  CircleCheckIcon,
  CheckmarkCircle01Icon,
  Clock01Icon,
  CoinsDollarIcon,
  CpuIcon,
  CreditCardIcon,
  Delete01Icon,
  Dollar01Icon,
  Download01Icon,
  Edit02Icon,
  ExternalLinkIcon,
  EyeIcon,
  FileSpreadsheetIcon,
  File01Icon,
  FilterIcon,
  HardDriveIcon,
  InformationCircleIcon,
  LandmarkIcon,
  Layers01Icon,
  LayoutGridIcon,
  Logout01Icon,
  Mail01Icon,
  Menu01Icon,
  MessageSquareIcon,
  MinusSignIcon,
  MoreVerticalIcon,
  PackageCheckIcon,
  PackagePlusIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  PercentIcon,
  CallIcon,
  PlayIcon,
  Add01Icon,
  PrinterIcon,
  ReceiptIcon,
  RefreshCwIcon,
  RotateCcwIcon,
  RotateCwIcon,
  BarcodeScanIcon,
  Search01Icon,
  Settings01Icon,
  ShieldCheckIcon,
  ShoppingBag01Icon,
  SlidersHorizontalIcon,
  SmartPhone01Icon,
  SparklesIcon,
  SplitIcon,
  StarIcon,
  Store01Icon,
  Tag01Icon,
  ThumbsUpIcon,
  Delete02Icon,
  TrendingUpIcon,
  DeliveryTruck01Icon,
  UserIcon,
  UserGroupIcon,
  Wifi01Icon,
  Cancel01Icon,
  FlashIcon
} from '@hugeicons/core-free-icons';

export interface HugeIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  strokeWidth?: number;
  className?: string;
  color?: string;
}

export type LucideIcon = React.ForwardRefExoticComponent<HugeIconProps & React.RefAttributes<SVGSVGElement>>;

export const createHugeIcon = (iconDef: any, displayName: string): LucideIcon => {
  const Comp = React.forwardRef<SVGSVGElement, HugeIconProps>(
    ({ size, className = '', strokeWidth = 1.75, ...rest }, ref) => {
      return (
        <HugeiconsIcon
          ref={ref}
          icon={iconDef}
          size={size}
          strokeWidth={strokeWidth}
          className={className}
          {...rest}
        />
      );
    }
  );
  Comp.displayName = displayName;
  return Comp;
};

// Mapped icons from Hugeicons Pack
export const Activity = createHugeIcon(Activity01Icon, 'Activity');
export const AlertCircle = createHugeIcon(AlertCircleIcon, 'AlertCircle');
export const AlertTriangle = createHugeIcon(TriangleAlertIcon, 'AlertTriangle');
export const ArrowRight = createHugeIcon(ArrowRight01Icon, 'ArrowRight');
export const ArrowUpRight = createHugeIcon(ArrowUpRight01Icon, 'ArrowUpRight');
export const Award = createHugeIcon(Award01Icon, 'Award');
export const Banknote = createHugeIcon(Money01Icon, 'Banknote');
export const BarChart3 = createHugeIcon(BarChartIcon, 'BarChart3');
export const Barcode = createHugeIcon(RawBarcodeIcon, 'Barcode');
export const BarcodeIcon = Barcode;
export const Bell = createHugeIcon(BellIcon, 'Bell');
export const Boxes = createHugeIcon(Package01Icon, 'Boxes');
export const Building = createHugeIcon(Building01Icon, 'Building');
export const Building2 = createHugeIcon(Building02Icon, 'Building2');
export const Calculator = createHugeIcon(Calculator01Icon, 'Calculator');
export const Calendar = createHugeIcon(Calendar01Icon, 'Calendar');
export const Camera = createHugeIcon(Camera01Icon, 'Camera');
export const Check = createHugeIcon(CheckIcon, 'Check');
export const CheckCircle = createHugeIcon(CircleCheckIcon, 'CheckCircle');
export const CheckCircle2 = createHugeIcon(CheckmarkCircle01Icon, 'CheckCircle2');
export const ChevronRight = createHugeIcon(ArrowRight01Icon, 'ChevronRight');
export const Clock = createHugeIcon(Clock01Icon, 'Clock');
export const Coins = createHugeIcon(CoinsDollarIcon, 'Coins');
export const Cpu = createHugeIcon(CpuIcon, 'Cpu');
export const CreditCard = createHugeIcon(CreditCardIcon, 'CreditCard');
export const Delete = createHugeIcon(Delete01Icon, 'Delete');
export const DollarSign = createHugeIcon(Dollar01Icon, 'DollarSign');
export const Download = createHugeIcon(Download01Icon, 'Download');
export const Edit2 = createHugeIcon(Edit02Icon, 'Edit2');
export const ExternalLink = createHugeIcon(ExternalLinkIcon, 'ExternalLink');
export const Eye = createHugeIcon(EyeIcon, 'Eye');
export const FileSpreadsheet = createHugeIcon(FileSpreadsheetIcon, 'FileSpreadsheet');
export const FileText = createHugeIcon(File01Icon, 'FileText');
export const Filter = createHugeIcon(FilterIcon, 'Filter');
export const HardDrive = createHugeIcon(HardDriveIcon, 'HardDrive');
export const Info = createHugeIcon(InformationCircleIcon, 'Info');
export const Landmark = createHugeIcon(LandmarkIcon, 'Landmark');
export const Layers = createHugeIcon(Layers01Icon, 'Layers');
export const LayoutGrid = createHugeIcon(LayoutGridIcon, 'LayoutGrid');
export const LogOut = createHugeIcon(Logout01Icon, 'LogOut');
export const Mail = createHugeIcon(Mail01Icon, 'Mail');
export const Menu = createHugeIcon(Menu01Icon, 'Menu');
export const MessageSquare = createHugeIcon(MessageSquareIcon, 'MessageSquare');
export const Minus = createHugeIcon(MinusSignIcon, 'Minus');
export const MoreVertical = createHugeIcon(MoreVerticalIcon, 'MoreVertical');
export const Package = createHugeIcon(Package01Icon, 'Package');
export const PackageCheck = createHugeIcon(PackageCheckIcon, 'PackageCheck');
export const PackagePlus = createHugeIcon(PackagePlusIcon, 'PackagePlus');
export const PanelLeftClose = createHugeIcon(PanelLeftCloseIcon, 'PanelLeftClose');
export const PanelLeftOpen = createHugeIcon(PanelLeftOpenIcon, 'PanelLeftOpen');
export const Percent = createHugeIcon(PercentIcon, 'Percent');
export const Phone = createHugeIcon(CallIcon, 'Phone');
export const Play = createHugeIcon(PlayIcon, 'Play');
export const Plus = createHugeIcon(Add01Icon, 'Plus');
export const Printer = createHugeIcon(PrinterIcon, 'Printer');
export const Receipt = createHugeIcon(ReceiptIcon, 'Receipt');
export const RefreshCw = createHugeIcon(RefreshCwIcon, 'RefreshCw');
export const RotateCcw = createHugeIcon(RotateCcwIcon, 'RotateCcw');
export const RotateCw = createHugeIcon(RotateCwIcon, 'RotateCw');
export const Scan = createHugeIcon(BarcodeScanIcon, 'Scan');
export const Search = createHugeIcon(Search01Icon, 'Search');
export const Settings = createHugeIcon(Settings01Icon, 'Settings');
export const ShieldCheck = createHugeIcon(ShieldCheckIcon, 'ShieldCheck');
export const ShoppingBag = createHugeIcon(ShoppingBag01Icon, 'ShoppingBag');
export const Sliders = createHugeIcon(SlidersHorizontalIcon, 'Sliders');
export const SlidersHorizontal = createHugeIcon(SlidersHorizontalIcon, 'SlidersHorizontal');
export const Smartphone = createHugeIcon(SmartPhone01Icon, 'Smartphone');
export const Sparkles = createHugeIcon(SparklesIcon, 'Sparkles');
export const Split = createHugeIcon(SplitIcon, 'Split');
export const Star = createHugeIcon(StarIcon, 'Star');
export const Store = createHugeIcon(Store01Icon, 'Store');
export const Tag = createHugeIcon(Tag01Icon, 'Tag');
export const ThumbsUp = createHugeIcon(ThumbsUpIcon, 'ThumbsUp');
export const Trash2 = createHugeIcon(Delete02Icon, 'Trash2');
export const TrendingUp = createHugeIcon(TrendingUpIcon, 'TrendingUp');
export const Truck = createHugeIcon(DeliveryTruck01Icon, 'Truck');
export const User = createHugeIcon(UserIcon, 'User');
export const Users = createHugeIcon(UserGroupIcon, 'Users');
export const Wifi = createHugeIcon(Wifi01Icon, 'Wifi');
export const X = createHugeIcon(Cancel01Icon, 'X');
export const Zap = createHugeIcon(FlashIcon, 'Zap');
