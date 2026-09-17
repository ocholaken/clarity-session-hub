import { useCallback, useState } from "react";

export type UserAction = "like" | "dislike" | null;

export interface LikeState {
  likes: number;
  dislikes: number;
  userAction: UserAction;
}

const storageKey = (articleId: string) => `clarity_likes_${articleId}`;

const baseCounts = (articleId: string): LikeState => {
  let hash = 0;
  for (const character of articleId) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return {
    likes: 20 + (hash % 131),
    dislikes: 3 + (hash % 18),
    userAction: null,
  };
};

const readState = (articleId: string): LikeState => {
  if (typeof window === "undefined") return baseCounts(articleId);
  const stored = window.localStorage.getItem(storageKey(articleId));
  if (!stored) {
    const initial = baseCounts(articleId);
    window.localStorage.setItem(storageKey(articleId), JSON.stringify(initial));
    return initial;
  }
  try {
    const parsed = JSON.parse(stored) as Partial<LikeState>;
    return {
      likes: typeof parsed.likes === "number" ? parsed.likes : baseCounts(articleId).likes,
      dislikes: typeof parsed.dislikes === "number" ? parsed.dislikes : baseCounts(articleId).dislikes,
      userAction: parsed.userAction === "like" || parsed.userAction === "dislike" ? parsed.userAction : null,
    };
  } catch {
    const initial = baseCounts(articleId);
    window.localStorage.setItem(storageKey(articleId), JSON.stringify(initial));
    return initial;
  }
};

const writeState = (articleId: string, state: LikeState) => {
  window.localStorage.setItem(storageKey(articleId), JSON.stringify(state));
  window.dispatchEvent(new CustomEvent("clarity-likes-updated"));
};

export const getLikes = (articleId: string) => readState(articleId);

export const getAllLikes = () => {
  if (typeof window === "undefined") return {} as Record<string, LikeState>;
  return Object.keys(window.localStorage)
    .filter((key) => key.startsWith("clarity_likes_"))
    .reduce<Record<string, LikeState>>((result, key) => {
      const id = key.replace("clarity_likes_", "");
      result[id] = readState(id);
      return result;
    }, {});
};

export const useLikes = (articleId: string) => {
  const [state, setState] = useState<LikeState>(() => getLikes(articleId));

  const update = useCallback((next: LikeState) => {
    writeState(articleId, next);
    setState(next);
  }, [articleId]);

  const handleLike = useCallback(() => {
    const current = getLikes(articleId);
    const next = current.userAction === "like"
      ? { ...current, likes: Math.max(0, current.likes - 1), userAction: null }
      : {
          likes: current.likes + 1,
          dislikes: current.userAction === "dislike" ? Math.max(0, current.dislikes - 1) : current.dislikes,
          userAction: "like" as const,
        };
    update(next);
  }, [articleId, update]);

  const handleDislike = useCallback(() => {
    const current = getLikes(articleId);
    const next = current.userAction === "dislike"
      ? { ...current, dislikes: Math.max(0, current.dislikes - 1), userAction: null }
      : {
          likes: current.userAction === "like" ? Math.max(0, current.likes - 1) : current.likes,
          dislikes: current.dislikes + 1,
          userAction: "dislike" as const,
        };
    update(next);
  }, [articleId, update]);

  return { ...state, handleLike, handleDislike, getLikes: () => getLikes(articleId) };
};
