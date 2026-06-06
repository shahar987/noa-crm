export interface Product {
  id: string;
  name: string;
}

export interface ProgressPhoto {
  id: string;
  date: string;
  label: string;
  driveFileId?: string;
  url?: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  since: string;
  creams: string[];
  notes: string;
  nextAppt?: string;
  photos: ProgressPhoto[];
}
