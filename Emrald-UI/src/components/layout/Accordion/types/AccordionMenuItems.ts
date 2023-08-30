export interface AccordionMenuItemType {
  type: string;
  data: any[];
}

export interface AccordionMenuList {
  panels: AccordionMenuItemType[];
}

export interface AccordionMenuListProps {
  item: AccordionMenuItemType;
}