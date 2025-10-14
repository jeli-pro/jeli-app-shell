import { useParams } from "react-router-dom";
import { ConversationList } from "./components/ConversationList";
import { ContactProfile } from "./components/ContactProfile";

export default function MessagingPage() {
  const { conversationId } = useParams<{ conversationId: string }>();

  return (
    <div className="h-full w-full flex bg-background">
        <ConversationList />
        <ContactProfile conversationId={conversationId} />
    </div>
  );
}