import { Fingerprint, MapPin, Sprout, Factory, Leaf, Award, Apple, Link2, Package, Truck } from "lucide-react";

export const OIL_RUBRICS = [
  { key: "identification", icon: Fingerprint, title: "Identification", short: "Name, lot, expiry, packaging" },
  { key: "geography", icon: MapPin, title: "Geography", short: "Country, GPS, AOP/IGP, producer" },
  { key: "agricultural", icon: Sprout, title: "Agricultural", short: "Varieties, harvest, treatments" },
  { key: "process", icon: Factory, title: "Process", short: "Mill, pressing, filtration, bottling" },
  { key: "sustainability", icon: Leaf, title: "Sustainability", short: "Carbon, water, energy, score" },
  { key: "certifications", icon: Award, title: "Certifications", short: "Organic, AOP, Fair Trade, EUDR" },
  { key: "nutrition", icon: Apple, title: "Nutrition", short: "Calories, fats, instructions" },
  { key: "traceability", icon: Link2, title: "Traceability", short: "Farm → shelf, blockchain proof" },
] as const;

export const EXTRA_RUBRICS = [
  { key: "packaging", icon: Package, title: "Packaging", short: "Weight, variants, end of life" },
  { key: "shipping", icon: Truck, title: "Shipping", short: "Dispatch, reception, invoices" },
] as const;
