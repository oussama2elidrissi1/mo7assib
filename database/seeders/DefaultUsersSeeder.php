<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DefaultUsersSeeder extends Seeder
{
    public function run(): void
    {
        $users = array(
            array(
                'name' => 'Oussama Dev',
                'email' => 'dev@mo7assib.ma',
                'password' => 'admin123456',
                'role' => User::ROLE_DEV,
                'status' => User::STATUS_ACTIVE,
            ),
            array(
                'name' => 'Admin Mo7assib',
                'email' => 'admin@mo7assib.ma',
                'password' => 'admin123456',
                'role' => User::ROLE_ADMIN,
                'status' => User::STATUS_ACTIVE,
            ),
        );

        foreach ($users as $payload) {
            User::updateOrCreate(
                array('email' => $payload['email']),
                $payload
            );
        }
    }
}
