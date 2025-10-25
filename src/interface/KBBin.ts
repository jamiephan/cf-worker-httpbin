import { HTTPMethod } from "./../const/HTTPMethod";
import { BinRequest } from "./BinRequest";
export interface KVBin extends BinRequest {
  token: string;
  ipAddress: string;
  method: HTTPMethod;
}
