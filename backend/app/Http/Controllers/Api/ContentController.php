<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\About;
use App\Models\Hero;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ContentController extends Controller
{
    // ─── PUBLIC ─────────────────────────────────────────────

    public function siteData()
    {
        return response()->json([
            'hero'     => Hero::first(),
            'about'    => About::first(),
            'settings' => Setting::all()->pluck('value', 'key'),
        ]);
    }

    // ─── ADMIN ──────────────────────────────────────────────

    public function updateHero(Request $request)
    {
        $data = $request->validate([
        'title'                   => 'required|string|max:255',
        'subtitle'                => 'nullable|string|max:500',
        'cta_text'                => 'nullable|string|max:100',
        'cta_url'                 => 'nullable|string|max:255',
        'background_image'        => 'sometimes|nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        'mobile_background_image' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
    ]);

        $hero = Hero::firstOrNew([]);

        // Masaüstü Arka Planı İşlemi
        if ($request->hasFile('background_image')) {
            if ($hero->background_image) {
                Storage::disk('public')->delete($hero->background_image);
            }
            $data['background_image'] = $request->file('background_image')->store('hero', 'public');
        }

        // Mobil Arka Planı İşlemi
        if ($request->hasFile('mobile_background_image')) {
            if ($hero->mobile_background_image) {
                Storage::disk('public')->delete($hero->mobile_background_image);
            }
            $data['mobile_background_image'] = $request->file('mobile_background_image')->store('hero/mobile', 'public');
        }

        $hero->fill($data)->save();

        return response()->json($hero);
    }

    public function updateAbout(Request $request)
    {
        $data = $request->validate([
            'content' => 'required|string',
            'stats'   => 'nullable', // JSON string geleceği için array kuralını kaldırıyoruz
            'image'   => 'sometimes|nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $about = About::firstOrNew([]);


        // 2. React'tan gelen JSON string'i PHP array'ine geri çeviriyoruz
        if (!empty($request->stats) && is_string($request->stats)) {
            $data['stats'] = json_decode($request->stats, true);
        }

        if ($request->hasFile('image')) {
            if ($about->image) {
                Storage::disk('public')->delete($about->image);
            }
            $data['image'] = $request->file('image')->store('about', 'public');
        }

        $about->fill($data)->save();

        return response()->json($about);
    }

    public function updateSettings(Request $request)
    {
        $data = $request->validate([
            'phone'     => 'nullable|string|max:30',
            'email'     => 'nullable|email|max:100',
            'address'   => 'nullable|string|max:500',
            'whatsapp'  => 'nullable|string|max:30',
            'instagram' => 'nullable|string|max:255',
            'facebook'  => 'nullable|string|max:255',
            'youtube'   => 'nullable|string|max:255',
            'map_embed' => 'nullable|string',
        ]);

        foreach ($data as $key => $value) {
            Setting::set($key, $value);
        }

        return response()->json(['message' => 'Ayarlar güncellendi.']);
    }
}
