<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ $title ?? 'Dashboard Mo7assib' }}</title>
    <style>
        :root {
            --mo7-primary: #3f46e8;
            --mo7-primary-deep: #2d349f;
            --mo7-accent: #0f766e;
            --mo7-bg: #eef2ff;
            --mo7-surface: rgba(255, 255, 255, 0.88);
            --mo7-surface-strong: #ffffff;
            --mo7-border: rgba(99, 102, 241, 0.12);
            --mo7-text: #111827;
            --mo7-muted: #667085;
            --mo7-shadow: 0 24px 60px rgba(79, 70, 229, 0.12);
            --mo7-danger: #c2410c;
        }
        * { box-sizing: border-box; }
        body {
            margin: 0;
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            background: radial-gradient(circle at top left, rgba(99, 102, 241, 0.12), transparent 24%), linear-gradient(180deg, #eef2ff 0%, #f8faff 100%);
            color: var(--mo7-text);
        }
        a { color: inherit; }
        .mo7-dashboard { min-height: 100vh; display: grid; grid-template-columns: 280px minmax(0, 1fr); }
        .mo7-sidebar { padding: 28px 22px; background: linear-gradient(180deg, #111827 0%, #1f2a44 100%); color: #eef2ff; position: sticky; top: 0; min-height: 100vh; }
        .mo7-brand { display: grid; gap: 6px; margin-bottom: 28px; }
        .mo7-brand__eyebrow { font-size: 0.75rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(238, 242, 255, 0.72); }
        .mo7-brand__name { font-family: Georgia, "Times New Roman", serif; font-size: 2rem; line-height: 1; }
        .mo7-brand__copy { margin: 0; color: rgba(238, 242, 255, 0.72); line-height: 1.7; font-size: 0.94rem; }
        .mo7-nav { display: grid; gap: 10px; margin-top: 20px; }
        .mo7-nav__link { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 16px; border-radius: 18px; text-decoration: none; color: rgba(238, 242, 255, 0.86); background: rgba(255, 255, 255, 0.04); border: 1px solid transparent; transition: background-color 160ms ease, transform 160ms ease, border-color 160ms ease; }
        .mo7-nav__link:hover, .mo7-nav__link:focus-visible, .mo7-nav__link--active { transform: translateX(2px); background: rgba(79, 70, 229, 0.24); border-color: rgba(255, 255, 255, 0.08); }
        .mo7-nav__label { font-weight: 700; }
        .mo7-nav__meta { font-size: 0.8rem; color: rgba(238, 242, 255, 0.6); }
        .mo7-sidebar__footer { margin-top: 22px; padding-top: 22px; border-top: 1px solid rgba(255, 255, 255, 0.08); }
        .mo7-logout { width: 100%; border: 0; border-radius: 16px; padding: 14px 16px; background: rgba(255, 255, 255, 0.08); color: #fff; font-weight: 700; text-align: left; cursor: pointer; transition: background-color 160ms ease; }
        .mo7-logout:hover, .mo7-logout:focus-visible { background: rgba(194, 65, 12, 0.28); }
        .mo7-main { padding: 24px; }
        .mo7-topbar { display: flex; align-items: center; justify-content: space-between; gap: 18px; margin-bottom: 22px; padding: 18px 22px; border: 1px solid var(--mo7-border); border-radius: 24px; background: rgba(255, 255, 255, 0.72); backdrop-filter: blur(14px); box-shadow: var(--mo7-shadow); }
        .mo7-topbar__title { margin: 0; font-family: Georgia, "Times New Roman", serif; font-size: clamp(1.8rem, 3vw, 2.5rem); line-height: 1; }
        .mo7-topbar__subtitle { margin: 8px 0 0; color: var(--mo7-muted); line-height: 1.6; }
        .mo7-topbar__account { display: flex; align-items: center; gap: 14px; padding: 10px 12px; border-radius: 18px; background: var(--mo7-surface-strong); border: 1px solid var(--mo7-border); }
        .mo7-avatar { width: 48px; height: 48px; border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--mo7-primary) 0%, #7c3aed 100%); color: #fff; font-weight: 800; }
        .mo7-avatar__meta strong, .mo7-avatar__meta span { display: block; }
        .mo7-avatar__meta span { color: var(--mo7-muted); font-size: 0.88rem; margin-top: 4px; }
        .mo7-status { display: inline-flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 999px; background: rgba(15, 118, 110, 0.1); color: var(--mo7-accent); font-weight: 700; font-size: 0.84rem; }
        .mo7-grid { display: grid; gap: 18px; }
        .mo7-grid--stats { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        .mo7-grid--content { grid-template-columns: minmax(0, 1.4fr) minmax(320px, 0.85fr); margin-top: 18px; }
        .mo7-card { padding: 22px; border-radius: 24px; background: var(--mo7-surface); border: 1px solid var(--mo7-border); box-shadow: var(--mo7-shadow); backdrop-filter: blur(14px); }
        .mo7-card__eyebrow { color: var(--mo7-muted); font-size: 0.8rem; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; }
        .mo7-stat__value { display: block; margin-top: 14px; font-family: Georgia, "Times New Roman", serif; font-size: 2.2rem; line-height: 1; }
        .mo7-stat__meta { display: block; margin-top: 10px; color: var(--mo7-muted); line-height: 1.6; }
        .mo7-card__title { margin: 0; font-family: Georgia, "Times New Roman", serif; font-size: 1.5rem; line-height: 1.1; }
        .mo7-card__copy { margin: 10px 0 0; color: var(--mo7-muted); line-height: 1.7; }
        .mo7-list { display: grid; gap: 12px; margin-top: 18px; }
        .mo7-list__item, .mo7-quicklink { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 16px 18px; border-radius: 18px; background: var(--mo7-surface-strong); border: 1px solid rgba(99, 102, 241, 0.08); }
        .mo7-list__item strong, .mo7-list__item span, .mo7-quicklink strong, .mo7-quicklink span { display: block; }
        .mo7-list__item span, .mo7-quicklink span { margin-top: 4px; color: var(--mo7-muted); font-size: 0.92rem; }
        .mo7-pill { display: inline-flex; align-items: center; justify-content: center; min-width: 74px; padding: 8px 12px; border-radius: 999px; background: rgba(79, 70, 229, 0.1); color: var(--mo7-primary); font-weight: 700; font-size: 0.82rem; text-transform: uppercase; }
        .mo7-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 18px; }
        .mo7-button { display: inline-flex; align-items: center; justify-content: center; min-height: 46px; padding: 0 18px; border-radius: 14px; border: 0; background: linear-gradient(135deg, var(--mo7-primary) 0%, #7c3aed 100%); color: #fff; font-weight: 800; text-decoration: none; cursor: pointer; box-shadow: 0 16px 32px rgba(79, 70, 229, 0.18); }
        .mo7-button--secondary { background: #fff; color: var(--mo7-primary); border: 1px solid var(--mo7-border); box-shadow: none; }
        .mo7-table-wrap { overflow-x: auto; }
        .mo7-table { width: 100%; border-collapse: collapse; }
        .mo7-table th, .mo7-table td { text-align: left; padding: 16px; border-bottom: 1px solid rgba(99, 102, 241, 0.08); vertical-align: top; }
        .mo7-table th { font-size: 0.84rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--mo7-muted); }
        .mo7-table__primary { font-weight: 700; }
        .mo7-table__secondary { display: block; margin-top: 4px; color: var(--mo7-muted); font-size: 0.92rem; }
        .mo7-badge { display: inline-flex; align-items: center; justify-content: center; padding: 7px 12px; border-radius: 999px; font-weight: 700; font-size: 0.8rem; text-transform: uppercase; }
        .mo7-badge--role-dev { background: rgba(15, 118, 110, 0.12); color: #0f766e; }
        .mo7-badge--role-admin { background: rgba(37, 99, 235, 0.12); color: #2563eb; }
        .mo7-badge--role-manager { background: rgba(217, 119, 6, 0.12); color: #b45309; }
        .mo7-badge--status-active { background: rgba(22, 163, 74, 0.12); color: #15803d; }
        .mo7-badge--status-inactive { background: rgba(194, 65, 12, 0.12); color: var(--mo7-danger); }
        .mo7-form { display: grid; gap: 18px; }
        .mo7-form__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
        .mo7-field { display: grid; gap: 8px; }
        .mo7-field label { font-weight: 700; }
        .mo7-input, .mo7-select { width: 100%; min-height: 48px; padding: 12px 14px; border-radius: 14px; border: 1px solid rgba(99, 102, 241, 0.16); background: #fff; color: var(--mo7-text); }
        .mo7-error { font-size: 0.9rem; color: var(--mo7-danger); }
        .mo7-flash { margin-bottom: 18px; padding: 14px 16px; border-radius: 16px; background: rgba(15, 118, 110, 0.1); color: var(--mo7-accent); font-weight: 700; }
        .mo7-empty { margin: 0; color: var(--mo7-muted); line-height: 1.7; }
        .mo7-pagination { margin-top: 18px; }
        .mo7-auth { min-height: 100vh; display: grid; place-items: center; padding: 24px; }
        .mo7-auth__card { width: min(100%, 1080px); display: grid; grid-template-columns: minmax(0, 1fr) minmax(380px, 0.9fr); background: rgba(255, 255, 255, 0.86); border: 1px solid var(--mo7-border); border-radius: 32px; overflow: hidden; box-shadow: var(--mo7-shadow); }
        .mo7-auth__hero { padding: 40px; background: linear-gradient(145deg, #111827 0%, #312e81 100%); color: #eef2ff; }
        .mo7-auth__hero h1 { margin: 16px 0 0; font-family: Georgia, "Times New Roman", serif; font-size: clamp(2.3rem, 4vw, 4rem); line-height: 0.98; }
        .mo7-auth__hero p { margin: 16px 0 0; color: rgba(238, 242, 255, 0.74); line-height: 1.8; }
        .mo7-auth__panel { padding: 40px; background: rgba(255, 255, 255, 0.82); }
        .mo7-auth__panel h2 { margin: 0; font-family: Georgia, "Times New Roman", serif; font-size: 2rem; line-height: 1.1; }
        .mo7-auth__panel p { margin: 12px 0 0; color: var(--mo7-muted); line-height: 1.7; }
        .mo7-checkbox { display: inline-flex; align-items: center; gap: 10px; color: var(--mo7-muted); }
        @media (max-width: 1080px) { .mo7-grid--stats { grid-template-columns: repeat(2, minmax(0, 1fr)); } .mo7-grid--content { grid-template-columns: 1fr; } .mo7-auth__card { grid-template-columns: 1fr; } }
        @media (max-width: 820px) { .mo7-dashboard { grid-template-columns: 1fr; } .mo7-sidebar { position: static; min-height: auto; } .mo7-topbar { flex-direction: column; align-items: flex-start; } .mo7-form__grid { grid-template-columns: 1fr; } }
        @media (max-width: 640px) { .mo7-main { padding: 16px; } .mo7-grid--stats { grid-template-columns: 1fr; } .mo7-toolbar { flex-direction: column; align-items: flex-start; } .mo7-auth__hero, .mo7-auth__panel { padding: 24px; } }
    </style>
</head>
<body>
    @php
        $currentRoute = request()->route()?->getName();
        $user = auth()->user();
        $navItems = [
            ['label' => 'Dashboard', 'route' => 'dashboard.index', 'meta' => 'Vue generale'],
            ['label' => 'Utilisateurs', 'route' => 'dashboard.users.index', 'meta' => 'Comptes et acces'],
            ['label' => 'Parametres', 'route' => 'dashboard.settings', 'meta' => 'Placeholder'],
        ];
    @endphp

    @if (trim($__env->yieldContent('auth-page')))
        @yield('content')
    @else
        <div class="mo7-dashboard">
            <aside class="mo7-sidebar">
                <div class="mo7-brand">
                    <span class="mo7-brand__eyebrow">Dashboard</span>
                    <strong class="mo7-brand__name">Mo7assib</strong>
                    <p class="mo7-brand__copy">Socle Laravel pour les comptes, l administration et les prochains modules metier.</p>
                </div>
                <nav class="mo7-nav" aria-label="Navigation principale">
                    @foreach ($navItems as $item)
                        <a class="mo7-nav__link {{ $currentRoute === $item['route'] ? 'mo7-nav__link--active' : '' }}" href="{{ route($item['route']) }}">
                            <span class="mo7-nav__label">{{ $item['label'] }}</span>
                            <span class="mo7-nav__meta">{{ $item['meta'] }}</span>
                        </a>
                    @endforeach
                </nav>
                <div class="mo7-sidebar__footer">
                    <form method="POST" action="{{ route('logout') }}">
                        @csrf
                        <button class="mo7-logout" type="submit">Deconnexion</button>
                    </form>
                </div>
            </aside>

            <main class="mo7-main">
                <header class="mo7-topbar">
                    <div>
                        <h1 class="mo7-topbar__title">{{ $pageHeading ?? 'Dashboard Mo7assib' }}</h1>
                        <p class="mo7-topbar__subtitle">{{ $pageDescription ?? 'Pilotage initial du socle Laravel dashboard.' }}</p>
                    </div>
                    <div class="mo7-topbar__account">
                        <span class="mo7-status">Espace protege</span>
                        <div class="mo7-avatar">{{ strtoupper(substr($user->name ?? 'M', 0, 1)) }}</div>
                        <div class="mo7-avatar__meta">
                            <strong>{{ $user->name ?? 'Utilisateur' }}</strong>
                            <span>{{ ucfirst($user->role ?? 'manager') }}</span>
                        </div>
                    </div>
                </header>

                @if (session('status'))
                    <div class="mo7-flash">{{ session('status') }}</div>
                @endif

                @yield('content')
            </main>
        </div>
    @endif
</body>
</html>
