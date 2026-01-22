export type Ticket = {
  id: string;
  created_at: string;
  description: string;
  is_public: boolean;
  category: string | null;
  sentiment: string | null;
  processed: boolean;
};
