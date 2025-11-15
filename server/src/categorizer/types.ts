export type CategoryName =
  | "interested"
  | "not_interested"
  | "follow_up"
  | "job"
  | "invoice"
  | "spam"
  | "unknown";

export interface Rule {
  id: string;
  name?: string;
  category: CategoryName;
  priority?: number; // higher = earlier
  // either keywords OR regex (regex has precedence if both present)
  keywords?: string[]; // case-insensitive substring match
  regex?: string; // JS regex string, no flags (we'll use 'i')
  headers?: { [headerName: string]: string[] }; // header name -> substrings to match
  minConfidence?: number; // reserved for future, unused now
}

