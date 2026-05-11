<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Dashboard\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;

// ── Landing page ──────────────────────────────────────────────────────────────
// Visiteurs non connectés → welcome page
// Utilisateurs connectés  → dashboard
Route::get('/', function () {
    return auth()->check()
        ? redirect()->route('dashboard.index')
        : view('welcome');
})->name('home');

// ── Waitlist ──────────────────────────────────────────────────────────────────
// Inscription à la liste d'attente Mo7assib.
// Stocke les données en log pour l'instant.
// TODO: ajouter table `waitlist_entries` + notification email.
Route::post('/waitlist', function (Request $request) {
    $validated = $request->validate([
        'name'     => 'required|string|max:150',
        'email'    => 'required|email|max:200',
        'phone'    => 'nullable|string|max:30',
        'company'  => 'nullable|string|max:150',
        'activity' => 'nullable|string|max:100',
        'city'     => 'nullable|string|max:100',
        'message'  => 'nullable|string|max:2000',
    ]);

    Log::info('[Mo7assib] Waitlist submission', $validated);

    return response()->json(['success' => true]);
})->name('waitlist.store');

// ── Auth ──────────────────────────────────────────────────────────────────────
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login.store');
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    Route::prefix('dashboard')->name('dashboard.')->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('index');
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::view('/settings', 'dashboard.settings')->name('settings');
    });
});
