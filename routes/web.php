<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Dashboard\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return auth()->check()
        ? redirect()->route('dashboard.index')
        : redirect()->route('login');
});

Route::middleware('guest')->group(function () {
    Route::get('/login', array(AuthenticatedSessionController::class, 'create'))->name('login');
    Route::post('/login', array(AuthenticatedSessionController::class, 'store'))->name('login.store');
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', array(AuthenticatedSessionController::class, 'destroy'))->name('logout');

    Route::prefix('dashboard')->name('dashboard.')->group(function () {
        Route::get('/', array(DashboardController::class, 'index'))->name('index');
        Route::get('/users', array(UserController::class, 'index'))->name('users.index');
        Route::get('/users/create', array(UserController::class, 'create'))->name('users.create');
        Route::post('/users', array(UserController::class, 'store'))->name('users.store');
        Route::view('/settings', 'dashboard.settings')->name('settings');
    });
});
