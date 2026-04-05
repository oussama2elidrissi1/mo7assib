@extends('layouts.dashboard', [
    'title' => 'Utilisateurs | Mo7assib',
    'pageHeading' => 'Utilisateurs',
    'pageDescription' => 'Gestion initiale des comptes, des roles et des statuts.',
])

@section('content')
    <article class="mo7-card">
        <div class="mo7-toolbar">
            <div>
                <h2 class="mo7-card__title">Liste des comptes</h2>
                <p class="mo7-card__copy">Base prete pour evoluer vers des permissions plus fines et des modules metier.</p>
            </div>
            <a class="mo7-button" href="{{ route('dashboard.users.create') }}">Ajouter un utilisateur</a>
        </div>

        <div class="mo7-table-wrap">
            <table class="mo7-table">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Statut</th>
                        <th>Cree le</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($users as $user)
                        <tr>
                            <td>
                                <span class="mo7-table__primary">{{ $user->name }}</span>
                                <span class="mo7-table__secondary">ID #{{ $user->id }}</span>
                            </td>
                            <td>{{ $user->email }}</td>
                            <td><span class="mo7-badge mo7-badge--role-{{ $user->role }}">{{ $user->role }}</span></td>
                            <td><span class="mo7-badge mo7-badge--status-{{ $user->status }}">{{ $user->status }}</span></td>
                            <td>{{ $user->created_at->format('d/m/Y H:i') }}</td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5"><p class="mo7-empty">Aucun utilisateur disponible pour le moment.</p></td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <div class="mo7-pagination">
            {{ $users->links() }}
        </div>
    </article>
@endsection
