<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    // Public: only approved
    public function index()
    {
        return Review::where('status', 'approved')
            ->latest()
            ->get();
    }

    // Public: submit review
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'    => 'required|string|max:100',
            'rating'  => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:1000',
        ]);

        $review = Review::create($data); // status defaults to 'pending'

        return response()->json([
            'message' => 'Yorumunuz alındı, onaylandıktan sonra yayınlanacaktır.',
            'review'  => $review,
        ], 201);
    }

    // Admin: all reviews
    public function all(Request $request)
    {
        $status = $request->query('status');
        $query  = Review::latest();
        if ($status) {
            $query->where('status', $status);
        }

        return $query->get();
    }

    // Admin: approve
    public function approve(Review $review)
    {
        $review->update(['status' => 'approved']);

        return response()->json($review);
    }

    // Admin: reject
    public function reject(Review $review)
    {
        $review->update(['status' => 'rejected']);

        return response()->json($review);
    }

    // Admin: delete
    public function destroy(Review $review)
    {
        $review->delete();

        return response()->json(['message' => 'Silindi.']);
    }
}
