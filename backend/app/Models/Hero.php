<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hero extends Model
{
    protected $table = 'hero';
    protected $fillable = ['title', 'subtitle', 'cta_text', 'cta_url', 'background_image', 'mobile_background_image'];
}
