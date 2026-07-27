export type TicketStatus = "Open" | "Resolved";
export type TicketPriority = "Low" | "Medium" | "High" | "Critical";

export type TicketUser = {
  name: string;
  code: string;
  role: string;
};

export type TicketAttachment = {
  name: string;
};

export type TicketMessage = {
  id: string;
  author: "requester" | "admin";
  text: string;
  timestamp: string;
  attachments?: TicketAttachment[];
};

export type TicketResolution = {
  respondedBy: string;
  note: string;
  timestamp: string;
};

export type SupportTicket = {
  ticketCode: string;
  user: TicketUser;
  category: string;
  latestDetail: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
  resolution?: TicketResolution;
};
