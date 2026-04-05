@extends('layouts.dashboard', [
    'title' => 'Connexion | Mo7assib Dashboard',
])

@section('auth-page', 'true')

@section('content')
    <div class="mo7-auth">
        <div class="mo7-auth__card">
            <section class="mo7-auth__hero">
                <span class="mo7-brand__eyebrow">Acces securise</span>
                <h1>Pilotez le dashboard Mo7assib depuis un espace protege.</h1>
                <p>Connectez-vous avec votre compte developpeur ou administrateur pour acceder au premier socle Laravel du produit.</p>
            </section>

            <section class="mo7-auth__panel">
                <h2>Connexion</h2>
                <p>Entrez vos identifiants pour rejoindre le dashboard.</p>

                <form class="mo7-form" method="POST" action="{{ route('login.store') }}" style="margin-top: 24px;">
                    @csrf
                    <div class="mo7-field">
                        <label for="email">Email</label>
                        <input id="email" class="mo7-input" type="email" name="email" value="{{ old('email') }}" required autofocus>
                        @error('email')<span class="mo7-error">{{ $message }}</span>@enderror
                    </div>
                    <div class="mo7-field">
                        <label for="password">Mot de passe</label>
                        <input id="password" class="mo7-input" type="password" name="password" required>
                        @error('password')<span class="mo7-error">{{ $message }}</span>@enderror
                    </div>
                    <label class="mo7-checkbox" for="remember">
                        <input id="remember" type="checkbox" name="remember" value="1">
                        <span>Se souvenir de moi</span>
                    </label>
                    <button class="mo7-button" type="submit">Se connecter</button>
                </form>
            </section>
        </div>
    </div>
@endsection
