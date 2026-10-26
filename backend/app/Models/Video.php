<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    protected $fillable = ['title', 'description', 'type', 'url', 'file_path', 'thumbnail', 'order', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function getVideoSourceAttribute(): string
    {
        return $this->type === 'file' ? ($this->file_path ?? '') : ($this->url ?? '');
    }
}
