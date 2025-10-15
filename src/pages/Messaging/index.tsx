import React from "react";
import { ConversationList } from "./components/ConversationList";

export default function MessagingPage() {
  return (
    <div className="h-full w-full">
      <ConversationList />
    </div>
  );
}