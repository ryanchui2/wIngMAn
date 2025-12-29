'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CreateDatePopup from '../components/CreateDatePopup';

interface Message {
  id: string;
  role: string;
  content: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDatePopup, setShowDatePopup] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (status !== 'loading' && !session) {
      router.push('/login');
    }
  }, [session, status, router]);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      if (!session) return;

      try {
        const response = await fetch('/api/conversations');
        const data = await response.json();

        if (response.ok) {
          setConversations(data.conversations);
        }
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchConversations();
    }
  }, [session]);

  const handleCreateDate = async (name: string) => {
    try {
      const response = await fetch('/api/dates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          conversationId: selectedConversationId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to dates page to see the newly created date
        router.push('/dates');
      } else {
        alert('Failed to create date');
      }
    } catch (error) {
      console.error('Failed to create date:', error);
      alert('Failed to create date');
    }
  };

  // Show loading state
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e2c0d7] to-white flex items-center justify-center">
        <p className="text-xl font-mono">Loading...</p>
      </div>
    );
  }

  // If not logged in, don't render
  if (!session) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e2c0d7] to-white px-8 py-16">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-black hover:underline font-mono font-bold uppercase text-sm"
        >
          ← Back to Home
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-black text-center mb-12 text-black tracking-tighter">
          HISTORY
        </h1>

        {/* Conversations List */}
        {conversations.length === 0 ? (
          <div className="bg-white border-4 border-black p-8 text-center">
            <p className="text-lg font-mono text-gray-600">
              No conversations yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">

            {/* TODO: Create a component for conversation cards later */}

            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className="bg-white border-4 border-black p-6"
              >
                <Link
                  href={`/?conversationId=${conversation.id}`}
                  className="block hover:opacity-80 transition-opacity"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-bold mb-2 font-mono break-words">
                        {conversation.title}
                      </h2>
                      <p className="text-sm text-gray-600 font-mono">
                        {conversation.messages.length} message{conversation.messages.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-gray-500 font-mono uppercase whitespace-nowrap">
                        {new Date(conversation.updatedAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-400 font-mono whitespace-nowrap">
                        {new Date(conversation.updatedAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  {/* Preview first message */}
                  {conversation.messages.length > 0 && (
                    <div className="mt-4 pt-4 border-t-2 border-gray-200">
                      <p className="text-sm text-gray-700 line-clamp-1">
                        {conversation.messages[0].content.length > 100
                          ? conversation.messages[0].content.slice(0, 100) + '...'
                          : conversation.messages[0].content}
                      </p>
                    </div>
                  )}
                </Link>

                {/* Create Date Button */}
                <div className="mt-4 pt-4 border-t-2 border-gray-200">
                  <button
                    onClick={() => {
                      setSelectedConversationId(conversation.id);
                      setShowDatePopup(true);
                    }}
                    className="block w-full px-4 py-3 bg-black text-white border-4 border-black hover:bg-white hover:text-black transition-colors font-mono font-bold uppercase text-center text-sm"
                  >
                    Date
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Date Popup */}
      {showDatePopup && (
        <CreateDatePopup
          conversationId={selectedConversationId || undefined}
          onClose={() => {
            setShowDatePopup(false);
            setSelectedConversationId(null);
          }}
          onConfirm={handleCreateDate}
        />
      )}
    </div>
  );
}