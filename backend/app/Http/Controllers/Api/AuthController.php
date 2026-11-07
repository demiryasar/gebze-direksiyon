<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $admin = Admin::where('email', $request->email)->first();

        if (! $admin || ! Hash::check($request->password, $admin->password)) {
            throw ValidationException::withMessages([
                'email' => ['Kimlik bilgileri hatalı.'],
            ]);
        }

        $token = $admin->createToken('admin-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'admin' => ['name' => $admin->name, 'email' => $admin->email],
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Çıkış yapıldı.']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password'     => 'required|min:6|confirmed',
        ], [
            'current_password.required' => 'Mevcut şifrenizi girmelisiniz.',
            'new_password.required'     => 'Yeni şifrenizi girmelisiniz.',
            'new_password.min'          => 'Yeni şifreniz en az 6 karakter olmalıdır.',
            'new_password.confirmed'    => 'Yeni şifreler birbiriyle uyuşmuyor.',
        ]);

        $admin = $request->user();

        if (! Hash::check($request->current_password, $admin->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Mevcut şifreniz yanlış.'],
            ]);
        }

        $admin->password = $request->new_password;
        $admin->save();

        return response()->json(['message' => 'Şifreniz başarıyla güncellendi!']);
    }
}
