import { ShieldCheck } from 'lucide-react';

interface Props {
  username: string;
  setUsername: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  loginError: string;
  onLogin: () => void;
}

export default function AdminLogin({
  username,
  setUsername,
  password,
  setPassword,
  loginError,
  onLogin,
}: Props) {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-6 bg-admin-purple">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-75"
      >
        <source src="/lv_0_20260809121737.webm" type="video/webm" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-admin-purple/90 via-admin-purple/75 to-admin-purple/95" />
      <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_25%_15%,#D4AF37,transparent_55%)]" />

      <div className="relative w-full max-w-md bg-white/[0.07] backdrop-blur-2xl border border-white/15 rounded-3xl p-8 sm:p-10 shadow-[0_25px_70px_rgba(46,10,92,0.6)] animate-glass-in">
        <div className="w-12 h-12 rounded-2xl bg-admin-gold/15 border border-admin-gold/30 flex items-center justify-center mb-6">
          <ShieldCheck size={22} className="text-admin-gold" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-admin-milk mb-1.5">GPCM Admin</h1>
        <p className="text-admin-milkMuted/80 text-sm mb-8">
          Super admin uses password only. Sub-admins sign in with username and password.
        </p>

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onLogin()}
          placeholder="Username (optional for super admin)"
          autoComplete="username"
          className="w-full bg-white/5 border border-white/15 rounded-2xl px-5 py-4 text-admin-milk placeholder:text-admin-milkMuted/40 mb-3 outline-none focus:ring-2 focus:ring-admin-gold focus:border-admin-gold/50 transition-all"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onLogin()}
          placeholder="Password"
          autoFocus
          autoComplete="current-password"
          className="w-full bg-white/5 border border-white/15 rounded-2xl px-5 py-4 text-admin-milk placeholder:text-admin-milkMuted/40 mb-3 outline-none focus:ring-2 focus:ring-admin-gold focus:border-admin-gold/50 transition-all"
        />
        {loginError && <p className="text-rose-300 text-sm mb-3">{loginError}</p>}
        <button
          onClick={onLogin}
          className="w-full bg-admin-gold hover:bg-admin-goldHover text-admin-purple py-4 rounded-2xl font-semibold transition-colors shadow-[0_10px_30px_rgba(212,175,55,0.25)]"
        >
          Login
        </button>
      </div>
    </div>
  );
}
