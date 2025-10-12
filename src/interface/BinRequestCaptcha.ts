import { BinRequest } from "./BinRequest";
export interface BinRequestCaptcha extends BinRequest {
  turnstileToken: string;
}
