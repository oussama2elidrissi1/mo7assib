@extends('layouts.dashboard', [
    'title' => 'Dashboard | Mo7assib',
    'pageHeading' => 'Dashboard',
    'pageDescription' => 'Vue d ensemble des comptes, de l activite recente et des acces rapides.',
])

@section('content')
    <section class="mo7-grid mo7-grid--stats">
        <article class="mo7-card mo7-stat">
            <span class="mo7-card__eyebrow">Utilisateurs</span>
            <strong class="mo7-stat__value">{{ $stats['total_users'] }}</strong>
            <span class="mo7-stat__meta">Nombre total de comptes disponibles dans le dashboard.</span>
        </article>
        <article class="mo7-card mo7-stat">
            <span class="mo7-card__eyebrow">Comptes actifs</span>
            <strong class="mo7-stat__value">{{ $stats['active_users'] }}</strong>
            <span class="mo7-stat__meta">Utilisateurs actifs et capables de se connecter.</span>
        </article>
        <article class="mo7-card mo7-stat">
            <span class="mo7-card__eyebrow">Admins / Devs</span>
            <strong class="mo7-stat__value">{{ $stats['admin_dev_users'] }}</strong>
            <span class="mo7-stat__meta">Comptes a privileges eleves pour le pilotage initial.</span>
        </article>
        <article class="mo7-card mo7-stat">
            <span class="mo7-card__eyebrow">Etat systeme</span>
            <strong class="mo7-stat__value">{{ $stats['system_state'] }}</strong>
            <span class="mo7-stat__meta">Placeholder pour les checks backend, jobs et integrations futures.</span>
        </article>
    </section>

    <section class="mo7-grid mo7-grid--content">
        <article class="mo7-card">
            <h2 class="mo7-card__title">Activite recente</h2>
            <p class="mo7-card__copy">Premier flux visible pour suivre les comptes recemment ajoutes sur la plateforme.</p>
            <div class="mo7-list">
                @forelse ($recentUsers as $recentUser)
                    <div class="mo7-list__item">
                        <div>
                            <strong>{{ $recentUser->name }}</strong>
                            <span>{{ $recentUser->email }} · Cree le {{ $recentUser->created_at->format('d/m/Y H:i') }}</span>
                        </div>
                        <span class="mo7-pill">{{ $recentUser->role }}</span>
                    </div>
                @empty
                    <p class="mo7-empty">Aucune activite recente disponible pour le moment.</p>
                @endforelse
            </div>
        </article>

        <article class="mo7-card">
            <h2 class="mo7-card__title">Acces rapide</h2>
            <p class="mo7-card__copy">Raccourcis utiles pour continuer le setup du dashboard.</p>
            <div class="mo7-list">
                @foreach ($quickLinks as $link)
                    <a class="mo7-quicklink" href="{{ $link['url'] }}">
                        <div>
                            <strong>{{ $link['label'] }}</strong>
                            <span>{{ $link['description'] }}</span>
                        </div>
                        <span class="mo7-pill">Ouvrir</span>
                    </a>
                @endforeach
            </div>
        </article>
    </section>
@endsection
