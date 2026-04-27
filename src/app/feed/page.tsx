"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Send } from "lucide-react";

type Post = { id: number; author: string; content: string; createdAt: string };
type FeedResponse = { posts?: Post[]; error?: string; nextCursor?: number | null; hasMore?: boolean };

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const loadPosts = async () => {
    setLoading(true);
    const res = await fetch("/api/feed/posts?limit=10");
    const payload = (await res.json()) as FeedResponse;
    if (!res.ok) {
      setError(payload.error || "Nie udało się pobrać feedu.");
      setLoading(false);
      return;
    }
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
    if (res.ok) {
      const newPosts = payload.posts || [];
      setPosts((prev) => [...prev, ...newPosts]);
      setCursor(payload.nextCursor ?? null);
      setHasMore(Boolean(payload.hasMore));
    }
    setLoadingMore(false);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    const target = loaderRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "120px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [cursor, hasMore, loadingMore]);

  const addPost = async () => {
    setError("");
    const res = await fetch("/api/feed/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    const payload = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(payload.error || "Nie udało się dodać posta.");
      return;
    }
    setContent("");
    await loadPosts();
  };

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (window.scrollY === 0) {
      setTouchStartY(e.touches[0]?.clientY ?? null);
    }
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartY === null) return;
    const currentY = e.touches[0]?.clientY ?? touchStartY;
    const diff = currentY - touchStartY;
    if (diff > 0) {
      setPullDistance(Math.min(diff, 80));
    }
  };

  const onTouchEnd = async () => {
    if (pullDistance > 60) {
      setRefreshing(true);
      await loadPosts();
      setRefreshing(false);
    }
    setTouchStartY(null);
    setPullDistance(0);
  };

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="min-h-[100dvh] p-4 max-w-md mx-auto flex flex-col gap-4"
    >
      {pullDistance > 0 || refreshing ? (
        <p className="text-center text-xs text-white/60">{refreshing ? "Odświeżanie..." : "Pociągnij, aby odświeżyć"}</p>
      ) : null}
      <header className="flex items-center gap-3 cs-panel p-4 rounded-md">
        <Link href="/" className="text-cs-orange hover:bg-white/5 p-2 rounded-full transition-colors">
          <ChevronLeft size={28} />
        </Link>
        <h1 className="text-lg font-bold tracking-widest uppercase">Feed</h1>
      </header>

      <section className="cs-panel p-4 rounded-md">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Co u Ciebie?"
          className="w-full min-h-[90px] bg-[#1a1a1a] border border-white/10 rounded-md p-3 text-sm focus:outline-none focus:border-cs-orange"
        />
        {error ? <p className="text-red-400 text-xs mt-2">{error}</p> : null}
        <button onClick={addPost} className="cs-btn rounded-md mt-3 w-full flex items-center justify-center gap-2">
          <Send size={16} /> Dodaj post
        </button>
      </section>

      <section className="flex flex-col gap-3 pb-6">
        {loading ? <p className="text-xs text-white/60">Ładowanie feedu...</p> : null}
        {posts.map((post) => (
          <article key={post.id} className="cs-panel p-4 rounded-md border border-white/10">
            <p className="text-xs text-cs-orange font-bold">{post.author}</p>
            <p className="text-sm normal-case mt-2">{post.content}</p>
            <p className="text-[10px] text-white/50 mt-3">
              {new Date(post.createdAt).toLocaleString("pl-PL")}
            </p>
          </article>
        ))}
        <div ref={loaderRef} className="h-8 flex items-center justify-center">
          {loadingMore ? <span className="text-xs text-white/60">Wczytywanie kolejnych postów...</span> : null}
          {!hasMore && posts.length > 0 ? <span className="text-xs text-white/40">To już wszystko.</span> : null}
        </div>
      </section>
    </div>
  );
}