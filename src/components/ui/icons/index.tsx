import {
  CheckCircle,
  Clipboard,
  ClipboardCheck,
  Contact,
  ExternalLink,
  Gift,
  Instagram,
  Laptop,
  Loader2,
  LogOut,
  Menu,
  Moon,
  Package,
  Pencil,
  Search,
  Settings,
  ShoppingBag,
  SunMedium,
  Trash2,
  Truck,
  Twitter,
  Undo,
  type Icon as LucideIcon,
} from "lucide-react"

import { Facebook } from "./facebook"
import { GitHub } from "./github"
import { Logo } from "./logo"

export type Icon = LucideIcon

export const Icons = {
  externalLink: ExternalLink,
  clipboard: Clipboard,
  clipboardCheck: ClipboardCheck,
  logout: LogOut,
  gift: Gift,
  contact: Contact,
  package: Package,
  undo: Undo,
  check: CheckCircle,
  remove: Trash2,
  pencil: Pencil,
  settings: Settings,
  menu: Menu,
  sun: SunMedium,
  moon: Moon,
  laptop: Laptop,
  twitter: Twitter,
  truck: Truck,
  bag: ShoppingBag,
  search: Search,
  loader: Loader2,
  logo: Logo,
  github: GitHub,
  facebook: Facebook,
  instagram: Instagram,
}
