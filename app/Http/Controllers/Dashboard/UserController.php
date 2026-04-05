<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

class UserController extends Controller
{
    public function index(): View
    {
        $users = User::query()
            ->latest()
            ->paginate(12);

        return view('dashboard.users.index', compact('users'));
    }

    public function create(): View
    {
        return view('dashboard.users.create', array(
            'roles' => User::roles(),
            'statuses' => User::statuses(),
        ));
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate(array(
            'name' => array('required', 'string', 'max:255'),
            'email' => array('required', 'string', 'email', 'max:255', 'unique:users,email'),
            'password' => array('required', 'string', 'min:8'),
            'role' => array('required', Rule::in(User::roles())),
            'status' => array('required', Rule::in(User::statuses())),
        ));

        User::create($data);

        return redirect()
            ->route('dashboard.users.index')
            ->with('status', 'Utilisateur cree avec succes.');
    }
}
