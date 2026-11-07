<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('admin:reset-password {password?}', function ($password = null) {
    $admin = \App\Models\Admin::first();
    if (!$admin) {
        $this->error('Admin hesabı bulunamadı!');
        return;
    }

    $newPassword = $password ?: $this->secret('Yeni admin şifresini girin');
    if (!$newPassword) {
        $this->error('Şifre boş olamaz!');
        return;
    }

    $admin->password = $newPassword;
    $admin->save();

    $this->info("Admin şifresi başarıyla güncellendi! (E-posta: {$admin->email})");
})->purpose('Admin kullanıcısının şifresini sıfırlar');
