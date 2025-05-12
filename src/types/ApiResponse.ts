import { Message } from "@/model/User";

export interface ApiResponse {
    success: boolean;
    message: string;
    isAcceptingMesage?: boolean;
    messages?: Array<Message>;
}