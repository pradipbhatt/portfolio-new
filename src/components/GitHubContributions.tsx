"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  GitFork,
  Github,
  Users,
  X,
  MapPin,
  Globe,
  CalendarDays,
} from "lucide-react";
import { useEffect, useState } from "react";

interface GitHubStats {
  publicRepos: number;
  followers: number;
  following: number;
}

interface GitHubProfile {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  twitter_username: string | null;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  fork: boolean;
  updated_at: string;
}

export default function GitHubContributions() {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [repos, setRepos] = useState<GitHubRepo[] | null>(null);
  const [isReposLoading, setIsReposLoading] = useState(false);
  const [reposError, setReposError] = useState<string | null>(null);
  const [showReposModal, setShowReposModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const username = "pradipbhatt";

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);

    fetch(`https://api.github.com/users/${username}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        setProfile({
          login: data?.login,
          name: data?.name,
          avatar_url: data?.avatar_url,
          html_url: data?.html_url,
          bio: data?.bio,
          company: data?.company,
          blog: data?.blog,
          location: data?.location,
          twitter_username: data?.twitter_username,
          followers: data?.followers || 0,
          following: data?.following || 0,
          public_repos: data?.public_repos || 0,
          created_at: data?.created_at,
        });

        setStats({
          publicRepos: data?.public_repos || 0,
          followers: data?.followers || 0,
          following: data?.following || 0,
        });
      })
      .catch(() => {
        setStats(null);
        setProfile(null);
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [username]);

  const fetchRepos = () => {
    setIsReposLoading(true);
    setReposError(null);

    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=50`)
      .then((res) => res.json())
      .then((data: GitHubRepo[]) => {
        if (!Array.isArray(data)) {
          setReposError("Unable to load repositories right now.");
          setRepos(null);
          return;
        }

        const sorted = [...data].sort((a, b) => {
          const aScore = a.stargazers_count + (a.fork ? 0 : 2);
          const bScore = b.stargazers_count + (b.fork ? 0 : 2);
          return bScore - aScore;
        });

        setRepos(sorted);
      })
      .catch(() => {
        setReposError("Unable to load repositories right now.");
        setRepos(null);
      })
      .finally(() => setIsReposLoading(false));
  };

  const handleOpenReposModal = () => {
    setShowReposModal(true);
    if (!repos && !isReposLoading) {
      fetchRepos();
    }
  };

  const handleCloseReposModal = () => {
    setShowReposModal(false);
  };

  const handleOpenProfileModal = () => {
    setShowProfileModal(true);
  };

  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
  };

  const statCards = [
    {
      icon: <Github size={22} className="text-primary" />,
      label: "Public Repos",
      value: isLoading ? "—" : stats?.publicRepos ?? "—",
    },
    {
      icon: <Users size={22} className="text-primary" />,
      label: "Followers",
      value: isLoading ? "—" : stats?.followers ?? "—",
    },
    {
      icon: <GitFork size={22} className="text-primary" />,
      label: "Following",
      value: isLoading ? "—" : stats?.following ?? "—",
    },
  ];

  return (
    <section id="github" className="py-20 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-squid tracking-wider mb-4">
            Git<span className="text-primary">H</span>ub Contributi
            <span className="text-primary">o</span>ns
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            A visual representation of my coding journey and open-source contributions
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12"
        >
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:border-primary/30 group overflow-hidden transition-colors"
            >
              {/* Subtle glow */}
              <div className="absolute -inset-1 bg-primary/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />

              <div className="relative z-10 flex items-center gap-4">
                <div className="p-3 bg-black/20 rounded-xl border border-white/10 group-hover:border-primary/30 transition-colors">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xs text-white/60 font-body">{stat.label}</p>
                  <p className="text-2xl font-bold font-display text-white">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Contribution Graph */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-primary/30 overflow-hidden group transition-colors"
        >
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="text-primary" size={24} />
              <h3 className="text-2xl font-bold font-display text-white">
                Contribution Activity
              </h3>
            </div>

            {/* Contribution Graph Image */}
            <div className="bg-card/40 rounded-xl p-6 overflow-x-auto border border-border group-hover:border-primary/20 transition-colors">
              <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
                aria-label="Open GitHub profile"
              >
                <img
                  src={`https://ghchart.rshah.org/C15928/${username}`}
                  alt="GitHub Contribution Graph"
                  className="w-full min-w-[600px] rounded-lg"
                  loading="lazy"
                />
              </a>
            </div>

            {/* GitHub Profile & Repos */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <motion.button
                type="button"
                onClick={handleOpenProfileModal}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary/15 hover:bg-primary/20 border border-primary/30 rounded-xl text-white font-semibold transition-colors"
              >
                <Github size={18} className="text-primary" />
                <span>View Profile</span>
              </motion.button>

              <motion.button
                type="button"
                onClick={handleOpenReposModal}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 rounded-xl text-white font-semibold transition-colors"
              >
                <span className="text-primary">{"</>"}</span>
                <span>Browse Repositories</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Repositories Modal */}
      {showReposModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-4xl max-h-[80vh] rounded-2xl bg-background border border-primary/40 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/60">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary/80">
                  GitHub
                </p>
                <h3 className="text-lg font-semibold text-white">
                  Public repositories
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseReposModal}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 hover:border-primary/40 bg-white/5 hover:bg-white/10 text-white transition-colors"
                aria-label="Close repositories"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-4 border-b border-border text-xs text-white/60 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-card/40 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="uppercase tracking-[0.16em]">
                  {username}
                </span>
              </span>
              {stats?.publicRepos ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-card/40 px-3 py-1">
                  <span className="text-primary font-semibold">
                    {stats.publicRepos}
                  </span>
                  <span>public repositories</span>
                </span>
              ) : null}
            </div>

            <div className="px-6 py-4 overflow-y-auto max-h-[calc(80vh-7.5rem)] space-y-3">
              {isReposLoading && (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="animate-pulse rounded-xl border border-border bg-card/40 px-4 py-3"
                    >
                      <div className="h-4 w-40 bg-white/20 rounded mb-2" />
                      <div className="h-3 w-64 bg-white/10 rounded" />
                    </div>
                  ))}
                </div>
              )}

              {!isReposLoading && reposError && (
                <p className="text-sm text-red-400">
                  {reposError}
                </p>
              )}

              {!isReposLoading && !reposError && repos && repos.length === 0 && (
                <p className="text-sm text-white/70">
                  No public repositories found.
                </p>
              )}

              {!isReposLoading && !reposError && repos && repos.length > 0 && (
                <ul className="space-y-3">
                  {repos.map((repo) => (
                    <li
                      key={repo.id}
                      className="rounded-xl border border-border bg-secondary/70 hover:border-primary/40 transition-colors"
                    >
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-3"
                      >
                        <div className="flex items-center justify-between gap-3 mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-white">
                              {repo.name}
                            </span>
                            {repo.fork && (
                              <span className="text-[10px] uppercase tracking-[0.16em] text-white/50 border border-white/10 rounded-full px-2 py-0.5">
                                Fork
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-white/50">
                            {new Date(repo.updated_at).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        {repo.description && (
                          <p className="text-xs text-white/70 mb-2 line-clamp-2">
                            {repo.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-[11px] text-white/60">
                          {repo.language && (
                            <span className="inline-flex items-center gap-1">
                              <span className="h-2 w-2 rounded-full bg-primary" />
                              <span>{repo.language}</span>
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1">
                            <span className="text-primary">★</span>
                            <span>{repo.stargazers_count}</span>
                          </span>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-xl rounded-2xl bg-background border border-primary/40 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/60">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary/80">
                  GitHub Profile
                </p>
                <h3 className="text-lg font-semibold text-white">
                  {profile?.name || profile?.login || username}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseProfileModal}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 hover:border-primary/40 bg-white/5 hover:bg-white/10 text-white transition-colors"
                aria-label="Close profile"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Top row with avatar + meta */}
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-full overflow-hidden border border-primary/50 bg-secondary/60">
                  {profile?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.avatar_url}
                      alt={profile.name ?? profile.login ?? username}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-primary text-xl font-semibold">
                      {username[0]?.toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-white">
                      {profile?.name || "GitHub Developer"}
                    </span>
                    <span className="text-xs text-white/60">
                      @{profile?.login || username}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-white/60">
                    {profile?.location && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={12} className="text-primary" />
                        <span>{profile.location}</span>
                      </span>
                    )}
                    {profile?.company && (
                      <span className="inline-flex items-center gap-1.5">
                        <span className="text-primary">@</span>
                        <span>{profile.company}</span>
                      </span>
                    )}
                    {profile?.created_at && (
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays size={12} className="text-primary" />
                        <span>
                          Joined{" "}
                          {new Date(profile.created_at).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                          })}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {profile?.bio && (
                <p className="text-sm text-white/70 leading-relaxed">
                  {profile.bio}
                </p>
              )}

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 text-center text-xs text-white/70">
                <div className="rounded-xl bg-white/5 px-3 py-2 border border-white/10">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-white/50">
                    Repos
                  </p>
                  <p className="text-lg font-semibold text-white">
                    {profile?.public_repos ?? stats?.publicRepos ?? "—"}
                  </p>
                </div>
                <div className="rounded-xl bg-white/5 px-3 py-2 border border-white/10">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-white/50">
                    Followers
                  </p>
                  <p className="text-lg font-semibold text-white">
                    {profile?.followers ?? stats?.followers ?? "—"}
                  </p>
                </div>
                <div className="rounded-xl bg-white/5 px-3 py-2 border border-white/10">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-white/50">
                    Following
                  </p>
                  <p className="text-lg font-semibold text-white">
                    {profile?.following ?? stats?.following ?? "—"}
                  </p>
                </div>
              </div>

              {/* Links */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                {profile?.html_url && (
                  <a
                    href={profile.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/15 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/20 transition-colors"
                  >
                    <Github size={16} className="text-primary" />
                    <span>Open on GitHub</span>
                  </a>
                )}
                {profile?.blog && (
                  <a
                    href={profile.blog.startsWith("http") ? profile.blog : `https://${profile.blog}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10 hover:border-primary/40 transition-colors"
                  >
                    <Globe size={16} className="text-primary" />
                    <span>Personal site</span>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}
