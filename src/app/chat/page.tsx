"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, LockKeyhole, Send, UserPlus, Users } from "lucide-react";
import CryptoJS from "crypto-js";

const SECRET_KEY = "PL_OS_SECRET_SECURE_KEY_2026";

type UserItem = { id: number; username: string };
type MessageItem = { id: number; sender: string; senderId: number; encryptedText: string; createdAt: string };

export default function ChatPage() {
  const [me, setMe] = useState<UserItem | null>(null);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [friends, setFriends] = useState<UserItem[]>([]);
  const [activeFriendId, setActiveFriendId] = useState<number | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeFriend = useMemo(() => friends.find((f) => f.id === activeFriendId) || null, [friends, activeFriendId]);

  const loadBaseData = async () => {
    const meRes = await fetch("/api/auth/me");
    const mePayload = (await meRes.json()) as { user?: UserItem };
    if (mePayload.user) setMe(mePayload.user);

    const usersRes = await fetch("/api/social/users");
    const usersPayload = (await usersRes.json()) as { users?: UserItem[] };
    setUsers(usersPayload.users || []);

    const friendsRes = await fetch("/api/social/friends");
    const friendsPayload = (await friendsRes.json()) as { friends?: UserItem[] };
    const friendList = friendsPayload.friends || [];
    setFriends(friendList);
    if (friendList.length > 0) setActiveFriendId(friendList[0].id);
  };

  const loadMessages = async (friendId: number) => {
    const res = await fetch(`/api/chat/messages?withUserId=${friendId}`);
    const payload = (await res.json()) as { messages?: MessageItem[] };
    setMessages(payload.messages || []);
  };

  useEffect(() => {
    loadBaseData();
  }, []);

  useEffect(() => {
    if (!activeFriendId) return;
    loadMessages(activeFriendId);
    const interval = setInterval(() => loadMessages(activeFriendId), 2500);
    return () => clearInterval(interval);
  }, [activeFriendId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addFriend = async (friendUserId: number) => {
    await fetch("/api/social/friends", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ friendUserId }),
    });
    await loadBaseData();
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeFriendId) return;
    const encryptedText = CryptoJS.AES.encrypt(input, SECRET_KEY).toString();
    await fetch("/api/chat/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId: activeFriendId, encryptedText }),
    });
    setInput("");
    await loadMessages(activeFriendId);
  };

  return (
    <div className="min-h-[100dvh] p-4 max-w-md mx-auto flex flex-col gap-4">
      <header className="flex items-center gap-3 cs-panel p-4 rounded-md">
        <Link href="/" className="text-cs-orange hover:bg-white/5 p-2 rounded-full transition-colors">
          <ChevronLeft size={28} />
        </Link>
        <h1 className="text-lg font-bold tracking-widest uppercase">Czat 1:1</h1>
      </header>

      <section className="cs-panel p-4 rounded-md">
        <p className="text-xs text-white/60 mb-2">Twoi znajomi</p>
        <div className="flex gap-2 overflow-x-auto">
          {friends.map((friend) => (
            <button
              key={friend.id}
              onClick={() => setActiveFriendId(friend.id)}
              className={`px-3 py-2 rounded-md text-xs font-bold tracking-widest ${activeFriendId === friend.id ? "bg-cs-orange text-black" : "bg-[#1a1a1a] border border-white/10"}`}
            >
              {friend.username}
            </button>
          ))}
          {friends.length === 0 && <span className="text-xs text-white/50">Dodaj znajomego poniżej.</span>}
        </div>
      </section>

      <section className="cs-panel p-4 rounded-md">
        <p className="text-xs text-white/60 mb-2 flex items-center gap-2"><Users size={14} /> Dodaj znajomego</p>
        <div className="flex gap-2 overflow-x-auto">
          {users
            .filter((user) => !friends.some((friend) => friend.id === user.id))
            .map((user) => (
              <button key={user.id} onClick={() => addFriend(user.id)} className="px-3 py-2 rounded-md text-xs border border-white/10 bg-[#1a1a1a] flex items-center gap-1">
                <UserPlus size={12} className="text-cs-orange" />
                {user.username}
              </button>
            ))}
        </div>
      </section>

      <div className="cs-panel p-4 rounded-md flex-1 overflow-y-auto flex flex-col gap-3 border-l-4 border-l-cs-orange">
        {!activeFriend ? (
          <p className="text-sm text-white/50">Wybierz znajomego, aby rozpocząć rozmowę.</p>
        ) : (
          <>
            <p className="text-xs text-white/60 mb-1">Rozmowa z: <span className="text-cs-orange">{activeFriend.username}</span></p>
            {messages.map((msg) => {
              const isMe = msg.senderId === me?.id;
              const text = CryptoJS.AES.decrypt(msg.encryptedText, SECRET_KEY).toString(CryptoJS.enc.Utf8);
              const time = new Date(msg.createdAt).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
              return (
                <div key={msg.id} className={`flex flex-col max-w-[80%] ${isMe ? "self-end items-end" : "self-start items-start"}`}>
                  <div className={`p-3 rounded-lg text-sm ${isMe ? "bg-cs-orange text-black font-semibold" : "bg-[#333333] border border-white/10"}`}>
                    {text || "[nie można odszyfrować]"}
                  </div>
                  <div className="text-[10px] text-white/40 mt-1 flex items-center gap-1">
                    <LockKeyhole size={8} /> {time}
                  </div>
                </div>
              );
            })}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Napisz wiadomość..."
          className="flex-1 bg-[#222222] border border-white/10 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-cs-orange"
        />
        <button type="submit" className="cs-btn rounded-md min-w-[56px]" disabled={!input.trim() || !activeFriend}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
