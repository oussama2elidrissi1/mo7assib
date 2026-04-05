@extends('layouts.dashboard', [
    'title' => 'Nouvel utilisateur | Mo7assib',
    'pageHeading' => 'Ajouter un utilisateur',
    'pageDescription' => 'Creation rapide d un compte dashboard avec role et statut.',
])

@section('content')
    <article class="mo7-card">
        <div class="mo7-toolbar">
            <div>
                <h2 class="mo7-card__title">Nouveau compte</h2>
                <p class="mo7-card__copy">Ajoutez un acces pour un developpeur, un administrateur ou un manager.</p>
            </div>
            <a class="mo7-button mo7-button--secondary" href="{{ route('dashboard.users.index') }}">Retour a la liste</a>
        </div>

        <form class="mo7-form" method="POST" action="{{ route('dashboard.users.store') }}">
            @csrf
            <div class="mo7-form__grid">
                <div class="mo7-field">
                    <label for="name">Nom</label>
                    <input id="name" class="mo7-input" type="text" name="name" value="{{ old('name') }}" required>
                    @error('name')<span class="mo7-error">{{ $message }}</span>@enderror
                </div>
                <div class="mo7-field">
                    <label for="email">Email</label>
                    <input id="email" class="mo7-input" type="email" name="email" value="{{ old('email') }}" required>
                    @error('email')<span class="mo7-error">{{ $message }}</span>@enderror
                </div>
            </div>

            <div class="mo7-form__grid">
                <div class="mo7-field">
                    <label for="password">Mot de passe</label>
                    <input id="password" class="mo7-input" type="password" name="password" required>
                    @error('password')<span class="mo7-error">{{ $message }}</span>@enderror
                </div>
                <div class="mo7-field">
                    <label for="role">Role</label>
                    <select id="role" class="mo7-select" name="role" required>
                        @foreach ($roles as $role)
                            <option value="{{ $role }}" @selected(old('role', 'manager') === $role)>{{ ucfirst($role) }}</option>
                        @endforeach
                    </select>
                    @error('role')<span class="mo7-error">{{ $message }}</span>@enderror
                </div>
            </div>

            <div class="mo7-field" style="max-width: 320px;">
                <label for="status">Statut</label>
                <select id="status" class="mo7-select" name="status" required>
                    @foreach ($statuses as $status)
                        <option value="{{ $status }}" @selected(old('status', 'active') === $status)>{{ ucfirst($status) }}</option>
                    @endforeach
                </select>
                @error('status')<span class="mo7-error">{{ $message }}</span>@enderror
            </div>

            <div>
                <button class="mo7-button" type="submit">Creer le compte</button>
            </div>
        </form>
    </article>
@endsection
