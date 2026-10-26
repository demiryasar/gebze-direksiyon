<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    // Public
    public function index()
    {
        return Service::where('is_active', true)->orderBy('order')->get();
    }

    // Admin
    public function all()
    {
        return Service::orderBy('order')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'icon'        => 'nullable|string|max:50',
            'order'       => 'nullable|integer',
            'is_active'   => 'nullable|boolean',
        ]);

        return response()->json(Service::create($data), 201);
    }

    public function update(Request $request, Service $service)
    {
        $data = $request->validate([
            'title'       => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'icon'        => 'nullable|string|max:50',
            'order'       => 'nullable|integer',
            'is_active'   => 'nullable|boolean',
        ]);

        $service->update($data);

        return response()->json($service);
    }

    public function destroy(Service $service)
    {
        $service->delete();

        return response()->json(['message' => 'Silindi.']);
    }
}
