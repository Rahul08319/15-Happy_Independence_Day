export interface QuoteItem {
  id: string;
  author: string;
  quote: string;
  category: "hero" | "visionary" | "wish";
}

export const PATRIOTIC_QUOTES: QuoteItem[] = [
  {
    id: "tagore",
    author: "Rabindranath Tagore",
    quote: "Where the mind is without fear and the head is held high; Into that heaven of freedom, my Father, let my country awake.",
    category: "visionary",
  },
  {
    id: "kalam",
    author: "Dr. A.P.J. Abdul Kalam",
    quote: "Let us sacrifice our today so that our children can have a better tomorrow.",
    category: "visionary",
  },
  {
    id: "bhagat",
    author: "Shaheed Bhagat Singh",
    quote: "They may kill me, but they cannot kill my ideas. They can crush my body, but they will not be able to crush my spirit.",
    category: "hero",
  },
  {
    id: "bose",
    author: "Netaji Subhas Chandra Bose",
    quote: "One individual may die for an idea, but that idea will, after his death, incarnate itself in a thousand lives.",
    category: "hero",
  },
  {
    id: "festive-1",
    author: "Patriotic Wish",
    quote: "May the glory of our tricolor flag shine ever bright and inspire every Indian heart with pride, honor, and courage. Happy Independence Day!",
    category: "wish",
  },
  {
    id: "festive-2",
    author: "Festive Blessing",
    quote: "Celebrating the boundless spirit of unity, freedom, and triumph of our motherland. Wishing you and your loved ones a blessed 15th August!",
    category: "wish",
  },
];
