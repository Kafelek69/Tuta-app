"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, LockKeyhole, Send, ShieldCheck, UserPlus, Users } from "lucide-react";
import CryptoJS from "crypto-js";

const SECRET_KEY = "PL_OS_SECRET_SECURE_KEY_2026";

type UserItem = { id: number; username: string };
type MessageItem = { id: number; sender: string; senderId: number; encryptedText: string; createdAt: string };

function Avatar({ name, size = 40, online }: { name: string; size?: number; online?: boolean }) {
  const colors = ["#f97316","#8b5cf6","#06b6d4","#ec4899","#10b981","#f59e0b","#6366f1","#14b8a6"];
  const idx = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length;
  const initials = name.slice(0, 2).toUpperCase();
  return (
    <div className="relative shrink-0">
      <div
        className="flex items-center justify-center rounded-full font-black text-black tracking-wider"
        style={{ width: size, height: size, background: `linear-gradient(135deg, ${colors[idx]}, ${colors[(idx+2)%8]})`, fontSize: size * 0.32 }}
      >
        {initials}
      </div>
      {online && (
        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-[#0a0a0a]" />
      )}
    </div>
  );
}

export default function ChatPage() {
  const [me, setMe] = useState<UserItem | null>(null);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [friends, setFriends] = useState<UserItem[]>([]);
  const [activeFriendId, setActiveFriendId] = useState<number | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
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
    if (friendList.length > 0 && !activeFriendId) setActiveFriendId(friendList[0].id);
  };

  const loadMessages = async (friendId: number) => {
    const res = await fetch(`/api/chat/messages?withUserId=${friendId}`);
    const payload = (await res.json()) as { messages?: MessageItem[] };
    setMessages(payload.messages || []);
  };

  useEffect(() => { loadBaseData(); }, []);

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
    if (!input.trim() || !activeFriendId || sending) return;
    setSending(true);
    const encryptedText = CryptoJS.AES.encrypt(input, SECRET_KEY).toString();
    await fetch("/api/chat/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId: activeFriendId, encryptedText }),
    });
    setInput("");
    await loadMessages(activeFriendId);
    setSending(false);
  };

  const nonFriendUsers = users.filter((u) => !friends.some((f) => f.id === u.id));

  return (
    <div className="h-[100dvh] max-w-md mx-auto flex flex-col safe-bottom">
      {/* Header */}
      <header className="cs-header mx-3 mt-3 animate-fadeInUp">
        <Link href="/" className="text-[#fca000] hover:bg-white/5 p-2 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <div className="flex-1">
          <h1 className="text-base font-black tracking-[0.2em]">CZAT</h1>
          {activeFriend && (
            <p className="text-[10px] text-white/40 tracking-wider flex items-center gap-1 mt-0.5">
              <ShieldCheck size={10} className="text-green-500" /> SZYFROWANIE E2E
            </p>
          )}
        </div>
        {activeFriend && <Avatar name={activeFriend.username} size={34} online />}
      </header>

      {/* Friends row */}
      <div className="px-3 mt-3 animate-fadeInUp stagger-1">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {friends.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFriendId(f.id)}
              className={`flex flex-col items-center gap-1.5 min-w-[60px] transition-all duration-200 ${
                activeFriendId === f.id ? "scale-105" : "opacity-60 hover:opacity-100"
              }`}
            >
              <div className={`p-[2px] rounded-full ${activeFriendId === f.id ? "bg-gradient-to-br from-[#fca000] to-[#f97316]" : ""}`}>
                <div className="bg-[#0a0a0a] rounded-full p-[2px]">
                  <Avatar name={f.username} size={44} online={f.id % 2 === 0} />
                </div>
              </div>
              <span className="text-[9px] font-bold tracking-wider truncate max-w-[60px]">{f.username}</span>
            </button>
          ))}
          {friends.length === 0 && (
            <p className="text-xs text-white/40 py-4">Dodaj znajomego, aby zacząć czatować</p>
          )}
        </div>
      </div>

      {/* Add friends (collapsed if has friends) */}
      {nonFriendUsers.length > 0 && (
        <div className="px-3 mt-2 animate-fadeInUp stagger-2">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {nonFriendUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => addFriend(user.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider border border-white/10 bg-white/5 hover:border-[#fca000]/40 hover:bg-[#fca000]/5 transition-all shrink-0"
              >
                <UserPlus size={11} className="text-[#fca000]" />
                {user.username}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-3 mt-3 flex flex-col gap-2 no-scrollbar">
        {!activeFriend ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 opacity-40">
            <Users size={40} />
            <p className="text-xs tracking-wider">Wybierz znajomego</p>
          </div>
        ) : (
          <>
            {messages.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 opacity-30">
                <LockKeyhole size={28} />
                <p className="text-[10px] tracking-wider">Zacznij szyfrowaną rozmowę</p>
              </div>
            )}
            {messages.map((msg, i) => {
              const isMe = msg.senderId === me?.id;
              const text = CryptoJS.AES.decrypt(msg.encryptedText, SECRET_KEY).toString(CryptoJS.enc.Utf8);
              const time = new Date(msg.createdAt).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2 max-w-[82%] ${isMe ? "self-end flex-row-reverse" : "self-start"}`}
                  style={{ animation: `${isMe ? "slideInRight" : "slideInLeft"} 0.3s ease-out forwards`, animationDelay: `${Math.min(i * 0.03, 0.3)}s`, opacity: 0 }}
                >
                  {!isMe && <Avatar name={msg.sender} size={28} />}
                  <div>
                    <div
                      className={`px-3.5 py-2.5 text-[13px] normal-case leading-relaxed ${
                        isMe
                          ? "bg-gradient-to-br from-[#fca000] to-[#e09000] text-black font-medium rounded-2xl rounded-tr-md"
                          : "bg-white/[0.06] border border-white/[0.08] rounded-2xl rounded-tl-md"
                      }`}
                    >
                      {text || "[nie można odszyfrować]"}
                    </div>
                    <p className={`text-[9px] text-white/30 mt-1 flex items-center gap-1 ${isMe ? "justify-end" : ""}`}>
                      <LockKeyhole size={7} /> {time}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="px-3 pb-3 pt-2 flex gap-2 animate-fadeInUp">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Napisz wiadomość..."
          className="cs-input flex-1 !rounded-full !pl-5 !py-3"
          disabled={!activeFriend}
        />
        <button
          type="submit"
          disabled={!input.trim() || !activeFriend || sending}
          className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 disabled:opacity-30"
          style={{
            background: input.trim() ? "linear-gradient(135deg, #fca000, #e09000)" : "rgba(255,255,255,0.06)",
            boxShadow: input.trim() ? "0 4px 16px rgba(252,160,0,0.3)" : "none",
          }}
        >
          <Send size={18} className={input.trim() ? "text-black" : "text-white/30"} />
        </button>
      </form>
    </div>
  );
}
