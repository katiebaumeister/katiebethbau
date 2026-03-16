/**
 * Designer usage profiles — historical and runway associations for fabrics.
 */

import type { DesignerUsageProfile } from "@/lib/types";

export const designerProfiles: DesignerUsageProfile[] = [
  {
    id: "DP_SHIRTING_CLASSIC",
    name: "Classic Shirting",
    historical_designers: ["Brooks Brothers", "Turnbull & Asser", "Ralph Lauren"],
    runway_or_house_associations: ["Jil Sander", "The Row", "Prada"],
    usage_examples: ["Shirts", "Shirtdresses", "Crisp minimalist separates"],
  },
  {
    id: "DP_LINEN_RESORT",
    name: "Linen / Resort",
    historical_designers: ["Giorgio Armani", "Ralph Lauren", "Hermès"],
    runway_or_house_associations: ["Loro Piana", "Brunello Cucinelli", "Max Mara"],
    usage_examples: ["Summer suiting", "Resort dresses", "Relaxed tailoring"],
  },
  {
    id: "DP_SILK_FLUID",
    name: "Fluid Silk",
    historical_designers: ["Halston", "Madeleine Vionnet", "Narciso Rodriguez"],
    runway_or_house_associations: ["Saint Laurent", "The Row", "Celine"],
    usage_examples: ["Bias dresses", "Blouses", "Fluid eveningwear"],
  },
  {
    id: "DP_SILK_STRUCTURED",
    name: "Structured Silk Formal",
    historical_designers: ["Cristóbal Balenciaga", "Christian Dior"],
    runway_or_house_associations: ["Oscar de la Renta", "Carolina Herrera", "Givenchy"],
    usage_examples: ["Evening gowns", "Formal skirts", "Architectural dresses"],
  },
  {
    id: "DP_TAILORING_WOOL",
    name: "Wool Tailoring",
    historical_designers: ["Savile Row", "Yves Saint Laurent", "Giorgio Armani"],
    runway_or_house_associations: ["Tom Ford", "Max Mara", "Bottega Veneta"],
    usage_examples: ["Suits", "Coats", "Trousers", "Skirts"],
  },
  {
    id: "DP_TWEED_HERITAGE",
    name: "Tweed / Heritage",
    historical_designers: ["Coco Chanel", "Vivienne Westwood"],
    runway_or_house_associations: ["Chanel", "Burberry", "Erdem"],
    usage_examples: ["Skirt suits", "Coats", "Heritage tailoring"],
  },
  {
    id: "DP_DENIM_WORKWEAR",
    name: "Denim / Workwear",
    historical_designers: ["Levi Strauss", "Calvin Klein"],
    runway_or_house_associations: ["Diesel", "Balenciaga", "Givenchy"],
    usage_examples: ["Jeans", "Jackets", "Structured casualwear"],
  },
  {
    id: "DP_UTILITY_CANVAS",
    name: "Canvas / Utility",
    historical_designers: ["Military workwear traditions", "American workwear makers"],
    runway_or_house_associations: ["Carhartt WIP", "Sacai", "Margaret Howell"],
    usage_examples: ["Jackets", "Trousers", "Bags", "Utility garments"],
  },
  {
    id: "DP_CREPE_DAY_EVENING",
    name: "Crepe Day-to-Evening",
    historical_designers: ["Dior", "Givenchy", "Balenciaga"],
    runway_or_house_associations: ["Victoria Beckham", "Valentino", "Stella McCartney"],
    usage_examples: ["Dresses", "Trousers", "Blouses", "Minimal eveningwear"],
  },
  {
    id: "DP_SATIN_GLAMOUR",
    name: "Satin / Glamour",
    historical_designers: ["Jean Harlow era costume design", "Charles James"],
    runway_or_house_associations: ["Dolce & Gabbana", "Saint Laurent", "Versace"],
    usage_examples: ["Slip dresses", "Eveningwear", "Corsetry accents"],
  },
  {
    id: "DP_ORGANZA_COUTURE",
    name: "Organza / Couture Volume",
    historical_designers: ["Balenciaga", "Dior", "Pierre Cardin"],
    runway_or_house_associations: ["Giambattista Valli", "Elie Saab", "Armani Privé"],
    usage_examples: ["Volume overlays", "Formalwear", "Structured couture effects"],
  },
  {
    id: "DP_LACE_ROMANTIC",
    name: "Lace / Romantic",
    historical_designers: ["Valentino Garavani", "Christian Dior"],
    runway_or_house_associations: ["Valentino", "Alexander McQueen", "Dolce & Gabbana"],
    usage_examples: ["Evening dresses", "Veils", "Corsetry overlays", "Romantic blouses"],
  },
  {
    id: "DP_JERSEY_MODERN",
    name: "Jersey / Modern Ease",
    historical_designers: ["Coco Chanel", "Donna Karan"],
    runway_or_house_associations: ["Norma Kamali", "Rick Owens", "Alaïa"],
    usage_examples: ["Draped dresses", "Tops", "Body-conscious garments"],
  },
  {
    id: "DP_PERFORMANCE",
    name: "Performance / Technical",
    historical_designers: ["Sportswear innovation traditions"],
    runway_or_house_associations: ["Prada Linea Rossa", "Nike ACG", "Y-3"],
    usage_examples: ["Athletic wear", "Outerwear", "Technical fashion"],
  },
  {
    id: "DP_VELVET_OPULENT",
    name: "Velvet / Opulent",
    historical_designers: ["Fortuny", "Charles James"],
    runway_or_house_associations: ["Tom Ford", "Gucci", "Dries Van Noten"],
    usage_examples: ["Evening jackets", "Dresses", "Opulent tailoring"],
  },
  {
    id: "DP_BROCADE_FORMAL",
    name: "Brocade / Formal Ornament",
    historical_designers: ["Court dress traditions", "Dior"],
    runway_or_house_associations: ["Dolce & Gabbana", "Gucci", "Erdem"],
    usage_examples: ["Evening coats", "Formal dresses", "Statement separates"],
  },
  {
    id: "DP_OUTERWEAR_TECH",
    name: "Outerwear / Protective",
    historical_designers: ["Military outerwear traditions", "Expedition wear"],
    runway_or_house_associations: ["Burberry", "Moncler", "Stone Island"],
    usage_examples: ["Rainwear", "Parkas", "Protective outerwear"],
  },
];

export function getDesignerProfileById(id: string): DesignerUsageProfile | undefined {
  return designerProfiles.find((p) => p.id === id);
}
