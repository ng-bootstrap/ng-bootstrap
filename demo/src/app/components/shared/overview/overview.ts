export interface NgbdOverviewSection {
  title: string;
  fragment: string;
}

export interface NgbdOverview {
  sections: { [name: string]: NgbdOverviewSection };
}
