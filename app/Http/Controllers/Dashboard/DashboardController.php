<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\View\View;

class DashboardController extends Controller
{
    public function index(): View
    {
        $stats = array(
            'total_users' => User::count(),
            'active_users' => User::query()->where('status', User::STATUS_ACTIVE)->count(),
            'admin_dev_users' => User::query()
                ->whereIn('role', array(User::ROLE_ADMIN, User::ROLE_DEV))
                ->count(),
            'system_state' => 'Operationnel',
        );

        $recentUsers = User::query()
            ->latest()
            ->take(5)
            ->get();

        $quickLinks = array(
            array(
                'label' => 'Voir les utilisateurs',
                'description' => 'Acceder a la liste des comptes dashboard.',
                'url' => route('dashboard.users.index'),
            ),
            array(
                'label' => 'Ajouter un compte',
                'description' => 'Creer un nouvel acces pour votre equipe.',
                'url' => route('dashboard.users.create'),
            ),
            array(
                'label' => 'Parametres',
                'description' => 'Espace reserve aux prochains modules.',
                'url' => route('dashboard.settings'),
            ),
        );

        return view('dashboard.index', compact('stats', 'recentUsers', 'quickLinks'));
    }
}
