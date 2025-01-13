import { toast } from "sonner"

export const useToast = ({ message }: { message: string }) => {
  return  toast(message) 
}