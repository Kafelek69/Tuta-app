"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Heart, MessageCircle, Send, Share2, Sparkles, X, ChevronDown, ChevronUp } from "lucide-react";

type Comment = { id: number; author: string; content: string; createdAt: string };
type Post = { id: number; author: string; content: string; createdAt: string; likeCount: number; likedByMe: number; commentCount?: number };
type FeedResponse = { posts?: Post[]; nextCursor?: number | null; hasMore?: boolean; error?: string };

function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const colors = ["#f97316","#8b5cf6","#06b6d4","#ec4899","#10b981","#f59e0b","#6366f1","#14b8a6"];
  const idx = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length;
  return (
    <div className="flex items-center justify-center rounded-full font-black text-black tracking-wider shrink-0"
      style={{ width: size, height: size, background: `linear-gradient(135deg, ${colors[idx]}, ${colors[(idx+2)%8]})`, fontSize: size * 0.32 }}>
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

function PostCard({ post, me, onLike, likeAnim }: { post: Post; me: string; onLike: (id: number) => void; likeAnim: number | null }) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [shared, setShared] = useState(false);

  const loadComments = async () => {
    setLoadingComments(true);
    const res = await fetch(`/api/feed/posts/${post.id}/comments`);
    const data = (await res.json()) as { comments?: Comment[] };
    setComments(data.comments || []);
    setLoadingComments(false);
  };

  const addComment = async () => {
    if (!commentText.trim()) return;
    await fetch(`/api/feed/posts/${post.id}/comments`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: commentText }),
    });
    setCommentText("");
    await loadComments();
  };

  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: `Post od ${post.author}`, text: post.content, url: window.location.href }); } catch {}
    } else {
      await navigator.clipboard.writeText(`${post.author}: ${post.content}`);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  const timeAgo = (d: string) => {
    const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
    if (mins < 1) return "teraz";
    if (mins < 60) return `${mins}min`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  };

  return (
    <article className="cs-card p-4">
      <div className="flex items-center gap-3">
        <Avatar name={post.author} size={36} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold tracking-wider t-accent">{post.author}</p>
          <p className="text-[10px] t-tertiary tracking-wider">{timeAgo(post.createdAt)}</p>
        </div>
      </div>
      <p className="text-sm normal-case mt-3 leading-relaxed" style={{ color: "var(--app-text)" }}>{post.content}</p>

      <div className="flex items-center gap-5 mt-4 pt-3" style={{ borderTop: "1px solid var(--app-panel-border)" }}>
        <button onClick={() => onLike(post.id)} className="flex items-center gap-1.5 text-xs tracking-wider group">
          <Heart size={18} className={`transition-all ${post.likedByMe ? "fill-red-500 text-red-500" : "t-tertiary group-hover:text-red-400"} ${likeAnim === post.id ? "animate-heartBeat" : ""}`} />
          <span className={post.likedByMe ? "text-red-400" : "t-tertiary"}>{post.likeCount > 0 ? post.likeCount : ""}</span>
        </button>
        <button onClick={() => { setShowComments(!showComments); if (!showComments) loadComments(); }} className="flex items-center gap-1.5 text-xs t-tertiary hover:t-secondary transition-colors">
          <MessageCircle size={18} />
          {showComments ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
        <button onClick={share} className="flex items-center gap-1.5 text-xs t-tertiary hover:t-secondary transition-colors ml-auto">
          <Share2 size={16} />
          {shared && <span className="text-[9px] text-green-500 normal-case">skopiowano!</span>}
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="mt-3 pt-3 animate-fadeInUp" style={{ borderTop: "1px solid var(--app-panel-border)" }}>
          {loadingComments ? (
            <div className="flex justify-center py-3"><div className="w-4 h-4 border-2 border-[#fca000] border-t-transparent rounded-full animate-spin" /></div>
          ) : comments.length === 0 ? (
            <p className="text-[10px] t-tertiary text-center py-2 normal-case">Brak komentarzy. Dodaj pierwszy!</p>
          ) : (
            <div className="flex flex-col gap-2 mb-3 max-h-40 overflow-y-auto no-scrollbar">
              {comments.map((c) => (
                <div key={c.id} className="flex gap-2">
                  <Avatar name={c.author} size={22} />
                  <div>
                    <span className="text-[10px] font-bold t-accent">{c.author}</span>
                    <p className="text-[11px] normal-case" style={{ color: "var(--app-text)" }}>{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") addComment(); }}
              placeholder="Napisz komentarz..."
              className="cs-input flex-1 !py-2 !text-xs !rounded-full"
            />
            <button onClick={addComment} disabled={!commentText.trim()} className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 disabled:opacity-30" style={{ background: commentText.trim() ? "linear-gradient(135deg, #fca000, #e09000)" : "var(--app-input-bg)" }}>
              <Send size={12} className={commentText.trim() ? "text-black" : "t-tertiary"} />
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<number | null>(null);
  const [likeAnim, setLikeAnim] = useState<number | null>(null);
  const [me, setMe] = useState("");
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { fetch("/api/auth/me").then(r => r.json()).then((d: { user?: { username: string } }) => { if (d.user) setMe(d.user.username); }); }, []);

  const loadPosts = async () => {
    setLoading(true);
    const res = await fetch("/api/feed/posts?limit=10");
    const payload = (await res.json()) as FeedResponse;
    if (!res.ok) { setError(payload.error || "Błąd"); setLoading(false); return; }
    setPosts(payload.posts || []);
    setCursor(payload.nextCursor ?? null);
    setHasMore(Boolean(payload.hasMore));
    setLoading(false);
  };

  const loadMore = async () => {
    if (!hasMore || loadingMore || cursor === null) return;
    setLoadingMore(true);
    const res = await fetch(`/api/feed/posts?limit=10&cursor=${cursor}`);
    const payload = (await res.json()) as FeedResponse;
    if (res.ok) { setPosts(p => [...p, ...(payload.posts || [])]); setCursor(payload.nextCursor ?? null); setHasMore(Boolean(payload.hasMore)); }
    setLoadingMore(false);
  };

  useEffect(() => { loadPosts(); }, []);
  useEffect(() => {
    const t = loaderRef.current; if (!t) return;
    const o = new IntersectionObserver((e) => { if (e[0]?.isIntersecting) loadMore(); }, { rootMargin: "120px" });
    o.observe(t); return () => o.disconnect();
  }, [cursor, hasMore, loadingMore]);

  const addPost = async () => {
    setError("");
    if (content.trim().length < 3) { setError("Min 3 znaki."); return; }
    const res = await fetch("/api/feed/posts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content }) });
    if (!res.ok) { const d = await res.json(); setError(d.error || "Błąd"); return; }
    setContent(""); await loadPosts();
  };

  const toggleLike = async (postId: number) => {
    setLikeAnim(postId);
    const res = await fetch(`/api/feed/posts/${postId}/like`, { method: "POST" });
    const data = (await res.json()) as { liked: boolean };
    setPosts(p => p.map(x => x.id === postId ? { ...x, likedByMe: data.liked ? 1 : 0, likeCount: x.likeCount + (data.liked ? 1 : -1) } : x));
    setTimeout(() => setLikeAnim(null), 400);
  };

  return (
    <div className="min-h-[100dvh] max-w-md mx-auto flex flex-col pb-24 safe-bottom">
      <header className="cs-header mx-3 mt-3 animate-fadeInUp sticky top-3 z-30">
        <Link href="/" className="t-accent p-2 rounded-full hover:bg-white/5 transition-colors"><ChevronLeft size={24} /></Link>
        <div className="flex-1">
          <h1 className="text-base font-black tracking-[0.2em]">TABLICA</h1>
          <p className="text-[10px] t-tertiary tracking-wider mt-0.5">POSTY I ZNAJOMI</p>
        </div>
        <Sparkles size={20} className="t-accent" />
      </header>

      <div className="mx-3 mt-3 cs-card p-4 animate-fadeInUp stagger-1">
        <div className="flex gap-3">
          {me && <Avatar name={me} size={38} />}
          <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Co u Ciebie słychać?" className="cs-input !rounded-xl !min-h-[70px] !bg-transparent resize-none flex-1" />
        </div>
        {error && <p className="text-red-400 text-xs mt-2 normal-case">{error}</p>}
        <button onClick={addPost} disabled={content.trim().length < 3} className="cs-btn w-full rounded-xl mt-3 !py-2.5 text-xs flex items-center justify-center gap-2">
          <Send size={14} /> OPUBLIKUJ
        </button>
      </div>

      <div className="flex flex-col gap-3 px-3 mt-3">
        {loading && <div className="flex items-center justify-center py-10"><div className="w-6 h-6 border-2 border-[#fca000] border-t-transparent rounded-full animate-spin" /></div>}
        {!loading && posts.length === 0 && (
          <div className="text-center py-16 opacity-40"><MessageCircle size={40} className="mx-auto mb-3" /><p className="text-xs tracking-wider">Brak postów</p></div>
        )}
        {posts.map((post, i) => (
          <div key={post.id} className="animate-fadeInUp" style={{ animationDelay: `${0.05 * Math.min(i, 8)}s`, opacity: 0 }}>
            <PostCard post={post} me={me} onLike={toggleLike} likeAnim={likeAnim} />
          </div>
        ))}
        <div ref={loaderRef} className="h-8 flex items-center justify-center">
          {loadingMore && <div className="w-5 h-5 border-2 border-[#fca000] border-t-transparent rounded-full animate-spin" />}
          {!hasMore && posts.length > 0 && <span className="text-[10px] t-tertiary tracking-wider">To już wszystko</span>}
        </div>
      </div>
    </div>
  );
}