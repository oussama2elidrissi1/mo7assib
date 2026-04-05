@extends('layouts.dashboard', [
    'title' => 'Parametres | Mo7assib',
    'pageHeading' => 'Parametres',
    'pageDescription' => 'Espace reserve aux prochains reglages du dashboard.',
])

@section('content')
    <article class="mo7-card">
        <h2 class="mo7-card__title">Module en preparation</h2>
        <p class="mo7-card__copy">
            Cette section servira a centraliser les futurs reglages du dashboard, la configuration du sous-domaine,
            les integrations Laravel/API et les options des modules clients, abonnements, factures et analytics.
        </p>
    </article>
@endsection
