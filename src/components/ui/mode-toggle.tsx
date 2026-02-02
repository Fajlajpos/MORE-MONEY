"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const [theme, setTheme] = React.useState("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    document.documentElement.classList.toggle("dark");
  };

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      <svg className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" viewBox="0 0 24 24">
        <path fill="currentColor" d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5s5-2.24 5-5s-2.24-5-5-5zM12 15c-1.66 0-3-1.34-3-3s1.34-3 3-3s3 1.34 3 3s-1.34 3-3 3zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8z"/>
      </svg>
      <svg className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" viewBox="0 0 24 24">
        <path fill="currentColor" d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9s9-4.03 9-9c0-.46-.04-.92-.1-1.36c-.32.95-.98 1.77-1.84 2.37c-.86.6-1.9.99-3.06.99c-2.04 0-3.79-1.31-4.48-3.17C9.32 7.39 10.55 5.79 12 5.79c.99 0 1.88.49 2.47 1.23c.3-.17.61-.31.94-.42C14.46 3.49 13.28 3 12 3zm0 2.29c-1.01 0-1.91.43-2.54 1.1c-.63.67-1.02 1.57-1.02 2.61c0 1.93 1.57 3.5 3.5 3.5c1.28 0 2.4-.68 3.06-1.7c.33.2.68.34 1.06.41c-.04.35-.06.7-.06 1.05c0 3.31 2.69 6 6 6c.01 0 .02 0 .02 0c-1.03-.2-1.98-.68-2.75-1.36c-.77-.68-1.36-1.57-1.68-2.58c-1.29.58-2.78.8-4.32.18c-1.54-.62-2.73-1.84-3.3-3.37c-.57-1.53-.42-3.21.37-4.6c.79-1.39 2.1-2.39 3.63-2.61c.28-.04.56-.06.84-.06z"/>
      </svg>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
