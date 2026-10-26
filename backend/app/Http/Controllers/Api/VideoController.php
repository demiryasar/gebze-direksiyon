<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class VideoController extends Controller
{
    // Public
    public function index()
    {
        return Video::where('is_active', true)->orderBy('order')->get();
    }

    // Admin
    public function all()
    {
        return Video::orderBy('order')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'type'        => 'required|in:youtube,vimeo,file',
            'url'         => 'nullable|url|required_if:type,youtube|required_if:type,vimeo',
            'video'       => 'nullable|file|mimes:mp4,mov,avi,webm|max:204800|required_if:type,file',
            'thumbnail'   => 'nullable|image|max:5120',
            'order'       => 'nullable|integer',
            'is_active'   => 'nullable|in:0,1',
        ]);

        // FormData'dan gelen '1'/'0' string'ini boolean'a cast et
        if (isset($data['is_active'])) {
            $data['is_active'] = (bool) $data['is_active'];
        }

        if ($request->hasFile('video')) {
            $data['file_path'] = $request->file('video')->store('videos', 'public');
        }

        if ($request->hasFile('thumbnail')) {
            $data['thumbnail'] = $request->file('thumbnail')->store('thumbnails', 'public');
        }

        unset($data['video']);

        return response()->json(Video::create($data), 201);
    }

public function update(Request $request, Video $video)
{
    // Validasyonu güncelliyoruz (POST ile geldiği için kuralları 'sometimes' yapıyoruz)
    $data = $request->validate([
        'title'       => 'sometimes|required|string|max:255',
        'description' => 'nullable|string',
        'type'        => 'sometimes|required|in:youtube,vimeo,file',
        'url'         => 'nullable|url',
        'video'       => 'nullable|file|mimes:mp4,mov,avi,webm|max:204800',
        'thumbnail'   => 'sometimes|nullable',
        'order'       => 'nullable|integer',
        'is_active'   => 'nullable|in:0,1',
    ]);

    if (isset($data['is_active'])) {
        $data['is_active'] = (bool) $data['is_active'];
    }

    // Yeni video dosyası yüklendiyse eskisini sil ve yenisini kaydet
    if ($request->hasFile('video')) {
        if ($video->file_path) {
            Storage::disk('public')->delete($video->file_path);
        }
        $data['file_path'] = $request->file('video')->store('videos', 'public');
    }

    // Yeni kapak resmi (thumbnail) yüklendiyse eskisini sil ve yenisini kaydet
    if ($request->hasFile('thumbnail')) {
        if ($video->thumbnail) {
            Storage::disk('public')->delete($video->thumbnail);
        }
        $data['thumbnail'] = $request->file('thumbnail')->store('thumbnails', 'public');
    } else {
        // Yeni dosya seçilmediyse veritabanındaki eski kapak resminin silinmesini önle
        unset($data['thumbnail']);
    }

    unset($data['video']);
    $video->update($data);

    return response()->json($video);
}

    public function destroy(Video $video)
    {
        if ($video->file_path) {
            Storage::disk('public')->delete($video->file_path);
        }
        if ($video->thumbnail) {
            Storage::disk('public')->delete($video->thumbnail);
        }
        $video->delete();

        return response()->json(['message' => 'Silindi.']);
    }
}
