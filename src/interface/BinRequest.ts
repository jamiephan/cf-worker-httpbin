export interface BinRequest {
  statusCode: number;
  header: Array<{ name: string; value: string }>;
  body: string;
}
