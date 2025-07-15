"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import {
  MoreHorizontal,
  Edit,
  Copy,
  Send,
  Trash2,
} from "lucide-react";

interface InvoiceActionsDropdownProps {
  invoiceId: string;
}

export function InvoiceActionsDropdown({ invoiceId }: InvoiceActionsDropdownProps) {
  const handleSendClick = () => {
    const sendButton = document.querySelector(
      "[data-testid='send-invoice-button']",
    ) as HTMLButtonElement;
    sendButton?.click();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="border-0 shadow-sm"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem>
          <Edit className="mr-2 h-4 w-4" />
          Edit Invoice
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSendClick}>
          <Send className="mr-2 h-4 w-4" />
          Send to Client
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
