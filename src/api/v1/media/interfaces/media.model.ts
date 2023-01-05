export interface Media {
  id: string;
  originalName: string;
  description?: string;
  bucket?: string;
  key?: string;
  url: string;
  type: string;
}
